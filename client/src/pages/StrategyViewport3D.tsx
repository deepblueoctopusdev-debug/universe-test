import GameLayout from "@/components/layout/GameLayout";
import { StrategyViewport3D } from "@/components/stellaris/StrategyViewport3D";

export default function StrategyViewportPage() {
  return (
    <GameLayout>
      <div className="h-[calc(100vh-8rem)] w-full -m-3 sm:-m-4 lg:-m-6 overflow-hidden rounded-xl border border-slate-200">
        <StrategyViewport3D />
      </div>
    </GameLayout>
  );
}
