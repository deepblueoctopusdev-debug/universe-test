import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Network,
  GitBranch,
  Database,
  ArrowRight,
  Layers,
  Workflow,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  ChevronDown,
  ChevronRight,
  FileText,
  Box,
  Link2,
  Eye,
} from "lucide-react";

interface UmlClass {
  name: string;
  stereotype?: string;
  isAbstract?: boolean;
  isSingleton?: boolean;
  properties: { name: string; type: string; visibility: "+" | "-" | "#" | "~" }[];
  methods: { name: string; returnType: string; visibility: "+" | "#" | "~"; params?: string }[];
  sourceFile?: string;
}

interface UmlRelationship {
  from: string;
  to: string;
  type: "extends" | "implements" | "composition" | "aggregation" | "dependency" | "association";
  label?: string;
  multiplicity?: string;
}

interface UmlDiagram {
  id: string;
  title: string;
  description: string;
  category: "class" | "sequence" | "architecture" | "er" | "dataflow";
  classes: UmlClass[];
  relationships: UmlRelationship[];
}

const CATEGORY_ICONS: Record<string, any> = {
  class: Box,
  sequence: Workflow,
  architecture: Layers,
  er: Database,
  dataflow: GitBranch,
};

const CATEGORY_COLORS: Record<string, string> = {
  class: "bg-blue-500/10 text-blue-600 border-blue-200",
  sequence: "bg-purple-500/10 text-purple-600 border-purple-200",
  architecture: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  er: "bg-amber-500/10 text-amber-600 border-amber-200",
  dataflow: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
};

const RELATIONSHIP_STYLES: Record<string, { color: string; dash?: string }> = {
  extends: { color: "#1e40af" },
  implements: { color: "#7c3aed", dash: "8,4" },
  composition: { color: "#059669" },
  aggregation: { color: "#d97706" },
  dependency: { color: "#6b7280", dash: "4,4" },
  association: { color: "#374151" },
};

const VISIBILITY_ICONS: Record<string, string> = {
  "+": "public",
  "-": "private",
  "#": "protected",
  "~": "package",
};

function layoutClasses(classes: UmlClass[], width: number) {
  const COLS = Math.min(3, classes.length);
  const COL_WIDTH = Math.max(280, (width - 40) / COLS);
  const ROW_HEIGHT = 40;

  return classes.map((cls, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const methodCount = cls.methods.length;
    const propCount = cls.properties.length;
    const headerHeight = cls.stereotype ? 50 : 36;
    const boxHeight = headerHeight + propCount * ROW_HEIGHT + (propCount > 0 ? 1 : 0) + methodCount * ROW_HEIGHT + 12;

    return {
      cls,
      x: col * (COL_WIDTH + 20) + 20,
      y: row * 320 + 20,
      width: COL_WIDTH,
      height: boxHeight,
      centerX: col * (COL_WIDTH + 20) + 20 + COL_WIDTH / 2,
      centerY: row * 320 + 20 + boxHeight / 2,
    };
  });
}

function findBoxAt(layout: ReturnType<typeof layoutClasses>, x: number, y: number) {
  for (const box of layout) {
    if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
      return box;
    }
  }
  return null;
}

