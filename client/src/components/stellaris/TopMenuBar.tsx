import { useRef, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useStellarisHotkeyState } from "@/hooks/useStellarisHotkeys";
import { Link, useLocation } from "wouter";
import { useGame } from "@/lib/gameContext";
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
  Crown,
  Dna,
  Landmark,
  Swords,
  Package,
  ChevronRight,
  Map,
  Radio,
  MessageSquare,
  FileText,
  Info,
} from "lucide-react";

interface SubMenuItem {
  key: string;
  label: string;
  href: string;
  shortcut?: string;
}

interface SidebarCategory {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  fKey: string;
  sections: {
    title: string;
    items: SubMenuItem[];
  }[];
}

const SIDEBAR_CATEGORIES: SidebarCategory[] = [
  {
    key: "empire",
    label: "Empire",
    icon: Crown,
    fKey: "F1",
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
        ],
      },
    ],
  },
  {
    key: "situation",
    label: "Situation Log",
    icon: AlertTriangle,
    fKey: "F2",
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
    key: "government",
    label: "Government",
    icon: Landmark,
    fKey: "F3",
    sections: [
      {
        title: "Government",
        items: [
          { key: "government", label: "Government", href: "/government", shortcut: "F3" },
          { key: "factions", label: "Factions", href: "/factions" },
        ],
      },
      {
        title: "Diplomacy",
        items: [
          { key: "alliance", label: "Alliance", href: "/alliance" },
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
    ],
  },
  {
    key: "society",
    label: "Society",
    icon: Building2,
    fKey: "F4",
    sections: [
      {
        title: "Progression",
        items: [
          { key: "empire-prog", label: "Empire Progression", href: "/empire-progression", shortcut: "F4" },
          { key: "season-pass", label: "Season Pass", href: "/season-pass" },
          { key: "battle-pass", label: "Battle Pass", href: "/battle-pass" },
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
    ],
  },
  {
    key: "technology",
    label: "Technology",
    icon: FlaskConical,
    fKey: "F5",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research", shortcut: "F5" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
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
    key: "leaders",
    label: "Leaders",
    icon: Users,
    fKey: "F6",
    sections: [
      {
        title: "Command",
        items: [
          { key: "commander", label: "Commander", href: "/commander", shortcut: "F6" },
          { key: "skills-lead", label: "Skills", href: "/skills" },
        ],
      },
    ],
  },
  {
    key: "species",
    label: "Species",
    icon: Dna,
    fKey: "F7",
    sections: [
      {
        title: "Species",
        items: [
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex", shortcut: "F7" },
          { key: "biome-detail", label: "Biome Detail", href: "/biome-detail" },
        ],
      },
    ],
  },
  {
    key: "planets",
    label: "Planets & Sectors",
    icon: Globe,
    fKey: "F8",
    sections: [
      {
        title: "Colonies",
        items: [
          { key: "colonies", label: "Colonies", href: "/colonies", shortcut: "F8" },
          { key: "planet-command", label: "Planet Command", href: "/planet-command" },
          { key: "colony-mgmt", label: "Colony Management", href: "/colony-management" },
          { key: "resource-refinery", label: "Resource Refinery", href: "/resource-refinery" },
        ],
      },
      {
        title: "Defense",
        items: [
          { key: "planetary-defense", label: "Planetary Defense", href: "/planetary-defense" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
          { key: "planet-occupation", label: "Planetary Occupation", href: "/planet-occupation" },
        ],
      },
    ],
  },
  {
    key: "expansion",
    label: "Expansion Planner",
    icon: Compass,
    fKey: "F9",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration", shortcut: "F9" },
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
          { key: "biome-codex-exp", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  {
    key: "fleet",
    label: "Fleet Management",
    icon: Crosshair,
    fKey: "F10",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet", shortcut: "F10" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
          { key: "fitting-enhanced", label: "Fitting Enhanced", href: "/fitting-enhanced" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
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
];

const EXTRA_SIDEBAR_ITEMS: SidebarCategory[] = [
  {
    key: "contacts",
    label: "Contacts",
    icon: MessageSquare,
    fKey: "",
    sections: [
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
    key: "market",
    label: "Market",
    icon: ShoppingBag,
    fKey: "",
    sections: [
      {
        title: "Commerce",
        items: [
          { key: "market-trade", label: "Market", href: "/market" },
          { key: "merchants", label: "Merchants", href: "/merchants" },
          { key: "storefront", label: "Storefront", href: "/storefront" },
        ],
      },
    ],
  },
  {
    key: "galaxy",
    label: "Galaxy",
    icon: Map,
    fKey: "",
    sections: [
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
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
];

const SYSTEM_ITEMS: SubMenuItem[] = [
  { key: "settings", label: "Settings", href: "/settings" },
  { key: "diagnostics", label: "Diagnostics", href: "/diagnostics" },
  { key: "admin-panel", label: "Admin Panel", href: "/admin" },
  { key: "admin-database", label: "Database Admin", href: "/admin/database" },
  { key: "server-console", label: "Server Console", href: "/server-console" },
  { key: "assets-gallery", label: "Assets Gallery", href: "/assets-gallery" },
  { key: "ogame-compendium", label: "Ogame Compendium", href: "/ogame-compendium" },
  { key: "about", label: "About", href: "/about" },
  { key: "terms", label: "Terms of Service", href: "/terms" },
  { key: "privacy", label: "Privacy Policy", href: "/privacy" },
];

const ALL_SEARCH_ITEMS = [
  ...SIDEBAR_CATEGORIES.flatMap((cat) =>
    cat.sections.flatMap((sec) =>
      sec.items.map((item) => ({ ...item, section: cat.label }))
    )
  ),
  ...EXTRA_SIDEBAR_ITEMS.flatMap((cat) =>
    cat.sections.flatMap((sec) =>
      sec.items.map((item) => ({ ...item, section: cat.label }))
    )
  ),
];

export function ResourceBar() {
  const { resources, planetName, coordinates, username, empireName } = useGame();
  const state = useStellarisHotkeyState();
  const [location] = useLocation();

  return (
    <div className="relative z-50 flex items-center gap-0 border-b border-slate-200 bg-white/95 backdrop-blur-md h-9 shrink-0" data-testid="stellaris-resource-bar">
      <Link href="/">
        <div className="flex items-center gap-2 px-3 h-full border-r border-slate-200 shrink-0 cursor-pointer hover:bg-slate-50 transition-colors">
          <Zap className="w-4 h-4 text-primary" />
          <div className="hidden sm:block">
            <span className="font-orbitron text-[10px] font-bold tracking-wider text-primary uppercase">
              {empireName || "Stellar Dominion"}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide flex-1 h-full">
        <ResourceChip icon={Zap} label="Energy" value={resources.energy} color="text-amber-600" href="/market" />
        <ResourceChip icon={Package} label="Metal" value={resources.metal} color="text-blue-600" href="/resources" />
        <ResourceChip icon={Star} label="Crystal" value={resources.crystal} color="text-purple-600" href="/resources" />
        <ResourceChip icon={Zap} label="Deuterium" value={resources.deuterium} color="text-green-600" href="/resources" />
        <ResourceChip icon={Package} label="Credits" value={resources.credits} color="text-amber-700" href="/market" />
        <ResourceChip icon={Package} label="Food" value={resources.food} color="text-lime-600" href="/resources" />
        <ResourceChip icon={Package} label="Water" value={resources.water} color="text-cyan-600" href="/resources" />
      </div>

      <div className="flex items-center gap-0 h-full">
        <div className="hidden md:flex items-center gap-1.5 px-3 h-full border-l border-slate-200 text-[10px] font-mono text-slate-500">
          <span className="font-semibold text-slate-700">{planetName || "Prime World"}</span>
          <span className="text-slate-400">[{coordinates || "0:0:0:0"}]</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 px-2 h-full border-l border-slate-200 text-[10px] text-slate-500">
          <span className="text-slate-400">CMDR</span>
          <span className="font-semibold text-slate-700">{username || "Commander"}</span>
        </div>
      </div>
    </div>
  );
}

function ResourceChip({
  icon: Icon,
  label,
  value,
  color,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-1.5 px-2.5 h-full border-r border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
        <Icon className={cn("w-3 h-3 shrink-0", color)} />
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-400 uppercase leading-none">{label}</span>
          <span className={cn("text-[11px] font-mono font-bold leading-tight", color)}>
            {value.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NavSidebar() {
  const [location] = useLocation();
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);

  const activeCatKey = useMemo(() => {
    for (const cat of [...SIDEBAR_CATEGORIES, ...EXTRA_SIDEBAR_ITEMS]) {
      for (const sec of cat.sections) {
        for (const item of sec.items) {
          if (item.href && location === item.href) return cat.key;
        }
      }
    }
    return null;
  }, [location]);

  useEffect(() => {
    if (activeCatKey) setExpandedCat(activeCatKey);
  }, [activeCatKey]);

  return (
    <div className="flex flex-col w-[52px] hover:w-[220px] bg-white border-r border-slate-200 shrink-0 overflow-hidden transition-all duration-200 group/sidebar z-40" data-testid="stellaris-nav-sidebar">
      <div className="flex-1 overflow-y-auto scrollbar-hide py-1">
        {SIDEBAR_CATEGORIES.map((cat) => (
          <SidebarCategoryItem
            key={cat.key}
            category={cat}
            isExpanded={expandedCat === cat.key}
            isActive={activeCatKey === cat.key}
            onToggle={() => setExpandedCat(expandedCat === cat.key ? null : cat.key)}
            currentPath={location}
          />
        ))}

        <div className="my-1 mx-2 border-t border-slate-200" />

        {EXTRA_SIDEBAR_ITEMS.map((cat) => (
          <SidebarCategoryItem
            key={cat.key}
            category={cat}
            isExpanded={expandedCat === cat.key}
            isActive={activeCatKey === cat.key}
            onToggle={() => setExpandedCat(expandedCat === cat.key ? null : cat.key)}
            currentPath={location}
          />
        ))}
      </div>

      <div className="border-t border-slate-200 py-1">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="hidden group-hover/sidebar:inline text-[11px] font-semibold truncate">Search</span>
          <kbd className="hidden group-hover/sidebar:inline text-[8px] font-mono text-slate-400 ml-auto">F</kbd>
        </button>

        <button
          type="button"
          onClick={() => setSystemOpen(!systemOpen)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 transition-colors",
            systemOpen ? "text-primary bg-primary/5" : "text-slate-500 hover:text-primary hover:bg-slate-50"
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span className="hidden group-hover/sidebar:inline text-[11px] font-semibold truncate">System</span>
          <ChevronRight className={cn("hidden group-hover/sidebar:inline w-3 h-3 ml-auto transition-transform", systemOpen && "rotate-90")} />
        </button>

        {systemOpen && (
          <div className="hidden group-hover/sidebar:block pl-9 pr-2 pb-1">
            {SYSTEM_ITEMS.map((item) => (
              <Link key={item.key} href={item.href}>
                <div className={cn(
                  "flex items-center px-2 py-1 text-[11px] rounded cursor-pointer transition-colors",
                  location === item.href ? "text-primary bg-primary/5" : "text-slate-500 hover:text-primary hover:bg-slate-50"
                )}>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </div>
  );
}

function SidebarCategoryItem({
  category,
  isExpanded,
  isActive,
  onToggle,
  currentPath,
}: {
  category: SidebarCategory;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  currentPath: string;
}) {
  const Icon = category.icon;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2 transition-colors",
          isActive ? "text-primary bg-primary/5" : "text-slate-500 hover:text-primary hover:bg-slate-50"
        )}
        data-testid={`sidebar-btn-${category.key}`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="hidden group-hover/sidebar:inline text-[11px] font-semibold truncate flex-1 text-left">{category.label}</span>
        {category.fKey && (
          <span className="hidden group-hover/sidebar:inline text-[8px] font-mono text-slate-400 shrink-0">{category.fKey}</span>
        )}
        <ChevronRight className={cn("hidden group-hover/sidebar:inline w-3 h-3 transition-transform shrink-0", isExpanded && "rotate-90")} />
      </button>

      {isExpanded && (
        <div className="hidden group-hover/sidebar:block">
          {category.sections.map((section) => (
            <div key={section.title} className="pl-9 pr-2">
              <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 px-2 pt-2 pb-1">{section.title}</div>
              {section.items.map((item) => (
                <Link key={item.key} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center justify-between px-2 py-1 text-[11px] rounded cursor-pointer transition-colors",
                      currentPath === item.href
                        ? "text-primary bg-primary/5"
                        : "text-slate-500 hover:text-primary hover:bg-slate-50"
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="text-[8px] font-mono text-slate-400 shrink-0">{item.shortcut}</kbd>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = query.trim()
    ? ALL_SEARCH_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_SEARCH_ITEMS.slice(0, 15);

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
      window.location.href = filtered[selected].href;
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[12vh]" onClick={onClose}>
      <div
        className="w-full max-w-[520px] mx-4 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
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
        <div className="max-h-[400px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12px] text-slate-400">No results found</div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.key + item.href}
                type="button"
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 text-left text-[12px] transition-colors",
                  index === selected ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
                onClick={() => {
                  window.location.href = item.href;
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

export function TopMenuBar() {
  return (
    <>
      <ResourceBar />
      <NavSidebar />
    </>
  );
}
