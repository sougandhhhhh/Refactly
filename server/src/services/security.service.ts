export interface SecurityFinding {
  line: number;
  type: string;
  cwe: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
}

const securityPatterns = [
  {
    type: "SQL Injection",
    cwe: "CWE-89",
    severity: "critical" as const,
    pattern: /(\$|db\.|query|execute|run)\s*\(\s*[`'"]\s*SELECT|INSERT|UPDATE|DELETE/i,
    description: "Potential SQL injection detected. Use parameterized queries instead of string concatenation.",
    lineExtractor: (code: string, regex: RegExp): number[] => {
      const lines = code.split("\n");
      const matches: number[] = [];
      lines.forEach((line, i) => {
        if (regex.test(line) && /\+|`|\$\{/.test(line)) {
          matches.push(i + 1);
        }
      });
      return matches;
    },
  },
  {
    type: "Cross-Site Scripting (XSS)",
    cwe: "CWE-79",
    severity: "critical" as const,
    pattern: /innerHTML|outerHTML|document\.write|eval\(|setTimeout\(|setInterval\(/i,
    description: "Potential XSS vulnerability. Avoid using innerHTML, eval(), or document.write(). Use textContent or safe DOM APIs instead.",
    lineExtractor: (code: string, regex: RegExp): number[] => {
      const lines = code.split("\n");
      const matches: number[] = [];
      lines.forEach((line, i) => {
        if (regex.test(line)) {
          matches.push(i + 1);
        }
      });
      return matches;
    },
  },
  {
    type: "Hardcoded Secret",
    cwe: "CWE-798",
    severity: "high" as const,
    pattern: /(?:api[_-]?key|secret|password|token|credential)\s*[:=]\s*['"][a-zA-Z0-9]{16,}['"]/i,
    description: "Hardcoded secret detected. Store credentials in environment variables or a secrets manager.",
    lineExtractor: (code: string, regex: RegExp): number[] => {
      const lines = code.split("\n");
      const matches: number[] = [];
      lines.forEach((line, i) => {
        if (regex.test(line)) {
          matches.push(i + 1);
        }
      });
      return matches;
    },
  },
  {
    type: "Prototype Pollution",
    cwe: "CWE-1321",
    severity: "high" as const,
    pattern: /__proto__|constructor\.prototype/i,
    description: "Potential prototype pollution vulnerability. Avoid directly manipulating __proto__ or constructor.prototype.",
    lineExtractor: (code: string, regex: RegExp): number[] => {
      const lines = code.split("\n");
      const matches: number[] = [];
      lines.forEach((line, i) => {
        if (regex.test(line)) {
          matches.push(i + 1);
        }
      });
      return matches;
    },
  },
  {
    type: "Insecure Randomness",
    cwe: "CWE-338",
    severity: "medium" as const,
    pattern: /Math\.random\(\)/i,
    description: "Math.random() is not cryptographically secure. Use crypto.randomBytes() or Web Crypto API for security-sensitive operations.",
    lineExtractor: (code: string, regex: RegExp): number[] => {
      const lines = code.split("\n");
      const matches: number[] = [];
      lines.forEach((line, i) => {
        if (regex.test(line)) {
          matches.push(i + 1);
        }
      });
      return matches;
    },
  },
  {
    type: "Path Traversal",
    cwe: "CWE-22",
    severity: "high" as const,
    pattern: /readFileSync|readFile|writeFileSync|writeFile|readdirSync|readdir|createReadStream/i,
    description: "Potential path traversal. Validate and sanitize user-supplied file paths.",
    lineExtractor: (code: string, regex: RegExp): number[] => {
      const lines = code.split("\n");
      const matches: number[] = [];
      lines.forEach((line, i) => {
        if (regex.test(line) && (line.includes("../") || line.includes("..\\"))) {
          matches.push(i + 1);
        }
      });
      return matches;
    },
  },
];

export function scanForVulnerabilities(code: string): SecurityFinding[] {
  const findings: SecurityFinding[] = [];

  for (const rule of securityPatterns) {
    const lines = rule.lineExtractor(code, rule.pattern);
    for (const line of lines) {
      findings.push({
        line,
        type: rule.type,
        cwe: rule.cwe,
        severity: rule.severity,
        description: rule.description,
      });
    }
  }

  return findings;
}
