import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

export interface ASTNode {
  id: string;
  type: "function" | "variable" | "import" | "class";
  name: string;
  line: number;
  complexity?: number;
}

export interface ASTEdge {
  source: string;
  target: string;
  relation: string;
}

export interface ASTResult {
  nodes: ASTNode[];
  edges: ASTEdge[];
  cyclomaticComplexity: number;
  functionCount: number;
  importCount: number;
}

function calculateCyclomaticComplexity(path: t.Node): number {
  let complexity = 1;
  traverse(path as any, {
    IfStatement() { complexity++; },
    ConditionalExpression() { complexity++; },
    LogicalExpression() { complexity++; },
    ForStatement() { complexity++; },
    WhileStatement() { complexity++; },
    DoWhileStatement() { complexity++; },
    ForInStatement() { complexity++; },
    ForOfStatement() { complexity++; },
    SwitchCase() { complexity++; },
    CatchClause() { complexity++; },
  });
  return complexity;
}

export function analyzeAST(code: string, language: string): ASTResult {
  const nodes: ASTNode[] = [];
  const edges: ASTEdge[] = [];
  const nodeIdMap = new Map<string, string>();

  let parsed;
  try {
    parsed = parse(code, {
      sourceType: "module",
      plugins: language === "typescript" ? ["typescript", "jsx"] : ["jsx"],
      errorRecovery: true,
    });
  } catch {
    return { nodes, edges, cyclomaticComplexity: 0, functionCount: 0, importCount: 0 };
  }

  let functionIdCounter = 0;
  let varIdCounter = 0;
  let importIdCounter = 0;
  let classIdCounter = 0;

  traverse(parsed, {
    FunctionDeclaration(path) {
      const name = path.node.id?.name || `anonymous_${functionIdCounter}`;
      const id = `func_${functionIdCounter++}`;
      const complexity = calculateCyclomaticComplexity(path.node);
      nodes.push({
        id,
        type: "function",
        name,
        line: path.node.loc?.start.line || 0,
        complexity,
      });
      nodeIdMap.set(name, id);
    },
    FunctionExpression(path) {
      const name = path.node.id?.name || `anonymous_${functionIdCounter}`;
      const id = `func_${functionIdCounter++}`;
      const complexity = calculateCyclomaticComplexity(path.node);
      nodes.push({
        id,
        type: "function",
        name,
        line: path.node.loc?.start.line || 0,
        complexity,
      });
    },
    ArrowFunctionExpression(path) {
      const parent = path.parentPath;
      if (t.isVariableDeclarator(parent.node)) {
        const name = (parent.node.id as t.Identifier)?.name || `arrow_${functionIdCounter}`;
        const id = `func_${functionIdCounter++}`;
        const complexity = calculateCyclomaticComplexity(path.node);
        nodes.push({
          id,
          type: "function",
          name,
          line: path.node.loc?.start.line || 0,
          complexity,
        });
      }
    },
    VariableDeclarator(path) {
      if (t.isIdentifier(path.node.id)) {
        const name = path.node.id.name;
        const id = `var_${varIdCounter++}`;
        nodes.push({
          id,
          type: "variable",
          name,
          line: path.node.loc?.start.line || 0,
        });
      }
    },
    ImportDeclaration(path) {
      const source = path.node.source.value;
      for (const specifier of path.node.specifiers) {
        const name = specifier.local.name;
        const id = `import_${importIdCounter++}`;
        nodes.push({
          id,
          type: "import",
          name: `${name} from "${source}"`,
          line: path.node.loc?.start.line || 0,
        });
        edges.push({
          source: id,
          target: `module_${source}`,
          relation: "imports",
        });
      }
    },
    ClassDeclaration(path) {
      const name = path.node.id?.name || `class_${classIdCounter}`;
      const id = `class_${classIdCounter++}`;
      nodes.push({
        id,
        type: "class",
        name,
        line: path.node.loc?.start.line || 0,
      });
    },
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee)) {
        const calleeName = path.node.callee.name;
        const targetId = nodeIdMap.get(calleeName);
        if (targetId && path.node.loc) {
          const parent = path.getFunctionParent();
          if (parent) {
            const parentNode = parent.node;
            let parentName = "";
            if (t.isFunctionDeclaration(parentNode) && parentNode.id) {
              parentName = parentNode.id.name;
            }
            const parentId = nodeIdMap.get(parentName);
            if (parentId) {
              edges.push({
                source: parentId,
                target: targetId,
                relation: "calls",
              });
            }
          }
        }
      }
    },
  });

  const totalComplexity = nodes
    .filter((n) => n.complexity)
    .reduce((sum, n) => sum + (n.complexity || 0), 0);

  return {
    nodes,
    edges,
    cyclomaticComplexity: totalComplexity,
    functionCount: nodes.filter((n) => n.type === "function").length,
    importCount: nodes.filter((n) => n.type === "import").length,
  };
}
