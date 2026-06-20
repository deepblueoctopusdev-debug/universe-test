import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { PLANET_ASSETS, TECH_BRANCH_ASSETS, SHIP_ASSETS } from "@shared/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Activity, Thermometer, Ruler, User, Shield, Crosshair, Send, AlertTriangle, 
  Info, CheckCircle, AlertCircle, Box, Gem, Database, Zap, TrendingUp, 
  Clock, Rocket, FlaskConical, Factory, Pickaxe, Globe, Star, Target,
  ArrowUpCircle, Users, Trophy, Swords, Eye, MessageSquare, Bell
} from "lucide-react";
import { getPlanetDetails } from "@/lib/planetUtils";
import Navigation from "./Navigation";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { GalaxyViewport } from "@/components/stellaris/GalaxyViewport";

const TEMP_THEME_IMAGE = "/theme-temp.png";

interface SeasonPassProgressResponse {
  success: boolean;
  state: {
    currentTier: number;
    xp: number;
    xpIntoTier: number;
    xpForNextTier: number;
    completionRatio: number;
  };
}

interface BattlePassOverviewResponse {
  state: {
    currentTier: number;
    xp: number;
    xpIntoTier: number;
    xpForNextTier: number;
    completionRatio: number;
    premiumUnlocked: boolean;
    eliteUnlocked: boolean;
  };
}

interface PopulationSnapshotResponse {
  success: boolean;
  snapshot: {
    frameTier: number;
    frame: {
      name: string;
    };
    population: {
      current: number;
      capacity: number;
      utilization: number;
      happiness: number;
      estimatedGrowthPerHour: number;
    };
    food: {
      pressure: "surplus" | "stable" | "strained" | "critical";
      netPerHour: number;
      hoursToDepletion: number | null;
    };
    water: {
      pressure: "surplus" | "stable" | "strained" | "critical";
      netPerHour: number;
      hoursToDepletion: number | null;
    };
    civilizationSystems: {
      projectedProductivity: number;
      foodDemandFromJobsPerHour: number;
      waterDemandFromJobsPerHour: number;
    };
  };
}

function pressureBadgeClass(pressure: "surplus" | "stable" | "strained" | "critical"): string {
  if (pressure === "surplus") return "text-emerald-700 border-emerald-300";
  if (pressure === "stable") return "text-blue-700 border-blue-300";
  if (pressure === "strained") return "text-amber-700 border-amber-300";
  return "text-red-700 border-red-300";
}

function getPlanetImagePath(planetClass: string): string {
  const c = planetClass.toUpperCase();
  if (c === "M") return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
  if (c === "H") return PLANET_ASSETS.TERRESTRIAL.DESERT.path;
  if (c === "L") return PLANET_ASSETS.TERRESTRIAL.JUNGLE.path;
  if (c === "K") return PLANET_ASSETS.TERRESTRIAL.ICE.path;
  if (c === "Y") return PLANET_ASSETS.TERRESTRIAL.VOLCANIC.path;
  if (c === "D") return PLANET_ASSETS.TERRESTRIAL.DESERT.path;
  if (c === "J") return PLANET_ASSETS.GAS_GIANTS.JUPITER_CLASS.path;
  if (c === "T") return PLANET_ASSETS.GAS_GIANTS.NEPTUNE_CLASS.path;
  return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
}

