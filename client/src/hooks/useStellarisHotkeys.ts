import { useEffect, useCallback, useRef, useState } from 'react';

export type GameSpeed = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface StellarisHotkeyState {
  gameSpeed: GameSpeed;
  setGameSpeed: (speed: GameSpeed) => void;
  isPaused: boolean;
  togglePause: () => void;
  advanceOneDay: () => void;
  uiHidden: boolean;
  toggleUI: () => void;
  outlinerOpen: boolean;
  toggleOutliner: () => void;
  outlinerTab: number;
  setOutlinerTab: (tab: number) => void;
  activeTopBarMenu: string | null;
  setActiveTopBarMenu: (menu: string | null) => void;
  activePanel: string | null;
  setActivePanel: (panel: string | null) => void;
  mapMode: string;
  setMapMode: (mode: string) => void;
  openMenu: (menu: string) => void;
  closeAllMenus: () => void;
  searchOpen: boolean;
  toggleSearch: () => void;
}

let globalState: StellarisHotkeyState = {
  gameSpeed: 3,
  setGameSpeed: () => {},
  isPaused: false,
  togglePause: () => {},
  advanceOneDay: () => {},
  uiHidden: false,
  toggleUI: () => {},
  outlinerOpen: false,
  toggleOutliner: () => {},
  outlinerTab: 0,
  setOutlinerTab: () => {},
  activeTopBarMenu: null,
  setActiveTopBarMenu: () => {},
  activePanel: null,
  setActivePanel: () => {},
  mapMode: 'empire',
  setMapMode: () => {},
  openMenu: () => {},
  closeAllMenus: () => {},
  searchOpen: false,
  toggleSearch: () => {},
};

export function useStellarisHotkeyState(): StellarisHotkeyState {
  return globalState;
}

const TOP_BAR_MENUS: Record<string, string> = {
  'f1': 'empire-overview',
  'f2': 'situation-log',
  'f3': 'market',
  'f4': 'research',
  'f5': 'fleets',
  'f6': 'leaders',
  'f7': 'expansion',
  'f8': 'factions',
  'f9': 'contacts',
  'f10': 'government',
};

const PANEL_KEYS: Record<string, string> = {
  'z': 'government',
  'c': 'demographics',
  'v': 'advisor',
};

const GOVERNMENT_SUBMENU: Record<string, string> = {
  'z': 'situation-log',
  'x': 'empire-focus',
  'c': 'anomalies',
  'v': 'victory',
};

const MARKET_SUBMENU: Record<string, string> = {
  'z': 'market-trade',
  'x': 'slave-market',
};

const TECHNOLOGY_SUBMENU: Record<string, string> = {
  'z': 'physics',
  'x': 'society',
  'c': 'engineering',
  'v': 'researched',
};

const PLANET_SUBMENU: Record<string, string> = {
  'z': 'planet-summary',
  'x': 'population',
  'c': 'armies',
  'v': 'corporate',
  'n': 'decisions',
  'i': 'resettle',
  'k': 'features',
  't': 'terraform',
  'b': 'build-district',
  'p': 'replace',
  'g': 'governor',
  'j': 'restore-jobs',
  'q': 'goto',
};

const SHIP_SUBMENU: Record<string, string> = {
  'g': 'merge',
  'h': 'stop',
  'b': 'return-base',
  'c': 'move',
  'j': 'jump',
  'p': 'patrol',
  'x': 'attack',
  't': 'fleet-stance',
  'v': 'split-fleet',
  'q': 'goto',
};

const STARBASE_SUBMENU: Record<string, string> = {
  'z': 'starbase',
  'x': 'defenses',
  'c': 'shipyard',
  'k': 'details',
  't': 'trade-routes',
  'u': 'upgrade',
  'b': 'build',
  'q': 'goto',
};

const MAP_MODE_KEYS: Record<string, string> = {
  'ctrl+z': 'empire-map',
  'ctrl+x': 'diplomatic-map',
  'ctrl+c': 'opinion-map',
  'ctrl+v': 'attitude-map',
  'ctrl+b': 'neighbor-map',
};

