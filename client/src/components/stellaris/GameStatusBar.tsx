import { cn } from "@/lib/utils";
import { useStellarisHotkeyState, type GameSpeed } from "@/hooks/useStellarisHotkeys";
import {
  Pause,
  Play,
  FastForward,
  SkipForward,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  LayoutPanelLeft,
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

export function GameStatusBar() {
  const state = useStellarisHotkeyState();
  const { gameSpeed, setGameSpeed, isPaused, togglePause, advanceOneDay, uiHidden, toggleUI, outlinerOpen, toggleOutliner } = state;

  const handleSpeedChange = (speed: GameSpeed) => {
    setGameSpeed(speed);
  };

  return (
    <div className="relative z-50 flex items-center justify-between border-t border-slate-200 bg-white/95 backdrop-blur-md px-3 py-1.5" data-testid="stellaris-status-bar">
      {/* Left: Game Speed Controls */}
      <div className="flex items-center gap-2">
        {/* Pause Button */}
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

        {/* Decrease Speed */}
        <button
          type="button"
          onClick={() => handleSpeedChange(Math.max(0, gameSpeed - 1) as GameSpeed)}
          className="flex items-center justify-center w-6 h-6 rounded bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-900 hover:border-slate-300 transition-colors"
          data-testid="btn-speed-down"
          title="Decrease speed (-)"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>

        {/* Speed Indicators */}
        <div className="flex items-center gap-1">
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

        {/* Increase Speed */}
        <button
          type="button"
          onClick={() => handleSpeedChange(Math.min(6, gameSpeed + 1) as GameSpeed)}
          className="flex items-center justify-center w-6 h-6 rounded bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-900 hover:border-slate-300 transition-colors"
          data-testid="btn-speed-up"
          title="Increase speed (+)"
        >
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Speed Label */}
        <span className="text-[10px] font-mono text-slate-400 ml-1">
          {SPEED_LABELS[gameSpeed]}
        </span>
      </div>

      {/* Center: Status Info */}
      <div className="flex items-center gap-4">
        {isPaused && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/15 rounded border border-amber-500/25">
            <Pause className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Paused</span>
          </div>
        )}
        <div className="text-[10px] text-slate-400 font-mono">
          <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[9px]">Space</kbd> pause · <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[9px]">+/-</kbd> speed
        </div>
      </div>

      {/* Right: UI Controls */}
      <div className="flex items-center gap-2">
        {/* Advance One Day (when paused) */}
        {isPaused && (
          <button
            type="button"
            onClick={advanceOneDay}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-slate-500 hover:text-primary bg-slate-50 rounded border border-slate-200 hover:border-primary/20 transition-colors"
            title="Advance one day (.)"
          >
            <SkipForward className="w-3 h-3" />
            <span className="hidden sm:inline">+1 Day</span>
          </button>
        )}

        {/* Outliner Toggle */}
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

        {/* Hide UI */}
        <button
          type="button"
          onClick={toggleUI}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded border transition-colors",
            uiHidden
              ? "bg-red-50 text-red-500 border-red-200"
              : "text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200"
          )}
          title="Toggle UI (Ctrl+F9)"
        >
          {uiHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          <span className="hidden sm:inline">UI</span>
        </button>
      </div>
    </div>
  );
}
