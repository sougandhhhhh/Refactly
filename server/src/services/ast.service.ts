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

// JS/TS languages that babel can parse
const JS_LIKES = new Set(["javascript", "typescript", "jsx", "tsx"]);

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

function analyzeByRegex(code: string, _language: string): ASTResult {
  const nodes: ASTNode[] = [];
  let fnCounter = 0, varCounter = 0, classCounter = 0, importCounter = 0;
  const lines = code.split("\n");

  // Detect function declarations
  const fnRegex = /(?:def\s+|function\s+|fn\s+|func\s+|public\s+\w+\s+\w+\s*\(|private\s+\w+\s+\w+\s*\()(\w+)/g;
  // Detect class declarations
  const classRegex = /(?:class\s+)(\w+)/g;
  // Detect imports
  const importRegex = /(?:import\s+|using\s+|require\s*\(|#include\s+)/g;

  let match: RegExpExecArray | null;
  // Reset regex state
  fnRegex.lastIndex = 0;
  classRegex.lastIndex = 0;
  importRegex.lastIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Re-run regex on each line for simplicity
    const fnMatch = line.match(fnRegex);
    if (fnMatch) {
      const nameMatch = line.match(/(?:def|function|fn|func)\s+(\w+)/) || line.match(/(?:public|private|protected)\s+\w+\s+(\w+)\s*\(/);
      nodes.push({
        id: `func_${fnCounter++}`,
        type: "function",
        name: nameMatch ? nameMatch[1] : `fn_${fnCounter}`,
        line: i + 1,
        complexity: 1,
      });
    }

    const clsMatch = line.match(classRegex);
    if (clsMatch) {
      const nameMatch = line.match(/class\s+(\w+)/);
      nodes.push({
        id: `class_${classCounter++}`,
        type: "class",
        name: nameMatch ? nameMatch[1] : `class_${classCounter}`,
        line: i + 1,
      });
    }

    if (importRegex.test(line)) {
      nodes.push({
        id: `import_${importCounter++}`,
        type: "import",
        name: line.trim().slice(0, 50),
        line: i + 1,
      });
    }

    // Simple variable detection
    const varMatch = line.match(/(?:let|var|const|int|String|bool|float|double)\s+(\w+)/);
    if (varMatch) {
      nodes.push({
        id: `var_${varCounter++}`,
        type: "variable",
        name: varMatch[1],
        line: i + 1,
      });
    }
  }

  return {
    nodes,
    edges: [],
    cyclomaticComplexity: nodes.filter((n) => n.type === "function").length,
    functionCount: fnCounter,
    importCount: importCounter,
  };
}

export function analyzeAST(code: string, language: string): ASTResult {
  const nodes: ASTNode[] = [];
  const edges: ASTEdge[] = [];
  const nodeIdMap = new Map<string, string>();

  if (!JS_LIKES.has(language.toLowerCase())) {
    return analyzeByRegex(code, language);
  }

  let parsed;
  try {
    parsed = parse(code, {
      sourceType: "module",
      plugins: language === "typescript" ? ["typescript", "jsx"] : ["jsx"],
      errorRecovery: true,
    });
  } catch {
    return analyzeByRegex(code, language);
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
