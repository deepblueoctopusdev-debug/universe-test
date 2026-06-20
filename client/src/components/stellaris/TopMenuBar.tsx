import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useStellarisHotkeyState } from "@/hooks/useStellarisHotkeys";
import { Link } from "wouter";
import {
  LayoutDashboard,
  AlertTriangle,
  ShoppingBag,
  FlaskConical,
  Users,
  Globe,
  X,
  Settings,
  Search,
  Zap,
  Shield,
  Building2,
  Crosshair,
  Compass,
  ShieldAlert,
  Star,
  BookOpen,
} from "lucide-react";

interface SubMenuItem {
  key: string;
  label: string;
  href: string;
  shortcut?: string;
}

interface TopBarMenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  description: string;
  sections: {
    title: string;
    items: SubMenuItem[];
  }[];
}

const TOP_BAR_ITEMS: TopBarMenuItem[] = [
  {
    key: "empire",
    label: "Empire",
    icon: LayoutDashboard,
    description: "Empire overview, resources, and management",
    sections: [
      {
        title: "Overview",
        items: [
          { key: "empire-view", label: "Empire View", href: "/empire-view", shortcut: "F1" },
          { key: "empire-planets", label: "Empire Planets", href: "/empire-planets" },
          { key: "empire-command", label: "Command Center", href: "/empire-command-center" },
          { key: "empire-progression", label: "Progression", href: "/empire-progression" },
        ],
      },
      {
        title: "Production",
        items: [
          { key: "resources", label: "Resources", href: "/resources" },
          { key: "power-grid", label: "Power Grid", href: "/power-grid" },
          { key: "facilities", label: "Facilities", href: "/facilities" },
          { key: "stations", label: "Stations", href: "/stations" },
          { key: "colonies-prod", label: "Colonies", href: "/colonies" },
          { key: "megastructures-prod", label: "Megastructures", href: "/megastructures" },
        ],
      },
    ],
  },
  {
    key: "situation",
    label: "Situation Log",
    icon: AlertTriangle,
    description: "Active events, anomalies, and empire focus",
    sections: [
      {
        title: "Log",
        items: [
          { key: "events", label: "Events", href: "/universe-events", shortcut: "F2" },
          { key: "story", label: "Story Mode", href: "/story-mode" },
        ],
      },
      {
        title: "Achievements",
        items: [
          { key: "relics", label: "Relics", href: "/relics" },
          { key: "achievements", label: "Achievements", href: "/achievements" },
          { key: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
        ],
      },
    ],
  },
  {
    key: "market",
    label: "Market",
    icon: ShoppingBag,
    description: "Trade resources and market operations",
    sections: [
      {
        title: "Commerce",
        items: [
          { key: "market-trade", label: "Market", href: "/market", shortcut: "F3" },
          { key: "merchants", label: "Merchants", href: "/merchants" },
          { key: "storefront", label: "Storefront", href: "/storefront" },
        ],
      },
    ],
  },
  {
    key: "research",
    label: "Research",
    icon: FlaskConical,
    description: "Technology and research management",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research", shortcut: "F4" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills-training", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },
  {
    key: "military",
    label: "Military",
    icon: Crosshair,
    description: "Fleet command, combat, and military operations",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet", shortcut: "F5" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  {
    key: "leaders",
    label: "Leaders",
    icon: Users,
    description: "Commanders, governors, and leaders",
    sections: [
      {
        title: "Command",
        items: [
          { key: "commander", label: "Commander", href: "/commander", shortcut: "F6" },
          { key: "skills", label: "Skills", href: "/skills" },
        ],
      },
    ],
  },
  {
    key: "expansion",
    label: "Expansion",
    icon: Compass,
    description: "Colonies, exploration, and territorial expansion",
    sections: [
      {
        title: "Colonies",
        items: [
          { key: "colonies", label: "Colonies", href: "/colonies", shortcut: "F7" },
          { key: "planet-command", label: "Planet Command", href: "/planet-command" },
        ],
      },
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  {
    key: "diplomacy",
    label: "Diplomacy",
    icon: Shield,
    description: "Alliance, factions, and diplomatic relations",
    sections: [
      {
        title: "Diplomacy",
        items: [
          { key: "government", label: "Government", href: "/government", shortcut: "F8" },
          { key: "alliance", label: "Alliance", href: "/alliance" },
          { key: "factions", label: "Factions", href: "/factions" },
        ],
      },
      {
        title: "Communications",
        items: [
          { key: "messages", label: "Messages", href: "/messages" },
          { key: "friends", label: "Friends List", href: "/friends" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },
  {
    key: "galaxy",
    label: "Galaxy",
    icon: Globe,
    description: "Galaxy map, universe view, and celestial navigation",
    sections: [
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy", shortcut: "F9" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "universe-gen", label: "Universe Generator", href: "/universe-generator" },
        ],
      },
      {
        title: "3D Views",
        items: [
          { key: "3d-viewport", label: "3D Viewport", href: "/3d-viewport" },
          { key: "threejs", label: "Three.js Viewer", href: "/threejs-viewer" },
        ],
      },
    ],
  },
  {
    key: "society",
    label: "Society",
    icon: Building2,
    description: "Civilizations, guilds, raids, and social systems",
    sections: [
      {
        title: "Civilizations",
        items: [
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management", shortcut: "F10" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
      {
        title: "Social",
        items: [
          { key: "guilds", label: "Guilds", href: "/guilds" },
          { key: "raids", label: "Raids", href: "/raids" },
          { key: "raid-bosses", label: "Raid Bosses", href: "/raid-bosses" },
          { key: "raid-finder", label: "Raid Finder", href: "/raid-finder" },
        ],
      },
      {
        title: "Seasons",
        items: [
          { key: "season-pass", label: "Season Pass", href: "/season-pass" },
          { key: "battle-pass", label: "Battle Pass", href: "/battle-pass" },
        ],
      },
    ],
  },
  {
    key: "system",
    label: "System",
    icon: Settings,
    description: "Settings, diagnostics, and system tools",
    sections: [
      {
        title: "System",
        items: [
          { key: "settings", label: "Settings", href: "/settings" },
          { key: "diagnostics", label: "Diagnostics", href: "/diagnostics" },
          { key: "assets-gallery", label: "Assets Gallery", href: "/assets-gallery" },
          { key: "ogame-compendium", label: "Ogame Compendium", href: "/ogame-compendium" },
          { key: "about", label: "About", href: "/about" },
        ],
      },
      {
        title: "Legal",
        items: [
          { key: "terms", label: "Terms of Service", href: "/terms" },
          { key: "privacy", label: "Privacy Policy", href: "/privacy" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },
  {
    key: "admin",
    label: "Admin",
    icon: ShieldAlert,
    description: "Administrative controls and server management",
    sections: [
      {
        title: "Administration",
        items: [
          { key: "admin-panel", label: "Control Panel", href: "/admin" },
          { key: "admin-database", label: "Database Admin", href: "/admin/database" },
          { key: "server-console", label: "Server Console", href: "/server-console" },
        ],
      },
    ],
  },
];

const MAIN_MENU_ITEMS = [
  { label: "Resume", icon: LayoutDashboard, action: "resume" },
  { label: "Save Game", icon: Settings, action: "save" },
  { label: "Load Game", icon: Settings, action: "load" },
  { label: "Settings", icon: Settings, action: "settings", href: "/settings" },
  { label: "Diagnostics", icon: AlertTriangle, action: "diagnostics", href: "/diagnostics" },
  { label: "Server Console", icon: Settings, action: "server-console", href: "/server-console" },
  { label: "Database Admin", icon: Settings, action: "database", href: "/admin/database" },
  { label: "About", icon: Settings, action: "about", href: "/about" },
  { label: "Game Assets", icon: Star, action: "assets", href: "/assets-gallery" },
  { label: "Ogame Compendium", icon: BookOpen, action: "ogame", href: "/ogame-compendium" },
  { label: "Quit to Menu", icon: X, action: "quit" },
];

export function TopMenuBar() {
  const state = useStellarisHotkeyState();
  const { activeTopBarMenu, setActiveTopBarMenu, setActivePanel, closeAllMenus } = state;

  return (
    <div className="relative z-50 flex items-center gap-0 border-b border-slate-200 bg-white/95 backdrop-blur-md" data-testid="stellaris-top-bar">
      {/* Logo & Empire Name */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-200 shrink-0">
        <Zap className="w-4 h-4 text-primary" />
        <span className="font-orbitron text-[11px] font-bold tracking-wider text-primary uppercase hidden sm:inline">
          Stellar Dominion
        </span>
      </div>

      {/* F-Key Navigation */}
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide flex-1">
        {TOP_BAR_ITEMS.map((item, index) => {
          const fKey = `F${index + 1}`;
          const isActive = activeTopBarMenu === item.key;

          return (
            <div key={item.key} className="relative shrink-0">
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-150 border-b-2 whitespace-nowrap",
                  isActive
                    ? "bg-primary/10 text-primary border-primary"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent"
                )}
                onClick={() => {
                  if (isActive) {
                    setActiveTopBarMenu(null);
                    setActivePanel(null);
                  } else {
                    setActiveTopBarMenu(item.key);
                    setActivePanel(null);
                  }
                }}
                data-testid={`topbar-btn-${item.key}`}
              >
                <span className="text-[8px] font-mono text-slate-500 w-3 text-center">{fKey}</span>
                <item.icon className="w-3 h-3 shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Search & Settings */}
      <button
        type="button"
        onClick={() => state.toggleSearch()}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors border-l border-slate-200"
        data-testid="topbar-btn-search"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline text-[9px] font-mono text-slate-500 ml-1">F</kbd>
      </button>

      <Link href="/settings">
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors"
          data-testid="topbar-btn-settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </Link>

      {/* Menu Dropdowns */}
      {activeTopBarMenu && activeTopBarMenu !== "main-menu" && (
        <TopBarDropdown
          items={TOP_BAR_ITEMS}
          activeMenu={activeTopBarMenu}
          onNavigate={(href) => {
            if (href) window.location.href = href;
            closeAllMenus();
          }}
          onClose={closeAllMenus}
        />
      )}

      {activeTopBarMenu === "main-menu" && (
        <MainMenuDropdown onClose={closeAllMenus} />
      )}

      {/* Search Overlay */}
      {state.searchOpen && (
        <SearchOverlay onClose={() => state.toggleSearch()} navigate={(path) => { window.location.href = path; }} />
      )}
    </div>
  );
}

function TopBarDropdown({
  items,
  activeMenu,
  onNavigate,
  onClose,
}: {
  items: TopBarMenuItem[];
  activeMenu: string;
  onNavigate: (href?: string) => void;
  onClose: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState(activeMenu);

  useEffect(() => {
    setSelectedCategory(activeMenu);
  }, [activeMenu]);

  const activeCat = items.find((i) => i.key === selectedCategory);

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white/98 border-b border-slate-200 shadow-2xl backdrop-blur-md z-50"
      data-testid="topbar-dropdown"
    >
      {activeCat && (
        <div className="max-w-[1400px] mx-auto overflow-y-auto" style={{ maxHeight: "420px" }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <activeCat.icon className="w-4 h-4 text-primary" />
              <div>
                <h3 className="font-orbitron text-xs font-bold text-slate-900 tracking-wider">{activeCat.label}</h3>
                <p className="text-[10px] text-slate-500">{activeCat.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider rounded transition-all duration-150",
                    item.key === selectedCategory
                      ? "bg-primary/10 text-primary"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  )}
                  onClick={() => setSelectedCategory(item.key)}
                  data-testid={`menu-cat-${item.key}`}
                >
                  <item.icon className="w-3 h-3 shrink-0" />
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-900 transition-colors rounded hover:bg-slate-100 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3 px-4 py-3">
            {activeCat.sections.map((section) => (
              <div key={section.title}>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/70 mb-1.5 px-1 pb-1 border-b border-slate-200">
                  {section.title}
                </div>
                <div className="space-y-px">
                  {section.items.map((sub) => (
                    <button
                      key={sub.key}
                      type="button"
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[11px] font-medium text-slate-600 hover:text-primary hover:bg-primary/5 transition-colors text-left group"
                      onClick={() => onNavigate(sub.href)}
                    >
                      <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-primary transition-colors shrink-0" />
                      <span className="truncate">{sub.label}</span>
                      {sub.shortcut && (
                        <kbd className="ml-auto text-[8px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded shrink-0 group-hover:text-primary">
                          {sub.shortcut}
                        </kbd>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MainMenuDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute top-full right-4 mt-0 w-[360px] bg-white/98 border border-slate-200 rounded-lg shadow-2xl backdrop-blur-md z-50"
      data-testid="main-menu-dropdown"
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-orbitron text-sm font-bold text-slate-900">MAIN MENU</h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-0.5">
          {MAIN_MENU_ITEMS.map((item) => (
            <div key={item.action}>
              {item.href ? (
                <Link href={item.href}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-[12px] font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 rounded transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-slate-500" />
                    {item.label}
                  </button>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-[12px] font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 rounded transition-colors"
                >
                  <item.icon className="w-4 h-4 text-slate-500" />
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] text-slate-400 text-center">
          Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded">ESC</kbd> to close
        </div>
      </div>
    </div>
  );
}

function SearchOverlay({
  onClose,
  navigate,
}: {
  onClose: () => void;
  navigate: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const searchItems = [
    { label: "Empire View", href: "/empire-view", section: "Empire" },
    { label: "Empire Planets", href: "/empire-planets", section: "Empire" },
    { label: "Command Center", href: "/empire-command-center", section: "Empire" },
    { label: "Empire Progression", href: "/empire-progression", section: "Empire" },
    { label: "Resources", href: "/resources", section: "Empire" },
    { label: "Power Grid", href: "/power-grid", section: "Empire" },
    { label: "Facilities", href: "/facilities", section: "Empire" },
    { label: "Stations", href: "/stations", section: "Empire" },
    { label: "Events", href: "/universe-events", section: "Situation" },
    { label: "Story Mode", href: "/story-mode", section: "Situation" },
    { label: "Relics", href: "/relics", section: "Situation" },
    { label: "Achievements", href: "/achievements", section: "Situation" },
    { label: "Market", href: "/market", section: "Market" },
    { label: "Merchants", href: "/merchants", section: "Market" },
    { label: "Storefront", href: "/storefront", section: "Market" },
    { label: "Research Hub", href: "/research", section: "Research" },
    { label: "Technology Tree", href: "/technology-tree", section: "Research" },
    { label: "Research Lab", href: "/research-lab", section: "Research" },
    { label: "Blueprints", href: "/blueprints", section: "Research" },
    { label: "Artifacts", href: "/artifacts", section: "Research" },
    { label: "Knowledge Library", href: "/knowledge-library", section: "Research" },
    { label: "Fleet Command", href: "/fleet", section: "Military" },
    { label: "Shipyard", href: "/shipyard", section: "Military" },
    { label: "Fitting", href: "/fitting", section: "Military" },
    { label: "Combat Center", href: "/combat", section: "Military" },
    { label: "Orbital Defense", href: "/orbital-defense", section: "Military" },
    { label: "Battle Logs", href: "/battle-logs", section: "Military" },
    { label: "Army", href: "/army", section: "Military" },
    { label: "Ground Combat", href: "/ground-combat", section: "Military" },
    { label: "Commander", href: "/commander", section: "Leaders" },
    { label: "Skills", href: "/skills", section: "Leaders" },
    { label: "Colonies", href: "/colonies", section: "Expansion" },
    { label: "Exploration", href: "/exploration", section: "Expansion" },
    { label: "Expeditions", href: "/expeditions", section: "Expansion" },
    { label: "Warp Network", href: "/warp-network", section: "Expansion" },
    { label: "Megastructures", href: "/megastructures", section: "Expansion" },
    { label: "Government", href: "/government", section: "Diplomacy" },
    { label: "Alliance", href: "/alliance", section: "Diplomacy" },
    { label: "Factions", href: "/factions", section: "Diplomacy" },
    { label: "Messages", href: "/messages", section: "Diplomacy" },
    { label: "Friends", href: "/friends", section: "Diplomacy" },
    { label: "Forums", href: "/forums", section: "Diplomacy" },
    { label: "Galaxy Map", href: "/galaxy", section: "Galaxy" },
    { label: "Universe View", href: "/universe", section: "Galaxy" },
    { label: "Universe Generator", href: "/universe-generator", section: "Galaxy" },
    { label: "3D Viewport", href: "/3d-viewport", section: "Galaxy" },
    { label: "Civilization Mgmt", href: "/civilization-management", section: "Society" },
    { label: "Guilds", href: "/guilds", section: "Society" },
    { label: "Raids", href: "/raids", section: "Society" },
    { label: "Settings", href: "/settings", section: "System" },
    { label: "Diagnostics", href: "/diagnostics", section: "System" },
    { label: "Server Console", href: "/server-console", section: "System" },
  ];

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = query.trim()
    ? searchItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems.slice(0, 12);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      navigate(filtered[selected].href);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div
        className="w-full max-w-[560px] mx-4 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search systems, planets, menus..."
            className="flex-1 bg-transparent text-slate-900 text-sm outline-none placeholder:text-slate-400"
          />
          <kbd className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12px] text-slate-400">No results found</div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.href}
                type="button"
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 text-left text-[12px] transition-colors",
                  index === selected ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
                onClick={() => {
                  navigate(item.href);
                  onClose();
                }}
                onMouseEnter={() => setSelected(index)}
              >
                <span className="font-semibold">{item.label}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.section}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