export default function Overview() {
  const { toast } = useToast();
  const { 
    planetName, resources, buildings, events, coordinates, username, 
    queue, activeMissions, research, units, messages, alliance
  } = useGame();
  
  const coordParts = coordinates.split(':').map(p => parseInt(p) || 0);
  const planetSeed = (coordParts[0] || 1) * 10000 + (coordParts[1] || 1) * 1000 + (coordParts[2] || 100) * 100 + (coordParts[3] || 3);
  const planetInfo = getPlanetDetails(planetSeed);
  
  const displayUsername = username || localStorage.getItem("stellar_username") || "Commander";

  const metalProduction = Math.floor(30 * buildings.metalMine * 1.1);
  const crystalProduction = Math.floor(20 * buildings.crystalMine * 1.05);
  const deuteriumProduction = Math.floor(10 * buildings.deuteriumSynthesizer * 1.02);
  const energyProduction = Math.floor(20 * buildings.solarPlant) - Math.floor(10 * (buildings.metalMine + buildings.crystalMine + buildings.deuteriumSynthesizer));

  const totalFleetPower = Object.values(units).reduce((sum, count) => sum + (count * 100), 0);
  const totalResearchLevels = Object.values(research).reduce((sum, level) => sum + level, 0);
  const unreadMessages = messages.filter((m: any) => !m.read && m.to === "Commander").length;

  const buildQueue = queue.filter(q => q.type === "building");
  const researchQueue = queue.filter(q => q.type === "research");
  const unitQueue = queue.filter(q => q.type === "unit");
  const totalUnits = Object.values(units).reduce((sum, count) => sum + count, 0);

  const missionBreakdown = {
    outbound: activeMissions.filter((mission) => mission.status === "outbound").length,
    return: activeMissions.filter((mission) => mission.status === "return").length,
    combat: activeMissions.filter((mission) => mission.type === "attack").length,
    logistics: activeMissions.filter((mission) => ["transport", "colonize", "deploy"].includes(mission.type)).length,
  };

  const nextQueueCompletion = queue.length
    ? Math.max(0, Math.min(...queue.map((item) => item.endTime)) - Date.now())
    : 0;
  const nextQueueCompletionSeconds = Math.ceil(nextQueueCompletion / 1000);

  const economyReadiness = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        45 +
          buildings.metalMine * 2 +
          buildings.crystalMine * 2 +
          buildings.deuteriumSynthesizer * 2 -
          (energyProduction < 0 ? Math.min(30, Math.abs(Math.floor(energyProduction / 50))) : 0)
      )
    )
  );
  const defenseReadiness = Math.max(0, Math.min(100, Math.round(25 + totalFleetPower / 250 + totalUnits / 20)));
  const researchReadiness = Math.max(0, Math.min(100, Math.round(20 + totalResearchLevels * 3)));
  const logisticsReadiness = Math.max(0, Math.min(100, Math.round(35 + activeMissions.length * 5 + unitQueue.length * 4)));

  const alerts: Array<{ title: string; detail: string; level: "warning" | "danger" | "info" }> = [];
  if (energyProduction < 0) {
    alerts.push({
      title: "Energy Deficit",
      detail: `Production is ${energyProduction.toLocaleString()}/h. Upgrade Solar Plant or pause heavy industry.`,
      level: "danger",
    });
  }
  if (resources.metal < 10000 || resources.crystal < 8000) {
    alerts.push({
      title: "Low Core Reserves",
      detail: "Metal/Crystal reserves are low for sustained upgrades.",
      level: "warning",
    });
  }
  if (activeMissions.length === 0) {
    alerts.push({
      title: "Idle Fleet",
      detail: "No active missions. Consider scouting, transport, or combat deployment.",
      level: "info",
    });
  }
  if (queue.length === 0) {
    alerts.push({
      title: "No Active Queue",
      detail: "Construction/research queue is empty. Queue next growth milestone.",
      level: "info",
    });
  }

  const recommendations = [
    {
      label: energyProduction < 0 ? "Stabilize energy economy" : "Scale mineral production",
      reason: energyProduction < 0 ? "Prevent production penalties from power deficit." : "Increase hourly throughput for faster upgrades.",
      href: "/resources",
    },
    {
      label: queue.length === 0 ? "Queue next build/research" : "Review active queue priorities",
      reason: queue.length === 0 ? "Avoid idle development time." : `Next completion in ~${nextQueueCompletionSeconds}s.`,
      href: queue.length === 0 ? "/facilities" : "/research",
    },
    {
      label: activeMissions.length === 0 ? "Dispatch strategic mission" : "Track mission outcomes",
      reason: activeMissions.length === 0 ? "Keep fleet active for expansion and intel." : `${missionBreakdown.outbound} outbound / ${missionBreakdown.return} returning.`,
      href: "/fleet",
    },
  ];

  const { data: seasonProgress } = useQuery<SeasonPassProgressResponse>({
    queryKey: ["/api/season-pass/progression"],
    queryFn: async () => {
      const response = await fetch("/api/season-pass/progression", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load season progression");
      return response.json();
    },
  });

  const { data: battlePassOverview } = useQuery<BattlePassOverviewResponse>({
    queryKey: ["/api/battle-pass/overview"],
    queryFn: async () => {
      const response = await fetch("/api/battle-pass/overview", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load battle pass overview");
      return response.json();
    },
  });

  const { data: populationSnapshot } = useQuery<PopulationSnapshotResponse>({
    queryKey: ["/api/population/snapshot"],
    queryFn: async () => {
      const response = await fetch("/api/population/snapshot", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load population snapshot");
      return response.json();
    },
  });

  const seasonXpMutation = useMutation({
    mutationFn: async (xp: number) => {
      const response = await apiRequest("POST", "/api/season-pass/xp", { xp });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/season-pass/progression"] });
      queryClient.invalidateQueries({ queryKey: ["/api/season-pass/overview"] });
      toast({ title: "Season XP Added", description: "Season progress updated." });
    },
    onError: (error: any) => {
      toast({ title: "Season XP failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  const battleXpMutation = useMutation({
    mutationFn: async (xp: number) => {
      const response = await apiRequest("POST", "/api/battle-pass/xp", { xp });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/battle-pass/overview"] });
      toast({ title: "Battle XP Added", description: "Battle pass progress updated." });
    },
    onError: (error: any) => {
      toast({ title: "Battle XP failed", description: error?.message || "Unknown error", variant: "destructive" });
    },
  });

  return (
    <GameLayout>
      <div className="relative w-full h-full overflow-hidden">
        <GalaxyViewport />

        {/* Overlay: Command Center Badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg px-4 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center overflow-hidden ring-2 ring-cyan-400/30">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[11px] font-orbitron font-bold text-white tracking-wider">{planetName}</div>
            <div className="text-[9px] text-cyan-400 font-mono">[{coordinates}]</div>
          </div>
          <div className="border-l border-slate-700/50 pl-3 ml-1">
            <div className="text-[9px] text-slate-500 uppercase">Commander</div>
            <div className="text-[11px] font-semibold text-slate-300">{displayUsername}</div>
          </div>
        </div>

        {/* Overlay: Quick Stats Bottom Left */}
        <div className="absolute bottom-14 left-3 z-30 flex gap-2">
          {[
            { label: "Energy", value: resources.energy, icon: Zap, color: "text-amber-400" },
            { label: "Metal", value: resources.metal, icon: Pickaxe, color: "text-blue-400" },
            { label: "Crystal", value: resources.crystal, icon: Gem, color: "text-purple-400" },
            { label: "Food", value: resources.food, icon: Box, color: "text-emerald-400" },
          ].map((res) => (
            <div key={res.label} className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
              <res.icon className={cn("w-3.5 h-3.5", res.color)} />
              <div>
                <div className="text-[8px] text-slate-500 uppercase">{res.label}</div>
                <div className="text-[11px] font-mono font-bold text-white">{res.value.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Overlay: Empire Score Bottom Right */}
        <div className="absolute bottom-14 right-3 z-30 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg px-3 py-2 flex items-center gap-3">
          <div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">Empire Score</div>
            <div className="text-lg font-orbitron font-bold text-white">
              {((totalFleetPower / 10) + (totalResearchLevels * 100) + (Object.values(buildings).reduce((s, v) => s + v, 0) * 50)).toLocaleString()}
            </div>
          </div>
          <div className="border-l border-slate-700/50 pl-3">
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">Fleet Power</div>
            <div className="text-sm font-mono font-bold text-cyan-400">{totalFleetPower.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
