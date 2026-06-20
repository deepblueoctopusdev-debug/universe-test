import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Factory,
  Hammer,
  Gem,
  Zap,
  Droplets,
  ArrowUpCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  Lock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Cpu,
  Layers,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MENU_ASSETS } from "@shared/config";

interface RefinerySystem {
  id: string;
  name: string;
  linkedBuilding: string;
  linkedLabel: string;
  outputLabel: string;
  description: string;
  level: number;
  maxLevel: number;
  throughput: number;
  efficiency: number;
  stabilization: number;
  status: "active" | "upgrading" | "offline" | "locked";
  upgradeCost: { metal: number; crystal: number; deuterium: number };
  upgradeTime: number;
  nextThroughput: number;
  nextEfficiency: number;
}

const REFINERY_SYSTEMS: RefinerySystem[] = [
  {
    id: "metal-refinery", name: "Metal Refinery", linkedBuilding: "Metal Mine", linkedLabel: "Metal Mine",
    outputLabel: "Refined Metal", description: "Processes raw ore into refined metal alloys for construction.",
    level: 8, maxLevel: 12, throughput: 4500, efficiency: 87, stabilization: 3200,
    status: "active", upgradeCost: { metal: 12000, crystal: 8500, deuterium: 5200 }, upgradeTime: 3600,
    nextThroughput: 5100, nextEfficiency: 91,
  },
  {
    id: "crystal-refinery", name: "Crystal Refinery", linkedBuilding: "Crystal Mine", linkedLabel: "Crystal Mine",
    outputLabel: "Cut Crystal", description: "Refines raw crystals into precision-cut components for advanced systems.",
    level: 6, maxLevel: 12, throughput: 3200, efficiency: 78, stabilization: 2100,
    status: "active", upgradeCost: { metal: 9800, crystal: 7200, deuterium: 4100 }, upgradeTime: 2800,
    nextThroughput: 3700, nextEfficiency: 82,
  },
  {
    id: "deuterium-refinery", name: "Deuterium Refinery", linkedBuilding: "Deuterium Synth", linkedLabel: "Deuterium Synthesizer",
    outputLabel: "Heavy Water", description: "Synthesizes and purifies deuterium for fuel cells and reactor systems.",
    level: 5, maxLevel: 12, throughput: 1800, efficiency: 72, stabilization: 1500,
    status: "active", upgradeCost: { metal: 8500, crystal: 6800, deuterium: 3800 }, upgradeTime: 2400,
    nextThroughput: 2200, nextEfficiency: 76,
  },
  {
    id: "food-processing", name: "Food Processing", linkedBuilding: "Agri Dome", linkedLabel: "Agricultural Dome",
    outputLabel: "Processed Rations", description: "Converts raw agricultural output into preserved rations for colony supply.",
    level: 4, maxLevel: 10, throughput: 6200, efficiency: 68, stabilization: 4800,
    status: "active", upgradeCost: { metal: 6500, crystal: 4200, deuterium: 2800 }, upgradeTime: 1800,
    nextThroughput: 7100, nextEfficiency: 72,
  },
  {
    id: "fuel-processing", name: "Fuel Processing", linkedBuilding: "Fuel Depot", linkedLabel: "Fuel Depot",
    outputLabel: "Reactor Fuel", description: "Processes raw fuel stockpiles into reactor-grade fuel for fleet operations.",
    level: 3, maxLevel: 10, throughput: 2400, efficiency: 65, stabilization: 1900,
    status: "upgrading", upgradeCost: { metal: 7200, crystal: 5100, deuterium: 3200 }, upgradeTime: 1200,
    nextThroughput: 2900, nextEfficiency: 69,
  },
  {
    id: "nanite-forge", name: "Nanite Forge", linkedBuilding: "Nanite Factory", linkedLabel: "Nanite Assembly",
    outputLabel: "Nanite Swarm", description: "Assembles nanite swarms for automated construction and repair operations.",
    level: 0, maxLevel: 8, throughput: 0, efficiency: 0, stabilization: 0,
    status: "locked", upgradeCost: { metal: 25000, crystal: 18000, deuterium: 12000 }, upgradeTime: 7200,
    nextThroughput: 800, nextEfficiency: 40,
  },
];

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ComponentType<{ className?: string }> }> = {
  active: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", label: "Active", icon: CheckCircle2 },
  upgrading: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30", label: "Upgrading", icon: Clock },
  offline: { color: "bg-slate-500/15 text-slate-400 border-slate-500/30", label: "Offline", icon: AlertCircle },
  locked: { color: "bg-red-500/15 text-red-400 border-red-500/30", label: "Locked", icon: Lock },
};

