import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import {
  Globe,
  Send,
  Building2,
  FlaskConical,
  Users,
  Shield,
  ShoppingCart,
  Map,
  Settings,
  AlertTriangle,
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Target,
  Compass,
  Swords,
  Radar,
  Crown,
  Star,
  Ship,
  Landmark,
  BookOpen,
} from "lucide-react";

export interface ViewportPanel {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  side: "left" | "right";
  defaultOpen?: boolean;
  width?: number;
}

const VIEWPORT_PANELS: ViewportPanel[] = [
  { id: "outliner", label: "Outliner", icon: Globe, href: "/", side: "left", defaultOpen: true, width: 260 },
  { id: "situation", label: "Situation Log", icon: AlertTriangle, href: "/universe-events", side: "right", width: 360 },
  { id: "fleets", label: "Fleet", icon: Send, href: "/fleet", side: "right", width: 340 },
  { id: "research", label: "Research", icon: FlaskConical, href: "/research", side: "right", width: 340 },
  { id: "market", label: "Market", icon: ShoppingCart, href: "/market", side: "right", width: 360 },
  { id: "contacts", label: "Contacts", icon: Users, href: "/messages", side: "right", width: 340 },
  { id: "empire", label: "Empire", icon: Building2, href: "/empire-view", side: "right", width: 360 },
  { id: "diplomacy", label: "Diplomacy", icon: Shield, href: "/alliance", side: "right", width: 360 },
  { id: "expansion", label: "Expansion", icon: Map, href: "/colonies", side: "right", width: 340 },
];

interface OutlinerSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: OutlinerItem[];
}

interface OutlinerItem {
  name: string;
  status: string;
  statusColor: string;
  detail?: string;
}

interface ViewportPanelState {
  openPanels: string[];
  minimizedPanels: string[];
  focusedPanel: string | null;
  panelWidths: Record<string, number>;
}

