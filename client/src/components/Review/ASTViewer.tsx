import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ReviewResult } from "@/lib/api";

type ASTViewerProps = {
  ast: ReviewResult["ast"] | null;
  isLoading: boolean;
  error?: string | null;
};

type GraphNode = {
  id: string;
  name: string;
  type: string;
  line: number;
  complexity?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

const fillByType: Record<string, string> = {
  function: "#2C5038",
  variable: "#A67C2E",
  import: "#1C2E4A",
};

const shapeByType: Record<string, string> = {
  function: "circle",
  variable: "rect",
  import: "polygon",
};

export function ASTViewer({ ast, isLoading, error }: ASTViewerProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ast || !hostRef.current) return;

    const width = hostRef.current.clientWidth || 340;
    const height = 260;
    const graphNodes = ast.nodes.map((n) => ({ ...n, type: n.type })) as GraphNode[];
    const graphLinks = ast.edges.map((e) => ({ source: e.source, target: e.target }));

    const simulation = forceSimulation(graphNodes)
      .force("charge", forceManyBody().strength(-120))
      .force("center", forceCenter(width / 2, height / 2))
      .force("link", forceLink(graphLinks).id((d) => (d as GraphNode).id).distance(72))
      .on("tick", () => {
        setNodes([...graphNodes]);
      });

    return () => { simulation.stop(); };
  }, [ast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cognac-dark">Review Failed</p>
        <p className="mt-3 font-elegant text-lg italic text-charcoal-light">{error}</p>
        <p className="mt-6 font-body text-sm text-charcoal-light/70">Try again in a moment.</p>
      </div>
    );
  }

  if (!ast) {
    return (
      <div className="py-12 text-center">
        <p className="font-elegant text-2xl italic text-charcoal-light">
          Run a review to see the AST graph.
        </p>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <p className="eyebrow">AST Graph</p>
      <p className="mt-2 font-body text-base text-charcoal-light">
        {ast.cyclomaticComplexity} cyclomatic complexity &middot; {ast.functionCount} functions &middot; {ast.importCount} imports
      </p>
      <div ref={hostRef} className="mt-6">
        <svg viewBox="0 0 360 260" className="w-full">
          {ast.edges.map((link, i) => {
            const source = nodes.find((n) => n.id === link.source);
            const target = nodes.find((n) => n.id === link.target);
            if (!source || !target) return null;
            return (
              <line
                key={`${link.source}-${link.target}-${i}`}
                x1={source.x ?? 0}
                y1={source.y ?? 0}
                x2={target.x ?? 0}
                y2={target.y ?? 0}
                stroke="#C8BDB0"
                strokeWidth="1"
              />
            );
          })}
          {nodes.map((node) => (
            <g
              key={node.id}
              className="cursor-pointer"
              onClick={() => setActiveNode(node)}
              transform={`translate(${node.x ?? 0}, ${node.y ?? 0})`}
            >
              {shapeByType[node.type] === "circle" ? <circle r="18" fill={fillByType[node.type]} /> : null}
              {shapeByType[node.type] === "rect" ? <rect x="-16" y="-16" width="32" height="32" fill={fillByType[node.type]} /> : null}
              {shapeByType[node.type] === "polygon" ? (
                <polygon points="0,-18 18,0 0,18 -18,0" fill={fillByType[node.type]} />
              ) : null}
              <text y="34" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#6B6460">
                {node.name.replace(/^.*\s/, "")}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className="border-forest-muted/30 bg-forest/10 text-forest-dark">Functions</Badge>
        <Badge className="border-gold-muted/30 bg-gold/10 text-gold-dark">Variables</Badge>
        <Badge className="border-navy-muted/30 bg-navy/10 text-navy-dark">Imports</Badge>
      </div>
      <p className="mt-4 text-lg text-charcoal-light">
        {activeNode
          ? `Selected ${activeNode.type} node on line ${activeNode.line}.`
          : "Select a node to inspect the structure behind the review surface."}
      </p>
    </Card>
  );
}