export function useStellarisHotkeys(
  navigate: (path: string) => void,
  currentPath: string,
): StellarisHotkeyState {
  const [gameSpeed, setGameSpeed] = useState<GameSpeed>(3);
  const [isPaused, setIsPaused] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const [outlinerOpen, setOutlinerOpen] = useState(false);
  const [outlinerTab, setOutlinerTab] = useState(0);
  const [activeTopBarMenu, setActiveTopBarMenu] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState('empire');
  const [searchOpen, setSearchOpen] = useState(false);

  const currentPathRef = useRef(currentPath);
  currentPathRef.current = currentPath;

  const activeTopBarMenuRef = useRef(activeTopBarMenu);
  activeTopBarMenuRef.current = activeTopBarMenu;

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const advanceOneDay = useCallback(() => {
    setIsPaused(true);
  }, []);

  const toggleUI = useCallback(() => {
    setUiHidden(prev => !prev);
  }, []);

  const toggleOutliner = useCallback(() => {
    setOutlinerOpen(prev => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen(prev => !prev);
  }, []);

  const openMenu = useCallback((menu: string) => {
    if (activeTopBarMenuRef.current === menu) {
      setActiveTopBarMenu(null);
    } else {
      setActiveTopBarMenu(menu);
    }
    setActivePanel(null);
  }, []);

  const closeAllMenus = useCallback(() => {
    setActiveTopBarMenu(null);
    setActivePanel(null);
    setSearchOpen(false);
  }, []);

  const state: StellarisHotkeyState = {
    gameSpeed,
    setGameSpeed: (speed: GameSpeed) => {
      setGameSpeed(speed);
      setIsPaused(speed === 0);
    },
    isPaused,
    togglePause,
    advanceOneDay,
    uiHidden,
    toggleUI,
    outlinerOpen,
    toggleOutliner,
    outlinerTab,
    setOutlinerTab,
    activeTopBarMenu,
    setActiveTopBarMenu,
    activePanel,
    setActivePanel,
    mapMode,
    setMapMode,
    openMenu,
    closeAllMenus,
    searchOpen,
    toggleSearch,
  };

  globalState = state;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;

      // Don't intercept when typing in inputs (except Escape, F-keys, and Space for pause)
      if (isInputFocused && key !== 'escape' && !key.startsWith('f') && key !== ' ') {
        return;
      }

      // ESC - Close active menu / open main menu
      if (key === 'escape') {
        e.preventDefault();
        if (activeTopBarMenuRef.current) {
          setActiveTopBarMenu(null);
          setActivePanel(null);
        } else {
          setActiveTopBarMenu('main-menu');
        }
        return;
      }

      // F11 - Hide UI
      if (key === 'f11') {
        e.preventDefault();
        toggleUI();
        return;
      }

      // F1-F10 - Navigation menu items
      if (TOP_BAR_MENUS[key]) {
        e.preventDefault();
        openMenu(TOP_BAR_MENUS[key]);
        return;
      }

      // Space - Pause/Unpause
      if (key === ' ' && !ctrl && !isInputFocused) {
        e.preventDefault();
        togglePause();
        return;
      }

      // . (period) when paused - advance one day
      if (key === '.' && isPaused) {
        e.preventDefault();
        advanceOneDay();
        return;
      }

      // + / numpad+ - increase game speed
      if (key === '=' || key === '+') {
        e.preventDefault();
        setGameSpeed((Math.min(6, gameSpeed + 1) as GameSpeed));
        return;
      }

      // - / numpad- - decrease game speed
      if (key === '-' || key === '_') {
        e.preventDefault();
        setGameSpeed((Math.max(0, gameSpeed - 1) as GameSpeed));
        return;
      }

      // O - Toggle outliner
      if (key === 'o' && !ctrl && !alt) {
        e.preventDefault();
        toggleOutliner();
        return;
      }

      // F - System search
      if (key === 'f' && !ctrl && !alt) {
        e.preventDefault();
        toggleSearch();
        return;
      }

      // Tab - cycle through systems (navigate)
      if (key === 'tab' && !ctrl && !isInputFocused) {
        e.preventDefault();
        if (shift) {
          navigate('/galaxy');
        } else {
          navigate('/galaxy');
        }
        return;
      }

      // Home / Backspace - go to home system
      if (key === 'home' || key === 'backspace') {
        if (!isInputFocused) {
          e.preventDefault();
          navigate('/');
        }
        return;
      }

      // E or M - open/close galaxy map
      if ((key === 'e' || key === 'm') && !ctrl && !alt && !isInputFocused) {
        e.preventDefault();
        if (currentPathRef.current === '/galaxy') {
          navigate('/');
        } else {
          navigate('/galaxy');
        }
        return;
      }

      // Ctrl+Q/W/E/R - outliner tabs
      if (ctrl && !shift && !alt) {
        const tabMap: Record<string, number> = { 'q': 0, 'w': 1, 'e': 2, 'r': 3 };
        if (tabMap[key]) {
          e.preventDefault();
          setOutlinerTab(tabMap[key]);
          setOutlinerOpen(true);
          return;
        }
      }

      // Ctrl+A / Ctrl+D - outliner tab prev/next
      if (ctrl && !shift && !alt) {
        if (key === 'a') {
          e.preventDefault();
          setOutlinerTab(prev => Math.max(0, prev - 1));
          setOutlinerOpen(true);
          return;
        }
        if (key === 'd') {
          e.preventDefault();
          setOutlinerTab(prev => Math.min(3, prev + 1));
          setOutlinerOpen(true);
          return;
        }
      }

      // Ctrl+Z - Empire Map Mode
      if (ctrl && key === 'z' && !shift) {
        e.preventDefault();
        setMapMode('empire');
        return;
      }
      // Ctrl+X - Diplomatic Map Mode
      if (ctrl && key === 'x') {
        e.preventDefault();
        setMapMode('diplomatic');
        return;
      }
      // Ctrl+V - Opinion Map Mode
      if (ctrl && key === 'v') {
        e.preventDefault();
        setMapMode('opinion');
        return;
      }
      // Ctrl+B - Neighbor Map Mode
      if (ctrl && key === 'b') {
        e.preventDefault();
        setMapMode('neighbor');
        return;
      }

      // Ctrl+Alt+L - multiplayer ping (no-op in single player)
      if (ctrl && alt && key === 'l') {
        e.preventDefault();
        return;
      }

      // L - multiplayer chat (open messages)
      if (key === 'l' && !ctrl && !alt && !isInputFocused) {
        e.preventDefault();
        navigate('/messages');
        return;
      }

      // Alt+B - help
      if (alt && key === 'b') {
        e.preventDefault();
        navigate('/about');
        return;
      }

      // Number keys 1-9 for control groups (no-op placeholder)
      if (/^[1-9]$/.test(key) && !ctrl && !alt && !shift && !isInputFocused) {
        // Control group selection - reserved
        return;
      }

      // Ctrl+1-9 for creating control groups (no-op placeholder)
      if (ctrl && /^[1-9]$/.test(key) && !shift && !alt) {
        // Control group creation - reserved
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, togglePause, advanceOneDay, toggleUI, toggleOutliner, toggleSearch, openMenu, closeAllMenus, isPaused, setGameSpeed, setMapMode, setOutlinerTab]);

  return state;
}