function formatRate(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function ResourceRefinery() {
  const { resources } = useGame();
  const [selectedRefinery, setSelectedRefinery] = useState<RefinerySystem>(REFINERY_SYSTEMS[0]);
  const [viewTab, setViewTab] = useState("systems");

  return (
    <GameLayout>
      <div className="space-y-4 p-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-orbitron font-bold text-slate-900 tracking-wider">Resource Refinery</h1>
            <p className="text-xs text-slate-500 mt-0.5">Process raw resources into refined materials for empire construction</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono border-slate-300">
              {REFINERY_SYSTEMS.filter((r) => r.status === "active").length} active
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono border-amber-300 text-amber-700">
              {REFINERY_SYSTEMS.filter((r) => r.status === "upgrading").length} upgrading
            </Badge>
          </div>
        </div>

        {/* Resource Summary */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Metal", value: resources.metal, icon: Hammer, color: "text-blue-400", bgColor: "bg-blue-50 border-blue-200" },
            { label: "Crystal", value: resources.crystal, icon: Gem, color: "text-purple-400", bgColor: "bg-purple-50 border-purple-200" },
            { label: "Deuterium", value: resources.deuterium, icon: Droplets, color: "text-cyan-400", bgColor: "bg-cyan-50 border-cyan-200" },
            { label: "Energy", value: resources.energy, icon: Zap, color: "text-amber-400", bgColor: "bg-amber-50 border-amber-200" },
            { label: "Food", value: resources.food, icon: Box, color: "text-emerald-400", bgColor: "bg-emerald-50 border-emerald-200" },
          ].map((res) => (
            <Card key={res.label} className={cn("border", res.bgColor)}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <res.icon className={cn("w-5 h-5", res.color)} />
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider">{res.label}</div>
                    <div className="text-sm font-bold font-mono text-slate-900">{res.value.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Refinery List */}
          <div className="col-span-4 space-y-2">
            {REFINERY_SYSTEMS.map((refinery) => {
              const statusCfg = STATUS_CONFIG[refinery.status];
              const StatusIcon = statusCfg.icon;
              const isActive = selectedRefinery.id === refinery.id;
              return (
                <button
                  key={refinery.id}
                  type="button"
                  onClick={() => setSelectedRefinery(refinery)}
                  className={cn(
                    "w-full text-left rounded-xl border p-3 transition-all",
                    isActive
                      ? "border-cyan-500/50 bg-cyan-500/5 shadow-lg shadow-cyan-500/10"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-900">{refinery.name}</span>
                    <Badge className={cn("text-[9px] font-bold border", statusCfg.color)}>
                      <StatusIcon className="w-2.5 h-2.5 mr-1" />
                      {statusCfg.label}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-slate-500 mb-2">{refinery.description}</div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-slate-400">Lv.{refinery.level}/{refinery.maxLevel}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-slate-600">{formatRate(refinery.throughput)}/cycle</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-slate-600">{refinery.efficiency}%</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={(refinery.level / refinery.maxLevel) * 100} className="h-1" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Refinery Detail */}
          <div className="col-span-8">
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-orbitron font-bold text-slate-900">{selectedRefinery.name}</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">Linked to {selectedRefinery.linkedLabel} · Output: {selectedRefinery.outputLabel}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="text-[10px] font-mono bg-slate-100 text-slate-600 border-slate-200">
                      Level {selectedRefinery.level}/{selectedRefinery.maxLevel}
                    </Badge>
                    <Badge className={cn("text-[10px] font-bold border", STATUS_CONFIG[selectedRefinery.status].color)}>
                      {STATUS_CONFIG[selectedRefinery.status].label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={viewTab} onValueChange={setViewTab}>
                  <TabsList className="bg-slate-100 mb-4">
                    <TabsTrigger value="systems" className="text-[10px]">Systems</TabsTrigger>
                    <TabsTrigger value="throughput" className="text-[10px]">Throughput</TabsTrigger>
                    <TabsTrigger value="upgrade" className="text-[10px]">Upgrade</TabsTrigger>
                  </TabsList>

                  <TabsContent value="systems" className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                        <Factory className="w-6 h-6 mx-auto text-cyan-500 mb-2" />
                        <div className="text-xl font-bold text-slate-900">{formatRate(selectedRefinery.throughput)}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider">Throughput/cycle</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                        <Cpu className="w-6 h-6 mx-auto text-emerald-500 mb-2" />
                        <div className="text-xl font-bold text-slate-900">{selectedRefinery.efficiency}%</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider">Efficiency</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                        <Layers className="w-6 h-6 mx-auto text-amber-500 mb-2" />
                        <div className="text-xl font-bold text-slate-900">{formatRate(selectedRefinery.stabilization)}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider">Stabilization</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Level Progress</h4>
                      <StatBar label="Level" value={selectedRefinery.level} max={selectedRefinery.maxLevel} color="bg-cyan-500" />
                      <StatBar label="Efficiency" value={selectedRefinery.efficiency} max={100} color="bg-emerald-500" />
                    </div>
                  </TabsContent>

                  <TabsContent value="throughput" className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Current Throughput", value: formatRate(selectedRefinery.throughput), color: "text-cyan-500" },
                        { label: "Next Level", value: selectedRefinery.status === "locked" ? "—" : formatRate(selectedRefinery.nextThroughput), color: "text-emerald-500" },
                        { label: "Current Efficiency", value: `${selectedRefinery.efficiency}%`, color: "text-purple-500" },
                        { label: "Next Efficiency", value: selectedRefinery.status === "locked" ? "—" : `${selectedRefinery.nextEfficiency}%`, color: "text-amber-500" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-3">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider">{item.label}</div>
                          <div className={cn("text-lg font-bold font-mono mt-1", item.color)}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="upgrade" className="space-y-4">
                    {selectedRefinery.status === "locked" ? (
                      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                        <Lock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <div className="text-sm font-semibold text-slate-600">Refinery Locked</div>
                        <p className="text-xs text-slate-500 mt-1">Research prerequisite technology to unlock this refinery.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Metal", value: selectedRefinery.upgradeCost.metal, icon: Hammer, color: "text-blue-500", enough: resources.metal >= selectedRefinery.upgradeCost.metal },
                            { label: "Crystal", value: selectedRefinery.upgradeCost.crystal, icon: Gem, color: "text-purple-500", enough: resources.crystal >= selectedRefinery.upgradeCost.crystal },
                            { label: "Deuterium", value: selectedRefinery.upgradeCost.deuterium, icon: Droplets, color: "text-cyan-500", enough: resources.deuterium >= selectedRefinery.upgradeCost.deuterium },
                          ].map((cost) => (
                            <div key={cost.label} className={cn("rounded-lg border p-3", cost.enough ? "border-slate-200 bg-white" : "border-red-200 bg-red-50")}>
                              <div className="flex items-center gap-2 mb-1">
                                <cost.icon className={cn("w-4 h-4", cost.color)} />
                                <span className="text-[9px] text-slate-500 uppercase">{cost.label}</span>
                              </div>
                              <div className="text-sm font-bold font-mono text-slate-900">{cost.value.toLocaleString()}</div>
                              {!cost.enough && <div className="text-[9px] text-red-500 mt-1">Insufficient</div>}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>Upgrade Time: <span className="font-mono font-bold text-slate-900">{Math.floor(selectedRefinery.upgradeTime / 60)}m {selectedRefinery.upgradeTime % 60}s</span></span>
                          </div>
                          <Button
                            className="bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold"
                            disabled={selectedRefinery.status === "upgrading"}
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5 mr-1.5" />
                            {selectedRefinery.status === "upgrading" ? "Upgrading..." : "Upgrade to Lv." + (selectedRefinery.level + 1)}
                          </Button>
                        </div>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="font-mono text-slate-300">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
