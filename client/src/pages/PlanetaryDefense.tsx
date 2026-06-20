import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  ShieldAlert,
  Target,
  Crosshair,
  Radar,
  Zap,
  Hammer,
  Gem,
  Droplets,
  ArrowUpCircle,
  Clock,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Satellite,
  Rocket,
  Globe,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DefenseModule {
  id: string;
  name: string;
  category: "shield" | "weapon" | "sensor" | "platform";
  level: number;
  maxLevel: number;
  hp: number;
  maxHp: number;
  power: number;
  range: number;
  fireRate: number;
  status: "active" | "damaged" | "constructing" | "offline" | "locked";
  description: string;
  upgradeCost: { metal: number; crystal: number; deuterium: number };
  upgradeTime: number;
}

interface DefenseGrid {
  shieldStrength: number;
  maxShieldStrength: number;
  armorRating: number;
  detectionRange: number;
  threatLevel: "low" | "medium" | "high" | "critical";
  activeThreats: number;
  defenseRating: number;
}

const DEFENSE_MODULES: DefenseModule[] = [
  {
    id: "planetary-shield", name: "Planetary Shield Generator", category: "shield",
    level: 7, maxLevel: 12, hp: 8500, maxHp: 10000, power: 2400, range: 0, fireRate: 0,
    status: "active", description: "Projects a powerful energy shield around the planet to absorb incoming damage.",
    upgradeCost: { metal: 18000, crystal: 14000, deuterium: 8000 }, upgradeTime: 4800,
  },
  {
    id: "orbital-battery", name: "Orbital Defense Battery", category: "weapon",
    level: 6, maxLevel: 10, hp: 5200, maxHp: 6000, power: 3800, range: 450, fireRate: 12,
    status: "active", description: "Long-range energy weapons mounted in orbit for fleet engagement.",
    upgradeCost: { metal: 15000, crystal: 11000, deuterium: 6500 }, upgradeTime: 3600,
  },
  {
    id: "missile-battery", name: "Surface Missile Battery", category: "weapon",
    level: 8, maxLevel: 10, hp: 6800, maxHp: 8000, power: 4200, range: 380, fireRate: 18,
    status: "active", description: "Surface-launched guided missiles for anti-fleet and anti-ground operations.",
    upgradeCost: { metal: 12000, crystal: 9000, deuterium: 5500 }, upgradeTime: 3200,
  },
  {
    id: "railgun-platform", name: "Railgun Platform", category: "platform",
    level: 4, maxLevel: 8, hp: 3400, maxHp: 5000, power: 5600, range: 520, fireRate: 8,
    status: "damaged", description: "High-velocity kinetic projectile launcher for long-range bombardment.",
    upgradeCost: { metal: 20000, crystal: 16000, deuterium: 10000 }, upgradeTime: 5400,
  },
  {
    id: "sensor-array", name: "Planetary Sensor Array", category: "sensor",
    level: 5, maxLevel: 8, hp: 2200, maxHp: 3000, power: 800, range: 1200, fireRate: 0,
    status: "active", description: "Deep-space scanning system for early threat detection and fleet tracking.",
    upgradeCost: { metal: 8000, crystal: 12000, deuterium: 4000 }, upgradeTime: 2400,
  },
  {
    id: "point-defense", name: "Point Defense Network", category: "weapon",
    level: 6, maxLevel: 10, hp: 4100, maxHp: 5000, power: 2800, range: 120, fireRate: 30,
    status: "active", description: "Automated close-range turrets for intercepting missiles and fighters.",
    upgradeCost: { metal: 10000, crystal: 7500, deuterium: 4500 }, upgradeTime: 2800,
  },
  {
    id: "tractor-beam", name: "Tractor Beam Emplacement", category: "weapon",
    level: 2, maxLevel: 6, hp: 1800, maxHp: 4000, power: 3200, range: 200, fireRate: 0,
    status: "constructing", description: "Gravitational beam to slow and disable enemy vessels within range.",
    upgradeCost: { metal: 22000, crystal: 18000, deuterium: 12000 }, upgradeTime: 6000,
  },
  {
    id: "deep-sensor", name: "Deep Space Scanner", category: "sensor",
    level: 0, maxLevel: 6, hp: 0, maxHp: 2500, power: 0, range: 0, fireRate: 0,
    status: "locked", description: "Advanced long-range scanner for detecting cloaked vessels and anomalies.",
    upgradeCost: { metal: 30000, crystal: 25000, deuterium: 15000 }, upgradeTime: 8400,
  },
];

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  shield: { label: "Shield", color: "text-cyan-400", icon: Shield },
  weapon: { label: "Weapon", color: "text-red-400", icon: Crosshair },
  sensor: { label: "Sensor", color: "text-purple-400", icon: Radar },
  platform: { label: "Platform", color: "text-amber-400", icon: Satellite },
};

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ComponentType<{ className?: string }> }> = {
  active: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", label: "Active", icon: CheckCircle2 },
  damaged: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30", label: "Damaged", icon: AlertTriangle },
  constructing: { color: "bg-blue-500/15 text-blue-400 border-blue-500/30", label: "Constructing", icon: Clock },
  offline: { color: "bg-slate-500/15 text-slate-400 border-slate-500/30", label: "Offline", icon: Lock },
  locked: { color: "bg-red-500/15 text-red-400 border-red-500/30", label: "Locked", icon: Lock },
};

