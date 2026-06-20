import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useStellarisHotkeyState } from "@/hooks/useStellarisHotkeys";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  AlertTriangle,
  ShoppingBag,
  FlaskConical,
  Send,
  Users,
  Map,
  Globe,
  Crown,
  Landmark,
  X,
  Settings,
  Search,
  MessageSquare,
  Zap,
} from "lucide-react";

interface TopBarMenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  menuId?: string;
  description: string;
  subItems?: { key: string; label: string; menuId: string; href?: string }[];
}

const TOP_BAR_ITEMS: TopBarMenuItem[] = [
  {
    key: "empire-overview",
    label: "Empire",
    icon: LayoutDashboard,
    href: "/empire-view",
    menuId: "empire-overview",
    description: "Empire overview and management",
    subItems: [
      { key: "z", label: "Government", menuId: "government" },
      { key: "c", label: "Demographics", menuId: "demographics" },
      { key: "v", label: "Advisor", menuId: "advisor" },
    ],
  },
  {
    key: "situation-log",
    label: "Situation Log",
    icon: AlertTriangle,
    href: "/universe-events",
    menuId: "situation-log",
    description: "Active events, anomalies, and empire focus",
    subItems: [
      { key: "z", label: "Situation Log", menuId: "situation-log" },
      { key: "x", label: "Empire Focus", menuId: "empire-focus" },
      { key: "c", label: "Anomalies", menuId: "anomalies" },
      { key: "v", label: "Victory", menuId: "victory" },
    ],
  },
  {
    key: "market",
    label: "Market",
    icon: ShoppingBag,
    href: "/market",
    menuId: "market",
    description: "Trade resources and market operations",
    subItems: [
      { key: "z", label: "Market", menuId: "market-trade" },
      { key: "x", label: "Slave Market", menuId: "slave-market" },
    ],
  },
  {
    key: "research",
    label: "Research",
    icon: FlaskConical,
    href: "/research",
    menuId: "research",
    description: "Technology and research management",
    subItems: [
      { key: "z", label: "Physics", menuId: "physics" },
      { key: "x", label: "Society", menuId: "society" },
      { key: "c", label: "Engineering", menuId: "engineering" },
      { key: "v", label: "Researched", menuId: "researched" },
    ],
  },
  {
    key: "fleets",
    label: "Fleets",
    icon: Send,
    href: "/fleet",
    menuId: "fleets",
    description: "Fleet command and ship management",
    subItems: [
      { key: "g", label: "Merge", menuId: "merge" },
      { key: "h", label: "Stop", menuId: "stop" },
      { key: "b", label: "Return", menuId: "return" },
      { key: "v", label: "Split", menuId: "split" },
      { key: "t", label: "Stance", menuId: "stance" },
    ],
  },
  {
    key: "leaders",
    label: "Leaders",
    icon: Users,
    href: "/commander",
    menuId: "leaders",
    description: "Commanders, governors, and leaders",
    subItems: [
      { key: "g", label: "Governor", menuId: "governor" },
      { key: "j", label: "Restore Jobs", menuId: "restore-jobs" },
    ],
  },
  {
    key: "expansion",
    label: "Expansion",
    icon: Map,
    href: "/colonies",
    menuId: "expansion",
    description: "Colonies, expansion planner, and outposts",
    subItems: [
      { key: "z", label: "Planet Summary", menuId: "planet-summary" },
      { key: "x", label: "Population", menuId: "population" },
      { key: "c", label: "Armies", menuId: "armies" },
    ],
  },
  {
    key: "factions",
    label: "Factions",
    icon: Globe,
    href: "/factions",
    menuId: "factions",
    description: "Faction politics and influence",
  },
  {
    key: "contacts",
    label: "Contacts",
    icon: MessageSquare,
    href: "/messages",
    menuId: "contacts",
    description: "Diplomatic contacts and communications",
  },
  {
    key: "government",
    label: "Government",
    icon: Crown,
    href: "/government",
    menuId: "government",
    description: "Government, policies, and empire laws",
    subItems: [
      { key: "z", label: "Government", menuId: "gov-gov" },
      { key: "c", label: "Policies", menuId: "gov-policies" },
      { key: "v", label: "Edicts", menuId: "gov-edicts" },
    ],
  },
];

const MAIN_MENU_ITEMS = [
  { label: "Resume", icon: LayoutDashboard, action: "resume" },
  { label: "Save Game", icon: Settings, action: "save" },
  { label: "Load Game", icon: Settings, action: "load" },
  { label: "Settings", icon: Settings, action: "settings", href: "/settings" },
  { label: "Diagnostics", icon: AlertTriangle, action: "diagnostics", href: "/diagnostics" },
  { label: "About", icon: Settings, action: "about", href: "/about" },
  { label: "Quit to Menu", icon: X, action: "quit" },
];

