import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export interface ComplexityResult {
  time: string;
  space: string;
  explanation: string;
  perFunction: Array<{
    name: string;
    time: string;
    space: string;
    cyclomaticComplexity: number;
  }>;
}

export function analyzeComplexity(code: string, language: string): ComplexityResult {
  let parsed;
  try {
    parsed = parse(code, {
      sourceType: "module",
      plugins: language === "typescript" ? ["typescript", "jsx"] : ["jsx"],
      errorRecovery: true,
    });
  } catch {
    return {
      time: "Unknown",
      space: "Unknown",
      explanation: "Could not parse code for analysis",
      perFunction: [],
    };
  }

  const functionAnalyses: ComplexityResult["perFunction"] = [];
  let hasNestedLoops = false;
  let hasRecursion = false;
  let maxLoopDepth = 0;
  let loopDepth = 0;
  let maxComplexity = 0;

  traverse(parsed, {
    FunctionDeclaration(path) {
      const name = path.node.id?.name || "anonymous";
      const analysis = analyzeFunction(path.node, name);
      functionAnalyses.push(analysis);
      maxComplexity = Math.max(maxComplexity, analysis.cyclomaticComplexity);
    },
    FunctionExpression(path) {
      const name = path.node.id?.name || "anonymous";
      const analysis = analyzeFunction(path.node, name);
      functionAnalyses.push(analysis);
      maxComplexity = Math.max(maxComplexity, analysis.cyclomaticComplexity);
    },
    ArrowFunctionExpression(path) {
      const parent = path.parentPath;
      if (parent.isVariableDeclarator()) {
        const name = (parent.node.id as any)?.name || "arrow";
        const analysis = analyzeFunction(path.node, name);
        functionAnalyses.push(analysis);
        maxComplexity = Math.max(maxComplexity, analysis.cyclomaticComplexity);
      }
    },
    ForStatement() { maxLoopDepth = Math.max(maxLoopDepth, 1); },
    WhileStatement() { maxLoopDepth = Math.max(maxLoopDepth, 1); },
    ForInStatement() { maxLoopDepth = Math.max(maxLoopDepth, 1); },
    ForOfStatement() { maxLoopDepth = Math.max(maxLoopDepth, 1); },
  });

  let time = "O(1)";
  let space = "O(1)";
  let explanation = "";

  if (hasNestedLoops) {
    time = "O(n²)";
    explanation = "Nested loops detected, suggesting quadratic time complexity.";
  } else if (maxLoopDepth === 1) {
    time = "O(n)";
    explanation = "Single level of iteration detected, suggesting linear time complexity.";
  }

  if (hasRecursion) {
    time = "O(2^n)";
    explanation = "Recursive calls detected without memoization, suggesting exponential time complexity.";
  }

  space = maxLoopDepth > 0 ? "O(n)" : "O(1)";

  const hasArrays = code.includes("[") && code.includes("]");
  if (hasArrays) {
    space = "O(n)";
  }

  if (maxComplexity > 10) {
    explanation += " High cyclomatic complexity detected. Consider breaking down complex functions.";
  }

  return {
    time,
    space,
    explanation: explanation || "Simple code with constant time and space complexity.",
    perFunction: functionAnalyses,
  };
}

function analyzeFunction(node: any, name: string): ComplexityResult["perFunction"][0] {
  let complexity = 1;
  let loops = 0;
  let hasConditionals = false;

  traverse(node as any, {
    IfStatement() { complexity++; hasConditionals = true; },
    ConditionalExpression() { complexity++; },
    ForStatement() { loops++; complexity++; },
    WhileStatement() { loops++; complexity++; },
    ForInStatement() { loops++; complexity++; },
    ForOfStatement() { loops++; complexity++; },
    SwitchCase() { complexity++; },
    CatchClause() { complexity++; },
  });

  const time = loops > 1 ? `O(n^${loops})` : loops === 1 ? "O(n)" : hasConditionals ? "O(n)" : "O(1)";
  const space = loops > 0 ? "O(n)" : "O(1)";

  return { name, time, space, cyclomaticComplexity: complexity };
}
