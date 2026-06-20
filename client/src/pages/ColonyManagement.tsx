import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Users,
  Shield,
  Zap,
  Wheat,
  Droplets,
  TrendingUp,
  Building2,
  Hammer,
  Clock,
  Factory,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  Lock,
  ArrowUpCircle,
  Map,
  Moon,
  Satellite,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MENU_ASSETS } from "@shared/config";

interface Colony {
  id: string;
  name: string;
  type: "homeworld" | "colony" | "mining" | "research" | "agriculture" | "fortress";
  planet: string;
  population: number;
  maxPopulation: number;
  stability: number;
  security: number;
  infrastructure: number;
  energy: number;
  metal: number;
  crystal: number;
  food: number;
  water: number;
  tradeIndex: number;
  morale: number;
  buildings: number;
  maxBuildings: number;
  fleetPower: number;
  status: "thriving" | "stable" | "strained" | "critical";
  managementProfile: "balanced" | "industry" | "defense" | "science";
}

const MOCK_COLONIES: Colony[] = [
  {
    id: "col-1", name: "Prime World", type: "homeworld", planet: "Earth",
    population: 12500000, maxPopulation: 20000000, stability: 87, security: 72,
    infrastructure: 95, energy: 56000, metal: 45000, crystal: 23000, food: 32000,
    water: 18000, tradeIndex: 85, morale: 90, buildings: 24, maxBuildings: 30,
    fleetPower: 8460, status: "thriving", managementProfile: "balanced",
  },
  {
    id: "col-2", name: "Mining Colony", type: "mining", planet: "Mars",
    population: 2800000, maxPopulation: 5000000, stability: 71, security: 55,
    infrastructure: 62, energy: 12000, metal: 78000, crystal: 45000, food: 5000,
    water: 3200, tradeIndex: 60, morale: 68, buildings: 14, maxBuildings: 20,
    fleetPower: 2200, status: "stable", managementProfile: "industry",
  },
  {
    id: "col-3", name: "Research Station", type: "research", planet: "Europa",
    population: 850000, maxPopulation: 2000000, stability: 82, security: 90,
    infrastructure: 88, energy: 8500, metal: 12000, crystal: 34000, food: 2000,
    water: 15000, tradeIndex: 45, morale: 75, buildings: 10, maxBuildings: 15,
    fleetPower: 1100, status: "stable", managementProfile: "science",
  },
  {
    id: "col-4", name: "Agri World", type: "agriculture", planet: "Titan",
    population: 4200000, maxPopulation: 6000000, stability: 78, security: 40,
    infrastructure: 55, energy: 6000, metal: 8000, crystal: 5000, food: 95000,
    water: 42000, tradeIndex: 70, morale: 82, buildings: 12, maxBuildings: 18,
    fleetPower: 800, status: "stable", managementProfile: "balanced",
  },
  {
    id: "col-5", name: "Fortress World", type: "fortress", planet: "Ganymede",
    population: 1500000, maxPopulation: 3000000, stability: 65, security: 95,
    infrastructure: 70, energy: 15000, metal: 32000, crystal: 18000, food: 4000,
    water: 2500, tradeIndex: 30, morale: 60, buildings: 16, maxBuildings: 20,
    fleetPower: 12500, status: "strained", managementProfile: "defense",
  },
];

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  homeworld: { label: "Homeworld", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30", icon: Globe },
  colony: { label: "Colony", color: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: Globe },
  mining: { label: "Mining", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: Hammer },
  research: { label: "Research", color: "bg-purple-500/15 text-purple-400 border-purple-500/30", icon: Cpu },
  agriculture: { label: "Agriculture", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: Wheat },
  fortress: { label: "Fortress", color: "bg-red-500/15 text-red-400 border-red-500/30", icon: Shield },
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  thriving: { color: "bg-emerald-500/15 text-emerald-400", label: "Thriving" },
  stable: { color: "bg-cyan-500/15 text-cyan-400", label: "Stable" },
  strained: { color: "bg-amber-500/15 text-amber-400", label: "Strained" },
  critical: { color: "bg-red-500/15 text-red-400", label: "Critical" },
};