export function TopMenuBar() {
  const state = useStellarisHotkeyState();
  const [location] = useLocation();
  const { activeTopBarMenu, setActiveTopBarMenu, setActivePanel, closeAllMenus } = state;

  return (
    <div className="relative z-50 flex items-center gap-0 border-b border-slate-200 bg-white/95 backdrop-blur-md" data-testid="stellaris-top-bar">
      {/* Stellaris Logo */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-200">
        <Zap className="w-4 h-4 text-primary" />
        <span className="font-orbitron text-[11px] font-bold tracking-wider text-primary uppercase hidden sm:inline">
          Stellar Dominion
        </span>
      </div>

      {/* F-Key Navigation Items */}
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
        {TOP_BAR_ITEMS.map((item, index) => {
          const fKey = `F${index + 1}`;
          const isActive = activeTopBarMenu === item.menuId;

          return (
            <div key={item.key} className="relative">
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-150 border-b-2 whitespace-nowrap",
                  isActive
                    ? "bg-primary/10 text-primary border-primary"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent"
                )}
                onClick={() => {
                  if (isActive) {
                    setActiveTopBarMenu(null);
                    setActivePanel(null);
                  } else {
                    setActiveTopBarMenu(item.menuId ?? null);
                    setActivePanel(null);
                  }
                }}
                data-testid={`topbar-btn-${item.key}`}
              >
                <span className="text-[9px] font-mono text-slate-500">{fKey}</span>
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Search Button */}
      <button
        type="button"
        onClick={() => state.toggleSearch()}
        className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors border-l border-slate-200"
        data-testid="topbar-btn-search"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline text-[9px] font-mono text-slate-500 ml-1">F</kbd>
      </button>

      {/* Settings Button */}
      <Link href="/settings">
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors"
          data-testid="topbar-btn-settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </Link>

      {/* Active Menu Dropdown */}
      {activeTopBarMenu && activeTopBarMenu !== "main-menu" && (
        <TopBarDropdown
          items={TOP_BAR_ITEMS}
          activeMenu={activeTopBarMenu}
          onNavigate={(href) => {
            if (href) {
              window.location.href = href;
            }
            closeAllMenus();
          }}
          onSubAction={(menuId) => {
            setActivePanel(menuId);
          }}
          onClose={closeAllMenus}
          activePanel={state.activePanel}
        />
      )}

      {/* Main Menu Dropdown (ESC) */}
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
  onSubAction,
  onClose,
  activePanel,
}: {
  items: TopBarMenuItem[];
  activeMenu: string;
  onNavigate: (href?: string) => void;
  onSubAction: (menuId: string) => void;
  onClose: () => void;
  activePanel: string | null;
}) {
  const activeItem = items.find((i) => i.menuId === activeMenu);
  if (!activeItem) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white/98 border-b border-slate-200 shadow-2xl backdrop-blur-md z-50"
      data-testid="topbar-dropdown"
    >
      <div className="max-w-[1400px] mx-auto px-4 py-3">
        {/* Menu Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <activeItem.icon className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-orbitron text-sm font-bold text-slate-900">{activeItem.label}</h3>
              <p className="text-[11px] text-slate-500">{activeItem.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeItem.href && (
              <Link href={activeItem.href}>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary/10 text-primary text-[11px] font-semibold rounded border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  Open {activeItem.label}
                </button>
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-items */}
        {activeItem.subItems && activeItem.subItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeItem.subItems.map((sub) => (
              <button
                key={sub.key}
                type="button"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-semibold uppercase tracking-wider transition-all duration-150",
                  activePanel === sub.menuId
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:text-primary hover:border-primary/20"
                )}
                onClick={() => {
                  if (sub.href) {
                    onNavigate(sub.href);
                  } else {
                    onSubAction(sub.menuId);
                  }
                }}
                data-testid={`topbar-sub-${sub.key}`}
              >
                <kbd className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                  {sub.key.toUpperCase()}
                </kbd>
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Active Sub-panel Content */}
        {activePanel && activePanel === activeMenu && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-[11px] text-slate-500">
              Sub-panel for {activeItem.label} — configure keyboard shortcuts for quick access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MainMenuDropdown({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[320px] bg-white/98 border border-slate-200 rounded-lg shadow-2xl backdrop-blur-md z-50"
      data-testid="main-menu-dropdown"
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-orbitron text-sm font-bold text-slate-900">Main Menu</h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          {MAIN_MENU_ITEMS.map((item) => (
            <div key={item.action}>
              {item.href ? (
                <Link href={item.href}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-[12px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-slate-500" />
                    {item.label}
                  </button>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-[12px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
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
    { label: "Resources", href: "/resources", section: "Empire" },
    { label: "Facilities", href: "/facilities", section: "Empire" },
    { label: "Colonies", href: "/colonies", section: "Empire" },
    { label: "Stations", href: "/stations", section: "Empire" },
    { label: "Research Hub", href: "/research", section: "Research" },
    { label: "Technology Tree", href: "/technology-tree", section: "Research" },
    { label: "Research Lab", href: "/research-lab", section: "Research" },
    { label: "Blueprints", href: "/blueprints", section: "Research" },
    { label: "Artifacts", href: "/artifacts", section: "Research" },
    { label: "Fleet Command", href: "/fleet", section: "Military" },
    { label: "Shipyard", href: "/shipyard", section: "Military" },
    { label: "Combat Center", href: "/combat", section: "Military" },
    { label: "Army", href: "/army", section: "Military" },
    { label: "Galaxy Map", href: "/galaxy", section: "Exploration" },
    { label: "Universe View", href: "/universe", section: "Exploration" },
    { label: "Warp Network", href: "/warp-network", section: "Exploration" },
    { label: "Exploration", href: "/exploration", section: "Exploration" },
    { label: "Alliance", href: "/alliance", section: "Diplomacy" },
    { label: "Government", href: "/government", section: "Diplomacy" },
    { label: "Messages", href: "/messages", section: "Diplomacy" },
    { label: "Factions", href: "/factions", section: "Diplomacy" },
    { label: "Commander", href: "/commander", section: "Diplomacy" },
    { label: "Market", href: "/market", section: "Economy" },
    { label: "Achievements", href: "/achievements", section: "Economy" },
    { label: "Settings", href: "/settings", section: "System" },
    { label: "Diagnostics", href: "/diagnostics", section: "System" },
  ];

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = query.trim()
    ? searchItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems.slice(0, 10);

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
        <div className="max-h-[300px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12px] text-slate-400">No results found</div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.href}
                type="button"
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-left text-[12px] transition-colors",
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
