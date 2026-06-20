import { cn } from "@/lib/utils";
import { useState } from "react";
import { useStellarisHotkeyState, type GameSpeed } from "@/hooks/useStellarisHotkeys";
import { Link } from "wouter";
import {
  Pause,
  Play,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  LayoutPanelLeft,
  Zap,
  Shield,
  Users,
  FlaskConical,
  Settings,
  X,
  LayoutDashboard,
  Building2,
  Compass,
} from "lucide-react";

const SPEED_LABELS: Record<GameSpeed, string> = {
  0: "Paused",
  1: "Speed 1",
  2: "Speed 2",
  3: "Speed 3",
  4: "Speed 4",
  5: "Speed 5",
  6: "Speed 6",
};

interface BottomNavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: { label: string; href: string }[];
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    key: "empire",
    label: "Empire",
    icon: LayoutDashboard,
    color: "text-cyan-400",
    items: [
      { label: "Empire View", href: "/empire-view" },
      { label: "Empire Planets", href: "/empire-planets" },
      { label: "Command Center", href: "/empire-command-center" },
      { label: "Progression", href: "/empire-progression" },
      { label: "Resources", href: "/resources" },
      { label: "Power Grid", href: "/power-grid" },
      { label: "Facilities", href: "/facilities" },
      { label: "Stations", href: "/stations" },
      { label: "Colonies", href: "/colonies" },
      { label: "Megastructures", href: "/megastructures" },
    ],
  },
  {
    key: "military",
    label: "Military",
    icon: Shield,
    color: "text-red-400",
    items: [
      { label: "Fleet Command", href: "/fleet" },
      { label: "Shipyard", href: "/shipyard" },
      { label: "Fitting", href: "/fitting" },
      { label: "Combat", href: "/combat" },
      { label: "Orbital Defense", href: "/orbital-defense" },
      { label: "Battle Logs", href: "/battle-logs" },
      { label: "Army", href: "/army" },
      { label: "Army Management", href: "/army-management" },
      { label: "Training Center", href: "/training-center" },
      { label: "Ground Combat", href: "/ground-combat" },
    ],
  },
  {
    key: "research",
    label: "Research",
    icon: FlaskConical,
    color: "text-purple-400",
    items: [
      { label: "Research Hub", href: "/research" },
      { label: "Research Lab", href: "/research-lab" },
      { label: "Analytics", href: "/research-analytics" },
      { label: "Skills Training", href: "/skills" },
      { label: "Technology Tree", href: "/technology-tree" },
      { label: "Tech Tree", href: "/tech-tree" },
      { label: "Blueprints", href: "/blueprints" },
      { label: "Artifacts", href: "/artifacts" },
      { label: "Knowledge Library", href: "/knowledge-library" },
    ],
  },
  {
    key: "expansion",
    label: "Expansion",
    icon: Compass,
    color: "text-emerald-400",
    items: [
      { label: "Colonies", href: "/colonies" },
      { label: "Planet Command", href: "/planet-command" },
      { label: "Exploration", href: "/exploration" },
      { label: "Expeditions", href: "/expeditions" },
      { label: "Warp Network", href: "/warp-network" },
      { label: "Interstellar", href: "/interstellar" },
      { label: "Galaxy Map", href: "/galaxy" },
      { label: "Celestial Browser", href: "/celestial-browser" },
      { label: "Biome Codex", href: "/biome-codex" },
    ],
  },
  {
    key: "diplomacy",
    label: "Diplomacy",
    icon: Users,
    color: "text-blue-400",
    items: [
      { label: "Government", href: "/government" },
      { label: "Alliance", href: "/alliance" },
      { label: "Factions", href: "/factions" },
      { label: "Messages", href: "/messages" },
      { label: "Friends List", href: "/friends" },
      { label: "Forums", href: "/forums" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    key: "society",
    label: "Society",
    icon: Building2,
    color: "text-amber-400",
    items: [
      { label: "Civilization", href: "/civilization-management" },
      { label: "Civ Systems", href: "/civilization-systems" },
      { label: "Guilds", href: "/guilds" },
      { label: "Raids", href: "/raids" },
      { label: "Raid Bosses", href: "/raid-bosses" },
      { label: "Raid Finder", href: "/raid-finder" },
      { label: "Season Pass", href: "/season-pass" },
      { label: "Battle Pass", href: "/battle-pass" },
    ],
  },
  {
    key: "system",
    label: "System",
    icon: Settings,
    color: "text-slate-400",
    items: [
      { label: "Settings", href: "/settings" },
      { label: "Diagnostics", href: "/diagnostics" },
      { label: "Assets Gallery", href: "/assets-gallery" },
      { label: "Ogame Compendium", href: "/ogame-compendium" },
      { label: "About", href: "/about" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function GameStatusBar() {
  const state = useStellarisHotkeyState();
  const { gameSpeed, setGameSpeed, isPaused, togglePause, advanceOneDay, uiHidden, toggleUI, outlinerOpen, toggleOutliner } = state;
  const [openNavPanel, setOpenNavPanel] = useState<string | null>(null);

  const handleSpeedChange = (speed: GameSpeed) => {
    setGameSpeed(speed);
  };

  return (
    <div className="relative z-50" data-testid="stellaris-status-bar">
      {/* Nav Panel Overlay */}
      {openNavPanel && (() => {
        const navItem = BOTTOM_NAV_ITEMS.find((n) => n.key === openNavPanel);
        if (!navItem) return null;
        return (
          <div className="absolute bottom-full left-0 right-0 bg-white border-b border-t border-slate-200 shadow-2xl">
            <div className="max-w-[1400px] mx-auto px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <navItem.icon className={cn("w-4 h-4", navItem.color)} />
                  <span className="font-orbitron text-[11px] font-bold text-slate-900 uppercase tracking-wider">{navItem.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenNavPanel(null)}
                  className="p-1 text-slate-400 hover:text-slate-900 transition-colors rounded hover:bg-slate-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1">
                {navItem.items.map((sub) => (
                  <Link key={sub.href} href={sub.href}>
                    <button
                      type="button"
                      onClick={() => setOpenNavPanel(null)}
                      className="flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-medium text-slate-600 hover:text-primary bg-slate-50 hover:bg-primary/5 border border-slate-200 hover:border-primary/20 rounded transition-all text-center"
                    >
                      {sub.label}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white/95 backdrop-blur-md">
        {/* Left: Game Speed Controls */}
        <div className="flex items-center gap-1.5 px-3 py-1.5">
          <button
            type="button"
            onClick={togglePause}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded transition-all duration-150",
              isPaused
                ? "bg-amber-50 text-amber-600 border border-amber-200"
                : "bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-900 hover:border-slate-300"
            )}
            data-testid="btn-pause"
            title="Pause/Unpause (Space)"
          >
            {isPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleSpeedChange(Math.max(0, gameSpeed - 1) as GameSpeed)}
            className="flex items-center justify-center w-6 h-6 rounded bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-900 hover:border-slate-300 transition-colors"
            data-testid="btn-speed-down"
            title="Decrease speed (-)"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5, 6].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => handleSpeedChange(speed as GameSpeed)}
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded text-[10px] font-mono font-bold transition-all duration-150",
                  gameSpeed === speed
                    ? speed <= 3
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : speed <= 5
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    : "bg-slate-50 text-slate-400 border border-transparent hover:text-slate-600 hover:border-slate-200"
                )}
                data-testid={`btn-speed-${speed}`}
                title={`${SPEED_LABELS[speed as GameSpeed]} (${speed === 1 ? '+' : ''})`}
              >
                {speed}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleSpeedChange(Math.min(6, gameSpeed + 1) as GameSpeed)}
            className="flex items-center justify-center w-6 h-6 rounded bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-900 hover:border-slate-300 transition-colors"
            data-testid="btn-speed-up"
            title="Increase speed (+)"
          >
            <ChevronRight className="w-3 h-3" />
          </button>

          <span className="text-[10px] font-mono text-slate-400 ml-1">
            {SPEED_LABELS[gameSpeed]}
          </span>
        </div>

        {/* Center: Date & Status */}
        <div className="flex items-center gap-3">
          {isPaused && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded border border-amber-200">
              <Pause className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Paused</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
            <span className="font-semibold">2200.01.01</span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px]">Year 1</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[9px] text-slate-400">
            <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded">Space</kbd> pause
            <span className="mx-1 text-slate-300">·</span>
            <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded">+/-</kbd> speed
          </div>
        </div>

        {/* Right: Quick Stats & UI Controls */}
        <div className="flex items-center gap-2 px-3 py-1.5">
          <div className="hidden lg:flex items-center gap-3 mr-2">
            <div className="flex items-center gap-1 text-[10px]">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="font-mono text-slate-600">56K</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <div className="w-3 h-3 rounded bg-slate-400" />
              <span className="font-mono text-slate-600">45K</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <FlaskConical className="w-3 h-3 text-purple-500" />
              <span className="font-mono text-slate-600">342</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <Shield className="w-3 h-3 text-blue-500" />
              <span className="font-mono text-slate-600">156</span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-px mr-1">
            {BOTTOM_NAV_ITEMS.map((nav) => (
              <button
                key={nav.key}
                type="button"
                onClick={() => setOpenNavPanel(openNavPanel === nav.key ? null : nav.key)}
                className={cn(
                  "flex items-center gap-1 px-1.5 py-1 text-[9px] font-semibold rounded-sm border transition-all duration-150",
                  openNavPanel === nav.key
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "text-slate-500 hover:text-slate-700 bg-transparent border-transparent hover:border-slate-200"
                )}
                title={nav.label}
              >
                <nav.icon className={cn("w-3 h-3 shrink-0", openNavPanel === nav.key ? nav.color : "")} />
                <span className="hidden 2xl:inline">{nav.label}</span>
              </button>
            ))}
          </div>

          {isPaused && (
            <button
              type="button"
              onClick={advanceOneDay}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-slate-500 hover:text-primary bg-slate-50 rounded border border-slate-200 hover:border-primary/20 transition-colors"
              title="Advance one day (.)"
            >
              +1 Day
            </button>
          )}

          <button
            type="button"
            onClick={toggleOutliner}
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded border transition-colors",
              outlinerOpen
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200"
            )}
            title="Toggle Outliner (O)"
          >
            <LayoutPanelLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Outliner</span>
          </button>

          <button
            type="button"
            onClick={toggleUI}
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded border transition-colors",
              uiHidden
                ? "bg-red-50 text-red-500 border-red-200"
                : "text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200"
            )}
            title="Toggle UI (F11)"
          >
            {uiHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span className="hidden sm:inline">UI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