const MOCK_GRID: DefenseGrid = {
  shieldStrength: 8500,
  maxShieldStrength: 12000,
  armorRating: 72,
  detectionRange: 1200,
  threatLevel: "medium",
  activeThreats: 2,
  defenseRating: 8450,
};

export default function PlanetaryDefense() {
  const { resources } = useGame();
  const [selectedModule, setSelectedModule] = useState<DefenseModule>(DEFENSE_MODULES[0]);
  const [viewTab, setViewTab] = useState("overview");

  return (
    <GameLayout>
      <div className="space-y-4 p-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-orbitron font-bold text-slate-900 tracking-wider">Planetary Defense</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage shields, weapons, sensors, and orbital defense platforms</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] font-mono border",
              MOCK_GRID.threatLevel === "low" ? "border-emerald-300 text-emerald-700" :
              MOCK_GRID.threatLevel === "medium" ? "border-amber-300 text-amber-700" :
              "border-red-300 text-red-700"
            )}>
              Threat: {MOCK_GRID.threatLevel}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono border-red-300 text-red-700">
              {MOCK_GRID.activeThreats} active threats
            </Badge>
          </div>
        </div>

        {/* Defense Grid Summary */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Shield", value: `${MOCK_GRID.shieldStrength.toLocaleString()}/${MOCK_GRID.maxShieldStrength.toLocaleString()}`, pct: (MOCK_GRID.shieldStrength / MOCK_GRID.maxShieldStrength) * 100, icon: Shield, color: "text-cyan-500", barColor: "bg-cyan-500" },
            { label: "Armor", value: `${MOCK_GRID.armorRating}%`, pct: MOCK_GRID.armorRating, icon: ShieldAlert, color: "text-blue-500", barColor: "bg-blue-500" },
            { label: "Detection", value: `${MOCK_GRID.detectionRange}ly`, pct: (MOCK_GRID.detectionRange / 2000) * 100, icon: Radar, color: "text-purple-500", barColor: "bg-purple-500" },
            { label: "Defense Rating", value: MOCK_GRID.defenseRating.toLocaleString(), pct: (MOCK_GRID.defenseRating / 15000) * 100, icon: Target, color: "text-amber-500", barColor: "bg-amber-500" },
            { label: "Active Modules", value: `${DEFENSE_MODULES.filter((m) => m.status === "active").length}/${DEFENSE_MODULES.length}`, pct: (DEFENSE_MODULES.filter((m) => m.status === "active").length / DEFENSE_MODULES.length) * 100, icon: Layers, color: "text-emerald-500", barColor: "bg-emerald-500" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white border-slate-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 mb-1.5">{stat.value}</div>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", stat.barColor)} style={{ width: `${Math.min(100, stat.pct)}%` }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Module List */}
          <div className="col-span-4 space-y-2">
            {(["shield", "weapon", "sensor", "platform"] as const).map((cat) => {
              const catModules = DEFENSE_MODULES.filter((m) => m.category === cat);
              const catCfg = CATEGORY_CONFIG[cat];
              const CatIcon = catCfg.icon;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
                    <CatIcon className={cn("w-3.5 h-3.5", catCfg.color)} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{catCfg.label}</span>
                    <span className="text-[9px] font-mono text-slate-500">{catModules.length}</span>
                  </div>
                  {catModules.map((mod) => {
                    const statusCfg = STATUS_CONFIG[mod.status];
                    const StatusIcon = statusCfg.icon;
                    const isActive = selectedModule.id === mod.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setSelectedModule(mod)}
                        className={cn(
                          "w-full text-left rounded-lg border p-2.5 mb-1 transition-all",
                          isActive
                            ? "border-cyan-500/50 bg-cyan-500/5"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-slate-900 truncate">{mod.name}</span>
                          <Badge className={cn("text-[8px] font-bold border ml-1 shrink-0", statusCfg.color)}>
                            <StatusIcon className="w-2 h-2 mr-0.5" />
                            {statusCfg.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-slate-500">
                          <span>Lv.{mod.level}/{mod.maxLevel}</span>
                          {mod.power > 0 && <><span className="text-slate-300">·</span><span>{mod.power}dmg</span></>}
                          {mod.range > 0 && <><span className="text-slate-300">·</span><span>{mod.range}ly</span></>}
                        </div>
                        {mod.hp > 0 && (
                          <div className="mt-1.5">
                            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full", mod.hp > mod.maxHp * 0.7 ? "bg-emerald-500" : mod.hp > mod.maxHp * 0.3 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${(mod.hp / mod.maxHp) * 100}%` }} />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Module Detail */}
          <div className="col-span-8">
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-orbitron font-bold text-slate-900">{selectedModule.name}</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">{CATEGORY_CONFIG[selectedModule.category].label} Module · Level {selectedModule.level}/{selectedModule.maxLevel}</p>
                  </div>
                  <Badge className={cn("text-[10px] font-bold border", STATUS_CONFIG[selectedModule.status].color)}>
                    {STATUS_CONFIG[selectedModule.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={viewTab} onValueChange={setViewTab}>
                  <TabsList className="bg-slate-100 mb-4">
                    <TabsTrigger value="overview" className="text-[10px]">Overview</TabsTrigger>
                    <TabsTrigger value="specs" className="text-[10px]">Specifications</TabsTrigger>
                    <TabsTrigger value="upgrade" className="text-[10px]">Upgrade</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedModule.description}</p>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Hit Points", value: selectedModule.hp > 0 ? `${selectedModule.hp.toLocaleString()}/${selectedModule.maxHp.toLocaleString()}` : "—", icon: ShieldAlert, color: "text-blue-500" },
                        { label: "Firepower", value: selectedModule.power > 0 ? selectedModule.power.toLocaleString() : "—", icon: Crosshair, color: "text-red-500" },
                        { label: "Range", value: selectedModule.range > 0 ? `${selectedModule.range}ly` : "—", icon: Radar, color: "text-purple-500" },
                        { label: "Fire Rate", value: selectedModule.fireRate > 0 ? `${selectedModule.fireRate}/min` : "—", icon: Activity, color: "text-amber-500" },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                          <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                          <div className="text-sm font-bold text-slate-900">{stat.value}</div>
                          <div className="text-[9px] text-slate-500 uppercase">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    {selectedModule.hp > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Hull Integrity</span>
                          <span className="font-mono text-slate-300">{Math.round((selectedModule.hp / selectedModule.maxHp) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all", selectedModule.hp > selectedModule.maxHp * 0.7 ? "bg-emerald-500" : selectedModule.hp > selectedModule.maxHp * 0.3 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${(selectedModule.hp / selectedModule.maxHp) * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="specs" className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries({
                        "Category": CATEGORY_CONFIG[selectedModule.category].label,
                        "Level": `${selectedModule.level}/${selectedModule.maxLevel}`,
                        "Power Draw": `${(selectedModule.power * 0.1).toFixed(1)} MW`,
                        "Mass": `${(selectedModule.power * 2.5).toFixed(0)} kT`,
                        "Build Time": `${selectedModule.upgradeTime}s`,
                        "Status": STATUS_CONFIG[selectedModule.status].label,
                      }).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5">
                          <span className="text-[10px] text-slate-500 uppercase">{key}</span>
                          <span className="text-[11px] font-mono font-bold text-slate-900">{val}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="upgrade" className="space-y-4">
                    {selectedModule.status === "locked" ? (
                      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                        <Lock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <div className="text-sm font-semibold text-slate-600">Module Locked</div>
                        <p className="text-xs text-slate-500 mt-1">Research prerequisite technology to unlock this defense module.</p>
                      </div>
                    ) : selectedModule.level >= selectedModule.maxLevel ? (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
                        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                        <div className="text-sm font-semibold text-emerald-700">Max Level Reached</div>
                        <p className="text-xs text-emerald-600 mt-1">This module has been fully upgraded.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Metal", value: selectedModule.upgradeCost.metal, icon: Hammer, color: "text-blue-500", enough: resources.metal >= selectedModule.upgradeCost.metal },
                            { label: "Crystal", value: selectedModule.upgradeCost.crystal, icon: Gem, color: "text-purple-500", enough: resources.crystal >= selectedModule.upgradeCost.crystal },
                            { label: "Deuterium", value: selectedModule.upgradeCost.deuterium, icon: Droplets, color: "text-cyan-500", enough: resources.deuterium >= selectedModule.upgradeCost.deuterium },
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
                            <span>Build Time: <span className="font-mono font-bold text-slate-900">{Math.floor(selectedModule.upgradeTime / 60)}m {selectedModule.upgradeTime % 60}s</span></span>
                          </div>
                          <Button
                            className="bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold"
                            disabled={selectedModule.status === "constructing"}
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5 mr-1.5" />
                            {selectedModule.status === "constructing" ? "Constructing..." : `Upgrade to Lv.${selectedModule.level + 1}`}
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