function formatPop(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="font-mono text-slate-300">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ColonyManagement() {
  const { resources } = useGame();
  const [selectedColony, setSelectedColony] = useState<Colony | null>(MOCK_COLONIES[0]);
  const [viewTab, setViewTab] = useState("overview");

  return (
    <GameLayout>
      <div className="space-y-4 p-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-orbitron font-bold text-slate-900 tracking-wider">Colony Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage colonies, populations, and planetary development</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono border-slate-300">
              {MOCK_COLONIES.length} colonies
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono border-emerald-300 text-emerald-700">
              {MOCK_COLONIES.filter((c) => c.status === "thriving").length} thriving
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Colony List */}
          <div className="col-span-4 space-y-2">
            {MOCK_COLONIES.map((colony) => {
              const typeCfg = TYPE_CONFIG[colony.type];
              const statusCfg = STATUS_CONFIG[colony.status];
              const isActive = selectedColony?.id === colony.id;
              const TypeIcon = typeCfg.icon;
              return (
                <button
                  key={colony.id}
                  type="button"
                  onClick={() => setSelectedColony(colony)}
                  className={cn(
                    "w-full text-left rounded-xl border p-3 transition-all",
                    isActive
                      ? "border-cyan-500/50 bg-cyan-500/5 shadow-lg shadow-cyan-500/10"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-semibold text-slate-900">{colony.name}</span>
                    </div>
                    <Badge className={cn("text-[9px] font-bold border", statusCfg.color)}>{statusCfg.label}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Globe className="w-3 h-3" />
                    <span>{colony.planet}</span>
                    <span className="text-slate-300">·</span>
                    <Users className="w-3 h-3" />
                    <span>{formatPop(colony.population)}</span>
                    <span className="text-slate-300">·</span>
                    <Shield className="w-3 h-3" />
                    <span>{colony.fleetPower.toLocaleString()}</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={(colony.population / colony.maxPopulation) * 100} className="h-1" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Colony Detail */}
          <div className="col-span-8">
            {selectedColony && (
              <Card className="bg-white border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-orbitron font-bold text-slate-900">{selectedColony.name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedColony.planet} · {TYPE_CONFIG[selectedColony.type].label}</p>
                    </div>
                    <div className="flex gap-1">
                      {(["balanced", "industry", "defense", "science"] as const).map((profile) => (
                        <Badge
                          key={profile}
                          className={cn(
                            "text-[9px] font-bold border cursor-pointer transition-all",
                            selectedColony.managementProfile === profile
                              ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                              : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                          )}
                        >
                          {profile}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={viewTab} onValueChange={setViewTab}>
                    <TabsList className="bg-slate-100 mb-4">
                      <TabsTrigger value="overview" className="text-[10px]">Overview</TabsTrigger>
                      <TabsTrigger value="population" className="text-[10px]">Population</TabsTrigger>
                      <TabsTrigger value="buildings" className="text-[10px]">Buildings</TabsTrigger>
                      <TabsTrigger value="defense" className="text-[10px]">Defense</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: "Stability", value: selectedColony.stability, icon: TrendingUp, color: "text-emerald-500" },
                          { label: "Security", value: selectedColony.security, icon: Shield, color: "text-blue-500" },
                          { label: "Infrastructure", value: selectedColony.infrastructure, icon: Building2, color: "text-amber-500" },
                          { label: "Morale", value: selectedColony.morale, icon: Users, color: "text-purple-500" },
                        ].map((stat) => (
                          <div key={stat.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                            <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                            <div className="text-lg font-bold text-slate-900">{stat.value}%</div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resources</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Energy", value: selectedColony.energy, icon: Zap, color: "text-amber-400" },
                            { label: "Metal", value: selectedColony.metal, icon: Hammer, color: "text-blue-400" },
                            { label: "Crystal", value: selectedColony.crystal, icon: Globe, color: "text-purple-400" },
                            { label: "Food", value: selectedColony.food, icon: Wheat, color: "text-emerald-400" },
                            { label: "Water", value: selectedColony.water, icon: Droplets, color: "text-cyan-400" },
                            { label: "Trade", value: selectedColony.tradeIndex, icon: BarChart3, color: "text-orange-400" },
                          ].map((res) => (
                            <div key={res.label} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
                              <res.icon className={cn("w-4 h-4 shrink-0", res.color)} />
                              <div>
                                <div className="text-[9px] text-slate-500 uppercase">{res.label}</div>
                                <div className="text-xs font-mono font-bold text-slate-900">{res.value.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Population</h4>
                        <StatBar label="Capacity" value={selectedColony.population} max={selectedColony.maxPopulation} color="bg-cyan-500" />
                        <StatBar label="Buildings" value={selectedColony.buildings} max={selectedColony.maxBuildings} color="bg-amber-500" />
                      </div>
                    </TabsContent>

                    <TabsContent value="population" className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Current Population", value: formatPop(selectedColony.population), icon: Users },
                          { label: "Max Capacity", value: formatPop(selectedColony.maxPopulation), icon: Building2 },
                          { label: "Growth Rate", value: "+2.4%/cycle", icon: TrendingUp },
                          { label: "Happiness", value: `${selectedColony.morale}%`, icon: Users },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
                            <item.icon className="w-5 h-5 text-slate-400" />
                            <div>
                              <div className="text-[9px] text-slate-500 uppercase tracking-wider">{item.label}</div>
                              <div className="text-sm font-bold text-slate-900">{item.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="buildings" className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: selectedColony.buildings }).map((_, i) => (
                          <div key={i} className="rounded-lg border border-slate-200 bg-white p-2 text-center">
                            <Building2 className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                            <div className="text-[9px] text-slate-500">Building {i + 1}</div>
                          </div>
                        ))}
                        {Array.from({ length: selectedColony.maxBuildings - selectedColony.buildings }).map((_, i) => (
                          <div key={`empty-${i}`} className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-2 text-center">
                            <ArrowUpCircle className="w-4 h-4 mx-auto text-slate-300 mb-1" />
                            <div className="text-[9px] text-slate-400">Empty Slot</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="defense" className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Fleet Power", value: selectedColony.fleetPower.toLocaleString(), icon: Shield, color: "text-blue-500" },
                          { label: "Security", value: `${selectedColony.security}%`, icon: Shield, color: "text-emerald-500" },
                          { label: "Threat Level", value: selectedColony.security > 80 ? "Low" : selectedColony.security > 50 ? "Medium" : "High", icon: AlertTriangle, color: selectedColony.security > 80 ? "text-emerald-500" : selectedColony.security > 50 ? "text-amber-500" : "text-red-500" },
                        ].map((item) => (
                          <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                            <item.icon className={cn("w-5 h-5 mx-auto mb-1", item.color)} />
                            <div className="text-sm font-bold text-slate-900">{item.value}</div>
                            <div className="text-[9px] text-slate-500 uppercase">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