function renderClassBox(box: ReturnType<typeof layoutClasses>[0], highlighted: boolean) {
  const { cls, x, y, width, height } = box;
  const ROW_H = 40;
  const headerH = cls.stereotype ? 50 : 36;

  return (
    <g key={cls.name} className="uml-class-box">
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        fill={highlighted ? "#eff6ff" : "#ffffff"}
        stroke={highlighted ? "#3b82f6" : "#cbd5e1"}
        strokeWidth={highlighted ? 2 : 1}
        className="transition-colors"
      />

      <rect
        x={x}
        y={y}
        width={width}
        height={headerH}
        rx={4}
        fill={cls.stereotype === "interface" ? "#ede9fe" : cls.stereotype === "singleton" ? "#ecfdf5" : "#f0f9ff"}
      />
      <rect x={x} y={y + headerH - 4} width={width} height={4} fill={cls.stereotype === "interface" ? "#ede9fe" : cls.stereotype === "singleton" ? "#ecfdf5" : "#f0f9ff"} />

      {cls.stereotype && (
        <text
          x={x + width / 2}
          y={y + 14}
          textAnchor="middle"
          fontSize={10}
          fill="#6b7280"
          fontStyle="italic"
        >
          &lt;&lt;{cls.stereotype}&gt;&gt;
        </text>
      )}

      <text
        x={x + width / 2}
        y={y + (cls.stereotype ? 34 : 24)}
        textAnchor="middle"
        fontSize={13}
        fontWeight="bold"
        fill="#1e293b"
        fontFamily="system-ui"
      >
        {cls.name}
      </text>

      <line x1={x} y1={y + headerH} x2={x + width} y2={y + headerH} stroke="#e2e8f0" strokeWidth={1} />

      {cls.properties.map((prop, i) => (
        <g key={prop.name}>
          <text
            x={x + 8}
            y={y + headerH + 16 + i * ROW_H}
            fontSize={11}
            fill="#475569"
            fontFamily="monospace"
          >
            <tspan fill={prop.visibility === "+" ? "#059669" : prop.visibility === "-" ? "#dc2626" : "#6b7280"}>
              {prop.visibility}
            </tspan>
            {" "}
            <tspan fontWeight="500">{prop.name}</tspan>
            <tspan fill="#94a3b8">: {prop.type}</tspan>
          </text>
        </g>
      ))}

      {cls.properties.length > 0 && cls.methods.length > 0 && (
        <line
          x1={x}
          y1={y + headerH + cls.properties.length * ROW_H}
          x2={x + width}
          y2={y + headerH + cls.properties.length * ROW_H}
          stroke="#e2e8f0"
          strokeWidth={1}
        />
      )}

      {cls.methods.map((method, i) => {
        const baseY = y + headerH + cls.properties.length * ROW_H;
        return (
          <g key={method.name}>
            <text
              x={x + 8}
              y={baseY + 16 + i * ROW_H}
              fontSize={11}
              fill="#475569"
              fontFamily="monospace"
            >
              <tspan fill={method.visibility === "+" ? "#059669" : method.visibility === "#" ? "#d97706" : "#6b7280"}>
                {method.visibility}
              </tspan>
              {" "}
              <tspan fontWeight="500">{method.name}</tspan>
              <tspan fill="#94a3b8">
                ({method.params || ""}): {method.returnType}
              </tspan>
            </text>
          </g>
        );
      })}
    </g>
  );
}

function renderArrow(
  from: ReturnType<typeof layoutClasses>[0],
  to: ReturnType<typeof layoutClasses>[0],
  rel: UmlRelationship,
  svgWidth: number
) {
  const style = RELATIONSHIP_STYLES[rel.type] || { color: "#6b7280" };

  let fx = from.centerX;
  let fy = from.y + from.height;
  let tx = to.centerX;
  let ty = to.y;

  if (from.y > to.y) {
    fy = from.y;
    ty = to.y + to.height;
  } else if (Math.abs(from.y - to.y) < 20) {
    if (from.x < to.x) {
      fx = from.x + from.width;
      tx = to.x;
    } else {
      fx = from.x;
      tx = to.x + to.width;
    }
    fy = from.centerY;
    ty = to.centerY;
  }

  const dx = tx - fx;
  const dy = ty - fy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / len;
  const ny = dy / len;

  const endX = tx - nx * 6;
  const endY = ty - ny * 6;

  const midX = (fx + tx) / 2;
  const midY = (fy + ty) / 2;

  const markerId = `arrow-${rel.type}-${rel.from}-${rel.to}`;

  return (
    <g key={`${rel.from}-${rel.to}-${rel.type}`}>
      <defs>
        <marker
          id={markerId}
          markerWidth={rel.type === "composition" ? 12 : 10}
          markerHeight={rel.type === "composition" ? 10 : 8}
          refX={rel.type === "composition" ? 10 : 8}
          refY={4}
          orient="auto"
        >
          {rel.type === "extends" ? (
            <polygon points="0,0 10,4 0,8" fill="none" stroke={style.color} strokeWidth={1.5} />
          ) : rel.type === "implements" ? (
            <polygon points="0,0 10,4 0,8" fill="none" stroke={style.color} strokeWidth={1.5} />
          ) : rel.type === "composition" ? (
            <>
              <polygon points="0,0 6,4 0,8" fill={style.color} />
              <polygon points="4,0 10,4 4,8" fill="none" stroke={style.color} strokeWidth={1.5} />
            </>
          ) : rel.type === "aggregation" ? (
            <>
              <polygon points="0,0 6,4 0,8" fill="none" stroke={style.color} strokeWidth={1.5} />
              <polygon points="4,0 10,4 4,8" fill="none" stroke={style.color} strokeWidth={1.5} />
            </>
          ) : (
            <polygon points="0,0 10,4 0,8" fill={style.color} />
          )}
        </marker>
      </defs>

      <line
        x1={fx}
        y1={fy}
        x2={endX}
        y2={endY}
        stroke={style.color}
        strokeWidth={1.5}
        strokeDasharray={style.dash}
        markerEnd={`url(#${markerId})`}
      />

      {rel.label && (
        <g>
          <rect
            x={midX - (rel.label.length * 4 + 8)}
            y={midY - 10}
            width={rel.label.length * 7 + 16}
            height={20}
            rx={3}
            fill="white"
            stroke={style.color}
            strokeWidth={0.5}
            opacity={0.95}
          />
          <text
            x={midX}
            y={midY + 3}
            textAnchor="middle"
            fontSize={9}
            fill={style.color}
            fontFamily="monospace"
          >
            {rel.label}
          </text>
        </g>
      )}
    </g>
  );
}

