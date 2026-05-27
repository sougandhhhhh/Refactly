import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { astLinks, astNodes } from "@/lib/data";

type GraphNode = {
  id: string;
  type: string;
  line: number;
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

export function ASTViewer() {
  const [nodes, setNodes] = useState<GraphNode[]>(astNodes.map((node) => ({ ...node })));
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) {
      return;
    }

    const width = hostRef.current.clientWidth || 340;
    const height = 260;
    const graphNodes = astNodes.map((node) => ({ ...node })) as GraphNode[];
    const graphLinks = astLinks.map((link) => ({ ...link }));

    const simulation = forceSimulation(graphNodes)
      .force("charge", forceManyBody().strength(-120))
      .force("center", forceCenter(width / 2, height / 2))
      .force("link", forceLink(graphLinks).id((d) => (d as GraphNode).id).distance(72))
      .on("tick", () => {
        setNodes([...graphNodes]);
      });

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <Card className="p-6">
      <p className="eyebrow">AST Graph</p>
      <div ref={hostRef} className="mt-6">
        <svg viewBox="0 0 360 260" className="w-full">
          {astLinks.map((link) => {
            const source = nodes.find((node) => node.id === link.source);
            const target = nodes.find((node) => node.id === link.target);

            if (!source || !target) {
              return null;
            }

            return (
              <line
                key={`${link.source}-${link.target}`}
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
              {node.type === "function" ? <circle r="18" fill={fillByType[node.type]} /> : null}
              {node.type === "variable" ? <rect x="-16" y="-16" width="32" height="32" fill={fillByType[node.type]} /> : null}
              {node.type === "import" ? (
                <polygon points="0,-18 18,0 0,18 -18,0" fill={fillByType[node.type]} />
              ) : null}
              <text y="34" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#6B6460">
                {node.id.replace(/^(fn|var|import)-/, "")}
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
