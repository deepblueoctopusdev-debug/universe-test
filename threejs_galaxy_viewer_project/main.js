import { MENU_DEFINITIONS, getPageById } from "./src/data/menuConfig.js";
import { GALAXY_SCALE_PRESETS } from "./src/data/galaxyScalePresets.js";
import { GAME_RUNTIME_BRIDGE, summarizeRuntimeBridge } from "./src/data/gameRuntimeBridge.js";
import { PROJECT_SOURCE_LINKS, VIEWER_ASSET_MOUNTS } from "./src/data/projectLinks.js";
import { createSceneController } from "./src/3d/sceneController.js";
import { setupInputManager } from "./src/input/inputManager.js";
import { createViewerState } from "./src/state/viewerState.js";
import { createControlPanel } from "./src/ui/controlPanel.js";

const canvasRoot = document.querySelector("#viewer-root");
const hudRoot = document.querySelector("#hud-root");

const state = createViewerState({
  menus: MENU_DEFINITIONS,
  galaxyScalePresets: GALAXY_SCALE_PRESETS,
  initialSystemCount: 400,
  projectLinks: PROJECT_SOURCE_LINKS,
  assetMounts: VIEWER_ASSET_MOUNTS,
  runtimeBridgeSummary: summarizeRuntimeBridge(GAME_RUNTIME_BRIDGE),
});

const sceneController = createSceneController({
  container: canvasRoot,
  onSystemHover: (system) => state.setHoveredSystem(system),
  onSystemSelect: (system) => state.selectSystem(system),
  onPlanetSelect: ({ system, planet }) => {
    state.selectSystem(system);
    state.selectPlanet(planet);
  },
});

createControlPanel({
  root: hudRoot,
  state,
});

setupInputManager({
  state,
  sceneController,
});

const initialState = state.getState();
sceneController.rebuildGalaxy({
  seed: initialState.seed,
  systemCount: initialState.systemCount,
  bridgeData: GAME_RUNTIME_BRIDGE,
});
sceneController.applyPage(getPageById(initialState.activePageId));
sceneController.setViewMode(initialState.viewMode);
sceneController.applyShipControlMode(initialState.shipControlMode);

state.subscribe((nextState, previousState) => {
  if (
    nextState.seed !== previousState.seed ||
    nextState.systemCount !== previousState.systemCount
  ) {
    sceneController.rebuildGalaxy({
      seed: nextState.seed,
      systemCount: nextState.systemCount,
      bridgeData: GAME_RUNTIME_BRIDGE,
    });
  }

  if (nextState.activePageId !== previousState.activePageId) {
    sceneController.applyPage(getPageById(nextState.activePageId));
  }

  if (
    nextState.selectedSystem?.id !== previousState.selectedSystem?.id ||
    nextState.hoveredSystem?.id !== previousState.hoveredSystem?.id ||
    nextState.selectedPlanet?.id !== previousState.selectedPlanet?.id
  ) {
    sceneController.syncSelection({
      selectedSystemId: nextState.selectedSystem?.id || null,
      hoveredSystemId: nextState.hoveredSystem?.id || null,
      selectedPlanetId: nextState.selectedPlanet?.id || null,
    });
  }

  if (nextState.motionEnabled !== previousState.motionEnabled) {
    sceneController.setMotionEnabled(nextState.motionEnabled);
  }

  if (nextState.viewMode !== previousState.viewMode) {
    sceneController.setViewMode(nextState.viewMode);
  }

  if (nextState.shipControlMode !== previousState.shipControlMode) {
    sceneController.applyShipControlMode(nextState.shipControlMode);
  }
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const ctrl = event.ctrlKey || event.metaKey;
  const shift = event.shiftKey;
  const target = event.target;
  const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

  // Don't intercept input fields (except ESC and F-keys)
  if (isInput && !event.key.startsWith('F') && event.key !== 'Escape') return;

  // Original bindings
  if (key === "r") {
    state.regenerate();
  }

  if (key === "f" && !ctrl) {
    sceneController.focusSelectedSystem();
  }

  if (event.key === "1") {
    state.setViewMode("galaxy");
  }

  if (event.key === "2") {
    state.setViewMode("system");
  }

  if (event.key === "3") {
    state.setViewMode("planet");
  }

  if (key === "q" && !ctrl) {
    state.cycleShipControlMode(-1);
  }

  if (key === "e" && !ctrl) {
    state.cycleShipControlMode(1);
  }

  if (event.key === "[") {
    state.cycleMenu(-1);
  }

  if (event.key === "]") {
    state.cycleMenu(1);
  }

  if (event.key === ",") {
    state.cyclePage(-1);
  }

  if (event.key === ".") {
    state.cyclePage(1);
  }

  // === Stellaris Hotkeys ===

  // ESC - Close menu or open main menu
  if (event.key === 'Escape') {
    event.preventDefault();
    if (state.getState().activeMenuId) {
      state.setActiveMenu(null);
    } else {
      state.setActiveMenu('main-menu');
    }
  }

  // F1-F10 - Stellaris navigation menu items
  const fKeyMap = {
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

  if (fKeyMap[event.key.toLowerCase()]) {
    event.preventDefault();
    state.setActiveMenu(fKeyMap[event.key.toLowerCase()]);
  }

  // Space - Pause / Unpause
  if (event.key === ' ' && !ctrl && !isInput) {
    event.preventDefault();
    state.toggleMotion();
  }

  // +/- - Increase / Decrease game speed
  if (key === '=' || key === '+') {
    event.preventDefault();
    state.setSpeed(Math.min(6, (state.getState().speed || 3) + 1));
  }
  if (key === '-' || key === '_') {
    event.preventDefault();
    state.setSpeed(Math.max(0, (state.getState().speed || 3) - 1));
  }

  // Home / Backspace - Go to home system
  if (key === 'home' || key === 'backspace') {
    if (!isInput) {
      event.preventDefault();
      sceneController.focusHomeSystem();
    }
  }

  // O - Toggle outliner
  if (key === 'o' && !ctrl && !isInput) {
    event.preventDefault();
    state.toggleOutliner();
  }

  // L - Multiplayer chat
  if (key === 'l' && !ctrl && !isInput) {
    event.preventDefault();
    // Open messages/chat panel
  }

  // M - Toggle galaxy map view
  if (key === 'm' && !ctrl && !isInput) {
    event.preventDefault();
    const currentMode = state.getState().viewMode;
    state.setViewMode(currentMode === 'galaxy' ? 'system' : 'galaxy');
  }

  // Ctrl+Z/X/C/V/B - Map modes
  if (ctrl) {
    const mapModeMap = {
      'z': 'empire-map',
      'x': 'diplomatic-map',
      'c': 'opinion-map',
      'v': 'attitude-map',
      'b': 'neighbor-map',
    };
    if (mapModeMap[key]) {
      event.preventDefault();
      state.setMapMode(mapModeMap[key]);
    }
  }

  // Ctrl+F9 - Hide UI
  if (ctrl && event.key === 'F9') {
    event.preventDefault();
    state.toggleUI();
  }

  // F11 - Screenshot (browser default)
  // F12 - Steam overlay (handled by Steam)
});