function UmlCanvas({
  diagram,
  highlightedClass,
  onClassClick,
}: {
  diagram: UmlDiagram;
  highlightedClass: string | null;
  onClassClick: (name: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const svgWidth = Math.max(900, diagram.classes.length > 3 ? 960 : 640);
  const svgHeight = Math.max(600, Math.ceil(diagram.classes.length / 3) * 340 + 40);

  const layout = useMemo(() => layoutClasses(diagram.classes, svgWidth), [diagram.classes, svgWidth]);

  const classPositions = useMemo(() => {
    const map: Record<string, ReturnType<typeof layoutClasses>[0]> = {};
    layout.forEach((b) => { map[b.cls.name] = b; });
    return map;
  }, [layout]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, panX, panY };
      e.preventDefault();
    }
  }, [panX, panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPanX(panStartRef.current.panX + (e.clientX - panStartRef.current.x));
      setPanY(panStartRef.current.panY + (e.clientY - panStartRef.current.y));
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  return (
    <div className="relative bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="h-7 w-7 p-0 bg-white/90">
          <ZoomIn className="w-3 h-3" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))} className="h-7 w-7 p-0 bg-white/90">
          <ZoomOut className="w-3 h-3" />
        </Button>
        <Button variant="outline" size="sm" onClick={resetView} className="h-7 w-7 p-0 bg-white/90">
          <Maximize className="w-3 h-3" />
        </Button>
      </div>

      <div className="overflow-auto max-h-[600px]">
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          className="select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isPanning ? "grabbing" : "default" }}
        >
          <g transform={`translate(${panX},${panY}) scale(${zoom})`}>
            <defs>
              <pattern id="grid" width={20} height={20} patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth={0.5} opacity={0.5} />
              </pattern>
            </defs>
            <rect width={svgWidth} height={svgHeight} fill="white" />
            <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

            {diagram.relationships.map((rel) => {
              const from = classPositions[rel.from];
              const to = classPositions[rel.to];
              if (!from || !to) return null;
              return renderArrow(from, to, rel, svgWidth);
            })}

            {layout.map((box) => (
              <g
                key={box.cls.name}
                onClick={() => onClassClick(box.cls.name)}
                style={{ cursor: "pointer" }}
              >
                {renderClassBox(box, highlightedClass === box.cls.name)}
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

function SequenceDiagramView({ diagram }: { diagram: UmlDiagram }) {
  const participants = diagram.classes;
  const PARTICIPANT_WIDTH = 140;
  const PARTICIPANT_GAP = 40;
  const HEADER_HEIGHT = 60;
  const ROW_HEIGHT = 80;
  const totalWidth = participants.length * (PARTICIPANT_WIDTH + PARTICIPANT_GAP) + 60;
  const totalHeight = HEADER_HEIGHT + diagram.relationships.length * ROW_HEIGHT + 120;

  return (
    <div className="overflow-auto max-h-[600px] bg-slate-50 rounded-lg border border-slate-200">
      <svg width={totalWidth} height={totalHeight}>
        <rect width={totalWidth} height={totalHeight} fill="white" />
        <defs>
          <pattern id="seqGrid" width={20} height={20} patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth={0.5} opacity={0.3} />
          </pattern>
        </defs>
        <rect width={totalWidth} height={totalHeight} fill="url(#seqGrid)" />

        {participants.map((p, i) => {
          const x = 30 + i * (PARTICIPANT_WIDTH + PARTICIPANT_GAP);
          return (
            <g key={p.name}>
              <rect x={x} y={10} width={PARTICIPANT_WIDTH} height={40} rx={4} fill="#f0f9ff" stroke="#3b82f6" strokeWidth={1.5} />
              <text x={x + PARTICIPANT_WIDTH / 2} y={34} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#1e40af" fontFamily="system-ui">
                {p.name}
              </text>
              <line x1={x + PARTICIPANT_WIDTH / 2} y1={50} x2={x + PARTICIPANT_WIDTH / 2} y2={totalHeight - 20} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4,4" />
            </g>
          );
        })}

        {diagram.relationships.map((rel, i) => {
          const fromIdx = participants.findIndex((p) => p.name === rel.from);
          const toIdx = participants.findIndex((p) => p.name === rel.to);
          if (fromIdx < 0 || toIdx < 0) return null;

          const fromX = 30 + fromIdx * (PARTICIPANT_WIDTH + PARTICIPANT_GAP) + PARTICIPANT_WIDTH / 2;
          const toX = 30 + toIdx * (PARTICIPANT_WIDTH + PARTICIPANT_GAP) + PARTICIPANT_WIDTH / 2;
          const y = HEADER_HEIGHT + 20 + i * ROW_HEIGHT;

          const style = RELATIONSHIP_STYLES.dependency;
          const arrowX = fromX < toX ? toX - 6 : toX + 6;

          return (
            <g key={`${rel.from}-${rel.to}-${i}`}>
              <line x1={fromX} y1={y} x2={toX} y2={y} stroke={style.color} strokeWidth={1.5} markerEnd={fromX < toX ? "url(#seqArrow)" : "url(#seqArrowRev)"} />
              <rect x={(fromX + toX) / 2 - (rel.label || "").length * 3.5 - 4} y={y - 14} width={(rel.label || "").length * 7 + 8} height={18} rx={3} fill="white" stroke="#e2e8f0" strokeWidth={0.5} />
              <text x={(fromX + toX) / 2} y={y - 1} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="monospace">
                {rel.label || rel.type}
              </text>
            </g>
          );
        })}

        <defs>
          <marker id="seqArrow" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
            <polygon points="0,0 8,3 0,6" fill="#6b7280" />
          </marker>
          <marker id="seqArrowRev" markerWidth={8} markerHeight={6} refX={0} refY={3} orient="auto">
            <polygon points="8,0 0,3 8,6" fill="#6b7280" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

function ArchitectureDiagramView({ diagram }: { diagram: UmlDiagram }) {
  const LAYER_HEIGHT = 80;
  const LAYER_GAP = 8;
  const LAYER_WIDTH = 700;
  const totalHeight = diagram.classes.length * (LAYER_HEIGHT + LAYER_GAP) + 40;

  const layerColors = [
    { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
    { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
    { bg: "#fefce8", border: "#eab308", text: "#854d0e" },
    { bg: "#fdf2f8", border: "#ec4899", text: "#9d174d" },
    { bg: "#faf5ff", border: "#a855f7", text: "#6b21a8" },
  ];

  return (
    <div className="overflow-auto max-h-[600px] bg-slate-50 rounded-lg border border-slate-200">
      <svg width={LAYER_WIDTH + 40} height={totalHeight}>
        <defs>
          <pattern id="archGrid" width={20} height={20} patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth={0.5} opacity={0.3} />
          </pattern>
          <marker id="archDown" markerWidth={8} markerHeight={6} refX={4} refY={6} orient="auto">
            <polygon points="0,0 8,0 4,6" fill="#6b7280" />
          </marker>
        </defs>
        <rect width={LAYER_WIDTH + 40} height={totalHeight} fill="white" />
        <rect width={LAYER_WIDTH + 40} height={totalHeight} fill="url(#archGrid)" />

        {diagram.classes.map((cls, i) => {
          const y = 20 + i * (LAYER_HEIGHT + LAYER_GAP);
          const colors = layerColors[i % layerColors.length];
          return (
            <g key={cls.name}>
              <rect x={20} y={y} width={LAYER_WIDTH} height={LAYER_HEIGHT} rx={6} fill={colors.bg} stroke={colors.border} strokeWidth={1.5} />
              <text x={LAYER_WIDTH / 2 + 20} y={y + 22} textAnchor="middle" fontSize={12} fontWeight="bold" fill={colors.text} fontFamily="system-ui">
                {cls.name}
              </text>
              {cls.stereotype && (
                <text x={LAYER_WIDTH / 2 + 20} y={y + 38} textAnchor="middle" fontSize={10} fill={colors.text} fontFamily="monospace" opacity={0.7}>
                  [{cls.stereotype}]
                </text>
              )}
              {cls.properties.map((p, j) => (
                <text key={p.name} x={36} y={y + 56 + j * 14} fontSize={9} fill="#6b7280" fontFamily="monospace">
                  {p.name}: {p.type}
                </text>
              ))}
              {cls.methods.map((m, j) => (
                <text key={m.name} x={LAYER_WIDTH - 36} y={y + 56 + j * 14} textAnchor="end" fontSize={9} fill="#6b7280" fontFamily="monospace">
                  {m.name}({m.params || ""})
                </text>
              ))}
            </g>
          );
        })}

        {diagram.relationships.map((rel, i) => {
          const fromIdx = diagram.classes.findIndex((c) => c.name === rel.from);
          const toIdx = diagram.classes.findIndex((c) => c.name === rel.to);
          if (fromIdx < 0 || toIdx < 0) return null;

          const fromY = 20 + fromIdx * (LAYER_HEIGHT + LAYER_GAP) + LAYER_HEIGHT;
          const toY = 20 + toIdx * (LAYER_HEIGHT + LAYER_GAP);
          const cx = LAYER_WIDTH / 2 + 20;

          return (
            <line key={`${rel.from}-${rel.to}`} x1={cx} y1={fromY + 2} x2={cx} y2={toY - 2} stroke="#6b7280" strokeWidth={1.5} markerEnd="url(#archDown)" />
          );
        })}
      </svg>
    </div>
  );
}

function DiagramDetail({ diagram, highlightedClass }: { diagram: UmlDiagram; highlightedClass: string | null }) {
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {(() => {
            const Icon = CATEGORY_ICONS[diagram.category] || Box;
            return <Icon className="w-4 h-4" />;
          })()}
          <CardTitle className="text-sm">{diagram.title}</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">
            {diagram.classes.length} classes
          </Badge>
        </div>
        <CardDescription className="text-xs">{diagram.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-1">
            {diagram.classes.map((cls) => (
              <div
                key={cls.name}
                className={`rounded-md border transition-colors ${
                  highlightedClass === cls.name
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedClass(expandedClass === cls.name ? null : cls.name)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left"
                >
                  {expandedClass === cls.name ? (
                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                  <span className="text-xs font-mono font-semibold text-slate-800">{cls.name}</span>
                  {cls.stereotype && (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                      {cls.stereotype}
                    </Badge>
                  )}
                  {cls.sourceFile && (
                    <span className="text-[10px] text-slate-400 ml-auto truncate max-w-[200px]">{cls.sourceFile}</span>
                  )}
                </button>

                {expandedClass === cls.name && (
                  <div className="px-3 pb-2 space-y-2 border-t border-slate-100">
                    {cls.properties.length > 0 && (
                      <div>
                        <div className="text-[9px] font-bold uppercase text-slate-400 mt-2 mb-1">Properties</div>
                        {cls.properties.map((p) => (
                          <div key={p.name} className="text-[11px] font-mono text-slate-600 flex gap-1">
                            <span className={`w-3 ${
                              p.visibility === "+" ? "text-emerald-600" : p.visibility === "-" ? "text-red-500" : "text-amber-600"
                            }`}>{p.visibility}</span>
                            <span className="font-medium">{p.name}</span>
                            <span className="text-slate-400">: {p.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {cls.methods.length > 0 && (
                      <div>
                        <div className="text-[9px] font-bold uppercase text-slate-400 mt-2 mb-1">Methods</div>
                        {cls.methods.map((m) => (
                          <div key={m.name} className="text-[11px] font-mono text-slate-600">
                            <span className={`w-3 ${
                              m.visibility === "+" ? "text-emerald-600" : m.visibility === "#" ? "text-amber-600" : "text-slate-400"
                            }`}>{m.visibility}</span>
                            <span className="font-medium">{m.name}</span>
                            <span className="text-slate-400">({m.params || ""}): {m.returnType}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {diagram.relationships.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-[9px] font-bold uppercase text-slate-400 mb-1">Relationships</div>
            <div className="space-y-0.5">
              {diagram.relationships.map((rel, i) => (
                <div key={i} className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                  <span className="text-slate-800 font-medium">{rel.from}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                  <span className="text-slate-800 font-medium">{rel.to}</span>
                  <Badge variant="outline" className="text-[8px] px-1 py-0 ml-1">{rel.type}</Badge>
                  {rel.label && <span className="text-slate-400">({rel.label})</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function UmlDiagramViewer() {
  const [diagrams, setDiagrams] = useState<UmlDiagram[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<UmlDiagram | null>(null);
  const [highlightedClass, setHighlightedClass] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/uml/diagrams", { credentials: "include" })
      .then((r) => r.json())
      .then(async (list) => {
        if (list.success && list.data) {
          const full: UmlDiagram[] = [];
          for (const summary of list.data) {
            const res = await fetch(`/api/uml/diagrams/${summary.id}`, { credentials: "include" });
            const detail = await res.json();
            if (detail.success) full.push(detail.data);
          }
          setDiagrams(full);
          if (full.length > 0) setSelectedDiagram(full[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        setDiagrams([
          {
            id: "server-engines",
            title: "Server Engines",
            description: "Core game engine and combat engine class diagrams",
            category: "class",
            classes: [
              {
                name: "GameEngine",
                sourceFile: "server/gameEngine.ts",
                properties: [
                  { name: "resourceService", type: "ResourceService", visibility: "-" },
                  { name: "fleetService", type: "FleetService", visibility: "-" },
                  { name: "technologyService", type: "TechnologyService", visibility: "-" },
                ],
                methods: [
                  { name: "update", returnType: "void", visibility: "+" },
                  { name: "calculateProduction", returnType: "ProductionOutput", visibility: "~", params: "buildings, research" },
                  { name: "processResourceTick", returnType: "ResourceTickResult", visibility: "~", params: "userId" },
                  { name: "processCoreGameTick", returnType: "GameTickResult", visibility: "~", params: "userId" },
                ],
              },
              {
                name: "CombatEngine",
                sourceFile: "server/combatEngine.ts",
                properties: [
                  { name: "UNIT_STATS", type: "Record<UnitType, UnitStats>", visibility: "-" },
                  { name: "RESEARCH_BONUSES", type: "Record<Tech, number>", visibility: "-" },
                ],
                methods: [
                  { name: "getUnitStats", returnType: "Stats", visibility: "+", params: "type, research, bonus" },
                  { name: "calculateDamage", returnType: "number", visibility: "+", params: "atk, def, crit" },
                  { name: "simulateBattle", returnType: "BattleResult", visibility: "+", params: "atk, def" },
                ],
              },
            ],
            relationships: [
              { from: "GameEngine", to: "ResourceService", type: "composition" },
              { from: "GameEngine", to: "FleetService", type: "composition" },
            ],
          },
          {
            id: "architecture-layers",
            title: "5-Layer Architecture",
            description: "The complete 5-layer framework architecture",
            category: "architecture",
            classes: [
              { name: "Layer 1: Presentation", stereotype: "React Pages", properties: [{ name: "93 page components", type: "React.FC", visibility: "+" }], methods: [{ name: "render", returnType: "JSX.Element", visibility: "+" }] },
              { name: "Layer 2: Client Logic", stereotype: "React Context + Libs", properties: [{ name: "GameProvider", type: "React.Context", visibility: "+" }], methods: [{ name: "apiRequest", returnType: "Promise", visibility: "+" }] },
              { name: "Layer 3: API Transport", stereotype: "Routes + Middleware", properties: [{ name: "60+ route files", type: "Express", visibility: "+" }], methods: [{ name: "isAuthenticated", returnType: "Middleware", visibility: "+" }] },
              { name: "Layer 4: Server Logic", stereotype: "Services + Engines", properties: [{ name: "29 services", type: "Service[]", visibility: "+" }], methods: [{ name: "processGameTick", returnType: "TickResult", visibility: "+" }] },
              { name: "Layer 5: Data", stereotype: "Schema + Storage", properties: [{ name: "72 tables", type: "DrizzleORM", visibility: "+" }], methods: [{ name: "query", returnType: "Result", visibility: "+" }] },
            ],
            relationships: [
              { from: "Layer 1: Presentation", to: "Layer 2: Client Logic", type: "dependency" },
              { from: "Layer 2: Client Logic", to: "Layer 3: API Transport", type: "dependency" },
              { from: "Layer 3: API Transport", to: "Layer 4: Server Logic", type: "dependency" },
              { from: "Layer 4: Server Logic", to: "Layer 5: Data", type: "dependency" },
            ],
          },
          {
            id: "database-er",
            title: "Database ERD (Core)",
            description: "Entity relationships for the core database tables",
            category: "er",
            classes: [
              { name: "users", stereotype: "table", properties: [{ name: "id", type: "UUID (PK)", visibility: "+" }, { name: "username", type: "VARCHAR(UQ)", visibility: "+" }, { name: "passwordHash", type: "VARCHAR", visibility: "+" }], methods: [] },
              { name: "playerStates", stereotype: "table", properties: [{ name: "userId", type: "UUID (FK)", visibility: "+" }, { name: "resources", type: "JSONB", visibility: "+" }, { name: "buildings", type: "JSONB", visibility: "+" }, { name: "units", type: "JSONB", visibility: "+" }], methods: [] },
              { name: "battles", stereotype: "table", properties: [{ name: "id", type: "UUID (PK)", visibility: "+" }, { name: "attackerId", type: "UUID (FK)", visibility: "+" }, { name: "defenderId", type: "UUID (FK)", visibility: "+" }], methods: [] },
              { name: "alliances", stereotype: "table", properties: [{ name: "id", type: "UUID (PK)", visibility: "+" }, { name: "name", type: "VARCHAR", visibility: "+" }, { name: "tag", type: "VARCHAR", visibility: "+" }], methods: [] },
              { name: "marketOrders", stereotype: "table", properties: [{ name: "id", type: "UUID (PK)", visibility: "+" }, { name: "type", type: "VARCHAR", visibility: "+" }, { name: "resource", type: "VARCHAR", visibility: "+" }], methods: [] },
            ],
            relationships: [
              { from: "users", to: "playerStates", type: "association", label: "1:1" },
              { from: "users", to: "battles", type: "association", label: "attacker" },
              { from: "users", to: "alliances", type: "aggregation", label: "member" },
              { from: "users", to: "marketOrders", type: "association", label: "creator" },
            ],
          },
          {
            id: "sequence-auth",
            title: "Authentication Flow",
            description: "Sequence of events during user authentication",
            category: "sequence",
            classes: [
              { name: "Client", properties: [], methods: [{ name: "POST /api/auth/login", returnType: "Response", visibility: "+" }] },
              { name: "Express Server", properties: [], methods: [{ name: "verifyPassword", returnType: "boolean", visibility: "+" }, { name: "session.create", returnType: "Session", visibility: "+" }] },
              { name: "Database", properties: [], methods: [{ name: "db.select", returnType: "Row[]", visibility: "+" }] },
              { name: "SessionStore", properties: [], methods: [{ name: "set", returnType: "void", visibility: "+" }] },
            ],
            relationships: [
              { from: "Client", to: "Express Server", type: "dependency", label: "1. Login Request" },
              { from: "Express Server", to: "Database", type: "dependency", label: "2. Query User" },
              { from: "Database", to: "Express Server", type: "dependency", label: "3. Return User" },
              { from: "Express Server", to: "SessionStore", type: "dependency", label: "4. Store Session" },
            ],
          },
        ]);
        setLoading(false);
      });
  }, []);

  const filteredDiagrams = useMemo(() => {
    return diagrams.filter((d) => {
      if (activeCategory !== "all" && d.category !== activeCategory) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          d.title.toLowerCase().includes(term) ||
          d.description.toLowerCase().includes(term) ||
          d.classes.some((c) => c.name.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [diagrams, activeCategory, searchTerm]);

  const stats = useMemo(() => {
    const totalClasses = diagrams.reduce((sum, d) => sum + d.classes.length, 0);
    const totalRels = diagrams.reduce((sum, d) => sum + d.relationships.length, 0);
    const categories = [...new Set(diagrams.map((d) => d.category))];
    return { totalDiagrams: diagrams.length, totalClasses, totalRelationships: totalRels, categories };
  }, [diagrams]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Network className="w-8 h-8 text-primary animate-pulse" />
          <p className="text-sm text-slate-500">Loading UML diagrams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-orbitron font-bold text-slate-800">UML Diagram Viewer</h1>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline" className="text-[10px]">
              <FileText className="w-3 h-3 mr-1" />
              {stats.totalDiagrams} diagrams
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              <Box className="w-3 h-3 mr-1" />
              {stats.totalClasses} classes
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              <Link2 className="w-3 h-3 mr-1" />
              {stats.totalRelationships} relationships
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search diagrams..."
                className="h-7 text-xs pl-7"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1 p-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-2 py-0.5 text-[10px] font-medium rounded-sm transition-colors ${
                activeCategory === "all" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {(["class", "sequence", "architecture", "er", "dataflow"] as const).map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Box;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-sm transition-colors ${
                    activeCategory === cat ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-2.5 h-2.5" />
                  {cat}
                </button>
              );
            })}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredDiagrams.map((d) => {
                const Icon = CATEGORY_ICONS[d.category] || Box;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelectedDiagram(d);
                      setHighlightedClass(null);
                    }}
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      selectedDiagram?.id === d.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-800 truncate">{d.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 pl-4.5 truncate">{d.classes.length} classes, {d.relationships.length} links</p>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedDiagram ? (
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-auto p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Badge className={`${CATEGORY_COLORS[selectedDiagram.category]} border text-[10px]`}>
                    {selectedDiagram.category.toUpperCase()}
                  </Badge>
                  <h2 className="text-sm font-semibold text-slate-800">{selectedDiagram.title}</h2>
                  <span className="text-[10px] text-slate-400 ml-auto">
                    {selectedDiagram.classes.length} classes, {selectedDiagram.relationships.length} relationships
                  </span>
                </div>

                {selectedDiagram.category === "sequence" ? (
                  <SequenceDiagramView diagram={selectedDiagram} />
                ) : selectedDiagram.category === "architecture" || selectedDiagram.category === "dataflow" ? (
                  <ArchitectureDiagramView diagram={selectedDiagram} />
                ) : (
                  <UmlCanvas
                    diagram={selectedDiagram}
                    highlightedClass={highlightedClass}
                    onClassClick={(name) => setHighlightedClass(highlightedClass === name ? null : name)}
                  />
                )}

                <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-blue-800 inline-block" />
                    extends
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-purple-600 inline-block border-t border-dashed" style={{ borderTop: "1px dashed #7c3aed" }} />
                    implements
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-emerald-600 inline-block" />
                    composition
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-amber-600 inline-block" />
                    aggregation
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-slate-500 inline-block" style={{ borderTop: "1px dashed #6b7280" }} />
                    dependency
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-slate-700 inline-block" />
                    association
                  </span>
                </div>
              </div>

              <div className="w-72 shrink-0 border-l border-slate-200 overflow-hidden">
                <DiagramDetail diagram={selectedDiagram} highlightedClass={highlightedClass} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Network className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a diagram to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
