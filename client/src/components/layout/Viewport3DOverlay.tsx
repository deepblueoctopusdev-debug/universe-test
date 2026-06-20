import { useState } from "react";
import { StrategyViewport3D } from "@/components/stellaris/StrategyViewport3D";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Viewport3DOverlayProps {
  defaultExpanded?: boolean;
}

export function Viewport3DOverlay({ defaultExpanded = false }: Viewport3DOverlayProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full bg-primary/90 shadow-lg hover:bg-primary"
        size="icon"
        data-testid="button-open-3d-viewport"
      >
        <span className="text-lg">🌌</span>
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-black/95 transition-all",
        isMaximized ? "opacity-100" : "opacity-90"
      )}
      data-testid="viewport-3d-overlay"
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-orbitron text-sm font-bold text-white">3D Galaxy Viewport</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Interactive Strategy Map</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white"
            onClick={() => setIsMaximized(!isMaximized)}
            data-testid="button-toggle-maximize"
          >
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white"
            onClick={() => {
              setIsOpen(false);
              setIsMaximized(false);
            }}
            data-testid="button-close-3d-viewport"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={cn("flex-1 overflow-hidden", isMaximized ? "h-[calc(100vh-3rem)]" : "h-[calc(100vh-5rem)]")}>
        <StrategyViewport3D />
      </div>
    </div>
  );
}