export function ViewportPanelSystem({ children }: { children: React.ReactNode }) {
  const [panelState, setPanelState] = useState<ViewportPanelState>({
    openPanels: ["outliner"],
    minimizedPanels: [],
    focusedPanel: null,
    panelWidths: {},
  });

  const togglePanel = useCallback((panelId: string) => {
    setPanelState((prev) => {
      const isOpen = prev.openPanels.includes(panelId);
      const isMinimized = prev.minimizedPanels.includes(panelId);

      if (isOpen && !isMinimized) {
        return {
          ...prev,
          openPanels: prev.openPanels.filter((id) => id !== panelId),
          minimizedPanels: prev.minimizedPanels.filter((id) => id !== panelId),
          focusedPanel: prev.focusedPanel === panelId ? null : prev.focusedPanel,
        };
      }

      if (isOpen && isMinimized) {
        return {
          ...prev,
          minimizedPanels: prev.minimizedPanels.filter((id) => id !== panelId),
          focusedPanel: panelId,
        };
      }

      return {
        ...prev,
        openPanels: [...prev.openPanels, panelId],
        minimizedPanels: prev.minimizedPanels.filter((id) => id !== panelId),
        focusedPanel: panelId,
      };
    });
  }, []);

  const minimizePanel = useCallback((panelId: string) => {
    setPanelState((prev) => ({
      ...prev,
      minimizedPanels: [...new Set([...prev.minimizedPanels, panelId])],
      focusedPanel: prev.focusedPanel === panelId ? null : prev.focusedPanel,
    }));
  }, []);

  const closePanel = useCallback((panelId: string) => {
    setPanelState((prev) => ({
      ...prev,
      openPanels: prev.openPanels.filter((id) => id !== panelId),
      minimizedPanels: prev.minimizedPanels.filter((id) => id !== panelId),
      focusedPanel: prev.focusedPanel === panelId ? null : prev.focusedPanel,
    }));
  }, []);

  const focusPanel = useCallback((panelId: string) => {
    setPanelState((prev) => ({
      ...prev,
      focusedPanel: panelId,
    }));
  }, []);

  const leftPanels = VIEWPORT_PANELS.filter(
    (p) => p.side === "left" && panelState.openPanels.includes(p.id) && !panelState.minimizedPanels.includes(p.id)
  );
  const rightPanels = VIEWPORT_PANELS.filter(
    (p) => p.side === "right" && panelState.openPanels.includes(p.id) && !panelState.minimizedPanels.includes(p.id)
  );
  const minimizedPanels = VIEWPORT_PANELS.filter(
    (p) => panelState.openPanels.includes(p.id) && panelState.minimizedPanels.includes(p.id)
  );

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Left Outliner Panel */}
      {leftPanels.length > 0 && (
        <div className="flex flex-col border-r border-slate-700/50 shrink-0 overflow-y-auto" style={{ width: 260, background: "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.90) 100%)" }}>
          {leftPanels.map((panel) => (
            <ViewportPanelContent
              key={panel.id}
              panel={panel}
              isFocused={panelState.focusedPanel === panel.id}
              onToggle={() => togglePanel(panel.id)}
              onMinimize={() => minimizePanel(panel.id)}
              onClose={() => closePanel(panel.id)}
              onFocus={() => focusPanel(panel.id)}
            />
          ))}
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}

      {/* Bottom Panel Toggle Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40 flex items-center gap-0 backdrop-blur-md border-t border-slate-700/50 px-1 py-0.5 overflow-x-auto scrollbar-hide" style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.90) 0%, rgba(15,23,42,0.95) 100%)" }}>
        {VIEWPORT_PANELS.map((panel) => {
          const isOpen = panelState.openPanels.includes(panel.id);
          const isMinimized = panelState.minimizedPanels.includes(panel.id);
          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => togglePanel(panel.id)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded transition-all duration-150 whitespace-nowrap",
                isOpen && !isMinimized
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  : isMinimized
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "text-slate-600 hover:text-slate-300 hover:bg-white/5 border border-transparent"
              )}
              title={`${isOpen ? "Close" : "Open"} ${panel.label}`}
            >
              <panel.icon className="w-3 h-3" />
              <span className="hidden xl:inline">{panel.label}</span>
            </button>
          );
        })}
      </div>
      </div>

      {/* Right Context Panels */}
      {rightPanels.length > 0 && (
        <div className="flex flex-col border-l border-slate-700/50 shrink-0 overflow-y-auto" style={{ width: 360, background: "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.90) 100%)" }}>
          {rightPanels.map((panel) => (
            <ViewportPanelContent
              key={panel.id}
              panel={panel}
              isFocused={panelState.focusedPanel === panel.id}
              onToggle={() => togglePanel(panel.id)}
              onMinimize={() => minimizePanel(panel.id)}
              onClose={() => closePanel(panel.id)}
              onFocus={() => focusPanel(panel.id)}
            />
          ))}
        </div>
      )}

      {/* Minimized Panel Indicators */}
      {minimizedPanels.length > 0 && (
        <div className="absolute bottom-10 right-2 z-50 flex flex-col gap-1">
          {minimizedPanels.map((panel) => (
            <button
              key={panel.id}
              type="button"
              onClick={() => togglePanel(panel.id)}
              className="flex items-center gap-1.5 px-2 py-1.5 border border-slate-700/50 rounded text-[10px] font-semibold text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors shadow-lg"
              style={{ background: "rgba(15,23,42,0.95)" }}
            >
              <panel.icon className="w-3 h-3" />
              {panel.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ViewportPanelContent({
  panel,
  isFocused,
  onToggle,
  onMinimize,
  onClose,
  onFocus,
}: {
  panel: ViewportPanel;
  isFocused: boolean;
  onToggle: () => void;
  onMinimize: () => void;
  onClose: () => void;
  onFocus: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col border-b border-slate-200 transition-all duration-150",
        isFocused ? "bg-slate-50" : "bg-transparent",
        panel.side === "left" ? "flex-1 min-h-0" : "h-[300px] shrink-0"
      )}
      onClick={onFocus}
      data-testid={`viewport-panel-${panel.id}`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-700/30 shrink-0" style={{ background: "rgba(30,41,59,0.3)" }}>
        <div className="flex items-center gap-2">
          <GripVertical className="w-3 h-3 text-slate-600 cursor-grab" />
          <panel.icon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{panel.label}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="p-1 text-slate-600 hover:text-slate-300 transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-1 text-slate-600 hover:text-red-400 transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
        <ViewportPanelInner panelId={panel.id} />
      </div>
    </div>
  );
}

function ViewportPanelInner({ panelId }: { panelId: string }) {
  switch (panelId) {
    case "outliner":
      return <OutlinerContent />;
    case "situation":
      return <SituationLogContent />;
    case "fleets":
      return <FleetsContent />;
    case "research":
      return <ResearchContent />;
    case "market":
      return <MarketContent />;
    case "contacts":
      return <ContactsContent />;
    case "empire":
      return <EmpireContent />;
    case "diplomacy":
      return <DiplomacyContent />;
    case "expansion":
      return <ExpansionContent />;
    default:
      return <div className="text-[11px] text-slate-500">Panel content</div>;
  }
}

function OutlinerContent() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    fleets: true,
    planets: true,
    stations: true,
    armies: false,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sections: OutlinerSection[] = [
    {
      id: "fleets",
      label: "Fleets",
      icon: Ship,
      color: "text-blue-500",
      items: [
        { name: "1st Exploration Fleet", status: "Idle", statusColor: "text-emerald-600" },
        { name: "Defense Fleet Alpha", status: "Patrol", statusColor: "text-amber-600" },
        { name: "Mining Escort", status: "Escort", statusColor: "text-blue-600" },
        { name: "Rapid Response", status: "Standby", statusColor: "text-slate-500" },
      ],
    },
    {
      id: "planets",
      label: "Planets",
      icon: Globe,
      color: "text-emerald-500",
      items: [
        { name: "Prime World", status: "Producing", statusColor: "text-emerald-600" },
        { name: "Mining Colony", status: "Building", statusColor: "text-blue-600" },
        { name: "Research Station", status: "Researching", statusColor: "text-purple-600" },
        { name: "Agri World", status: "Growing", statusColor: "text-amber-600" },
        { name: "Fortress World", status: "Defending", statusColor: "text-red-600" },
      ],
    },
    {
      id: "stations",
      label: "Stations",
      icon: Building2,
      color: "text-cyan-500",
      items: [
        { name: "Orbital Dock", status: "Operational", statusColor: "text-primary" },
        { name: "Trade Hub", status: "Trading", statusColor: "text-amber-600" },
        { name: "Research Outpost", status: "Studying", statusColor: "text-purple-600" },
      ],
    },
    {
      id: "armies",
      label: "Armies",
      icon: Swords,
      color: "text-red-500",
      items: [
        { name: "Ground Defense", status: "Garrisoned", statusColor: "text-red-600" },
        { name: "Assault Legion", status: "Ready", statusColor: "text-emerald-600" },
      ],
    },
  ];

  return (
    <div className="space-y-0">
      {sections.map((section) => (
        <div key={section.id}>
          <button
            type="button"
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 transition-colors"
          >
            {expandedSections[section.id] ? (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-400" />
            )}
            <section.icon className={cn("w-3.5 h-3.5", section.color)} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{section.label}</span>
            <span className="ml-auto text-[9px] font-mono text-slate-400">{section.items.length}</span>
          </button>
          {expandedSections[section.id] && (
            <div className="space-y-0 ml-4">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <span className="text-[11px] text-slate-700 group-hover:text-slate-900 truncate">{item.name}</span>
                  <span className={cn("text-[10px] font-mono shrink-0 ml-2", item.statusColor)}>{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SituationLogContent() {
  return (
    <div className="space-y-2">
      {[
        { title: "Hostile Fleet Detected", desc: "Unknown vessels approaching outer perimeter", priority: "high", time: "2m ago", route: "/fleet" },
        { title: "Research Complete", desc: "Quantum Computing unlocked", priority: "info", time: "5m ago", route: "/research" },
        { title: "Trade Agreement", desc: "Alliance offer from Nova Federation", priority: "medium", time: "12m ago", route: "/alliance" },
        { title: "Colony Established", desc: "New world successfully colonized", priority: "info", time: "1h ago", route: "/colonies" },
        { title: "Anomaly Found", desc: "Unusual energy readings in Sector 7G", priority: "medium", time: "2h ago", route: "/exploration" },
        { title: "Construction Complete", desc: "Orbital Defense Platform finished", priority: "info", time: "3h ago", route: "/orbital-defense" },
      ].map((event, i) => (
        <a
          key={i}
          href={event.route}
          className={cn(
            "block p-2 rounded border text-[11px] hover:opacity-80 transition-opacity cursor-pointer",
            event.priority === "high" ? "bg-red-50 border-red-200 text-red-700" :
            event.priority === "medium" ? "bg-amber-50 border-amber-200 text-amber-700" :
            "bg-slate-50 border-slate-200 text-slate-600"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">{event.title}</span>
            <span className="text-[9px] text-slate-500">{event.time}</span>
          </div>
          <p className="text-[10px] mt-1 opacity-70">{event.desc}</p>
        </a>
      ))}
    </div>
  );
}

function FleetsContent() {
  return (
    <div className="space-y-1.5">
      {[
        { name: "1st Exploration Fleet", ships: 12, power: "2,450", status: "Idle", route: "/fleet" },
        { name: "Defense Fleet Alpha", ships: 8, power: "5,120", status: "Patrol", route: "/fleet" },
        { name: "Mining Escort", ships: 4, power: "890", status: "Escort", route: "/fleet" },
        { name: "Rapid Response", ships: 20, power: "12,400", status: "Standby", route: "/fleet" },
      ].map((fleet) => (
        <a key={fleet.name} href={fleet.route} className="block p-2 rounded bg-slate-50 border border-slate-200 hover:border-primary/20 cursor-pointer transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">{fleet.name}</span>
            <span className="text-[10px] text-primary">{fleet.status}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
            <span>{fleet.ships} ships</span>
            <span>Power: {fleet.power}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function ResearchContent() {
  return (
    <div className="space-y-2">
      {[
        { name: "Quantum Computing", progress: 85, type: "Physics", route: "/research" },
        { name: "Gene Modification", progress: 42, type: "Society", route: "/research" },
        { name: "Advanced Shields", progress: 15, type: "Engineering", route: "/research" },
        { name: "FTL Theory", progress: 92, type: "Physics", route: "/technology-tree" },
        { name: "Psionic Theory", progress: 8, type: "Society", route: "/technology-tree" },
      ].map((tech) => (
        <a key={tech.name} href={tech.route} className="block p-2 rounded bg-slate-50 border border-slate-200 hover:border-primary/20 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">{tech.name}</span>
            <span className="text-[10px] text-purple-600">{tech.type}</span>
          </div>
          <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${tech.progress}%` }} />
          </div>
          <div className="text-[9px] text-slate-500 mt-1">{tech.progress}% complete</div>
        </a>
      ))}
    </div>
  );
}

function MarketContent() {
  return (
    <div className="space-y-2">
      {[
        { resource: "Metal", buy: 120, sell: 105, owned: "45,000", route: "/market" },
        { resource: "Crystal", buy: 180, sell: 160, owned: "23,000", route: "/market" },
        { resource: "Deuterium", buy: 250, sell: 220, owned: "8,500", route: "/market" },
        { resource: "Food", buy: 60, sell: 50, owned: "32,000", route: "/market" },
        { resource: "Energy", buy: 80, sell: 70, owned: "56,000", route: "/market" },
      ].map((item) => (
        <div key={item.resource} className="p-2 rounded bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">{item.resource}</span>
            <span className="text-[10px] text-slate-500">Owned: {item.owned}</span>
          </div>
          <div className="flex gap-2 mt-1.5">
            <button className="flex-1 px-2 py-1 text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors">
              Buy @ {item.buy}
            </button>
            <button className="flex-1 px-2 py-1 text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors">
              Sell @ {item.sell}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactsContent() {
  return (
    <div className="space-y-1">
      {[
        { name: "Nova Federation", relation: "Friendly", opinion: "+65", route: "/messages" },
        { name: "Zerg Combine", relation: "Hostile", opinion: "-45", route: "/messages" },
        { name: "Trade League", relation: "Neutral", opinion: "+10", route: "/messages" },
        { name: "Holy Empire", relation: "Friendly", opinion: "+30", route: "/messages" },
        { name: "Star Concord", relation: "Rival", opinion: "-20", route: "/messages" },
        { name: "Merchant Guild", relation: "Friendly", opinion: "+55", route: "/messages" },
      ].map((contact) => (
        <a key={contact.name} href={contact.route} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors">
          <span className="text-[11px] text-slate-700">{contact.name}</span>
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-semibold",
              contact.opinion.startsWith("+") ? "text-emerald-600" : "text-red-600"
            )}>
              {contact.opinion}
            </span>
            <span className="text-[9px] text-slate-500">{contact.relation}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function EmpireContent() {
  return (
    <div className="space-y-2">
      {[
        { label: "Empire Size", value: "1,247 systems", route: "/empire-view" },
        { label: "Fleet Power", value: "8,460", route: "/fleet" },
        { label: "Research Output", value: "342/month", route: "/research" },
        { label: "Influence", value: "156", route: "/government" },
        { label: "Unity", value: "2,890", route: "/empire-progression" },
        { label: "Energy Credits", value: "56,000", route: "/resources" },
        { label: "Minerals", value: "45,000", route: "/resources" },
      ].map((stat) => (
        <a key={stat.label} href={stat.route} className="flex items-center justify-between px-2 py-1.5 rounded bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
          <span className="text-[11px] font-mono font-semibold text-slate-700">{stat.value}</span>
        </a>
      ))}
    </div>
  );
}

function DiplomacyContent() {
  return (
    <div className="space-y-2">
      {[
        { type: "Trade Agreement", with: "Nova Federation", status: "Active", route: "/alliance" },
        { type: "Non-Aggression Pact", with: "Holy Empire", status: "Active", route: "/alliance" },
        { type: "Research Agreement", with: "Trade League", status: "Pending", route: "/alliance" },
        { type: "Defensive Pact", with: "Star Concord", status: "Expired", route: "/alliance" },
      ].map((pact, i) => (
        <a key={i} href={pact.route} className="block p-2 rounded bg-slate-50 border border-slate-200 hover:border-primary/20 cursor-pointer transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">{pact.type}</span>
            <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded",
              pact.status === "Active" ? "bg-emerald-50 text-emerald-600" :
              pact.status === "Pending" ? "bg-amber-50 text-amber-600" :
              "bg-slate-100 text-slate-500"
            )}>{pact.status}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">with {pact.with}</div>
        </a>
      ))}
    </div>
  );
}

function ExpansionContent() {
  return (
    <div className="space-y-1">
      {[
        { name: "Kepler-442b", distance: "12.4 ly", potential: "High", route: "/colonies" },
        { name: "TRAPPIST-1e", distance: "8.7 ly", potential: "Medium", route: "/colonies" },
        { name: "Ross 128 b", distance: "5.2 ly", potential: "High", route: "/colonies" },
        { name: "Proxima Centauri b", distance: "4.2 ly", potential: "Low", route: "/colonies" },
        { name: "Barnard's Star b", distance: "6.0 ly", potential: "High", route: "/colonies" },
      ].map((planet) => (
        <a key={planet.name} href={planet.route} className="block p-2 rounded bg-slate-50 border border-slate-200 hover:border-primary/20 cursor-pointer transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">{planet.name}</span>
            <span className="text-[10px] text-primary">{planet.distance}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Potential: {planet.potential}</div>
        </a>
      ))}
    </div>
  );
}
