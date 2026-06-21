import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Globe, Users, Swords, FlaskConical, Building, ArrowLeft, Github, Heart, Star, Code, Palette, Music, Gamepad2, Database, Shield, Zap, Crown } from "lucide-react";
import { Link } from "wouter";

const DEV_CREDITS = {
  leadDeveloper: { name: "Stephen", aliases: ["ArkansasIo", "Apocalypsecoder0"], role: "Lead Developer & Game Designer" },
  studio: "Stellar Dominion Studios",
  version: "1.5.0",
  buildDate: "2026-06-20",
  engine: "Custom TypeScript Game Engine",
  stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Express", "Vite", "Drizzle ORM"],
  specialThanks: [
    { name: "Community", role: "Beta testers and feedback providers" },
    { name: "Open Source", role: "Built on the shoulders of giants" },
  ],
};

const TEAM_ROLES = [
  { role: "Lead Developer", name: "Stephen", icon: Code, description: "Core engine, game systems, and architecture" },
  { role: "Game Designer", name: "Stephen", icon: Gamepad2, description: "Gameplay mechanics, balance, and progression" },
  { role: "Server Engineer", name: "Stephen", icon: Database, description: "Backend APIs, database design, and infrastructure" },
  { role: "Frontend Developer", name: "Stephen", icon: Palette, description: "UI/UX, React components, and visual design" },
  { role: "Systems Architect", name: "Stephen", icon: Shield, description: "Combat engine, research, and economy systems" },
];

const SYSTEMS_CREATED = [
  { name: "5-Layer Architecture", desc: "Presentation → Client Logic → API → Server → Data" },
  { name: "Combat Battle Engine", desc: "Turn-based combat with element advantages, formations, and tactics" },
  { name: "Commander System", desc: "12 equipment slots, gear levels, talent trees, and gacha recruitment" },
  { name: "Army System", desc: "6 unit categories, formation badges, and unit leveling" },
  { name: "Raid & Boss System", desc: "30 guild raids, 30 arc bosses, 30 universe gates" },
  { name: "Research Tech Tree", desc: "900+ technologies across 11 branches" },
  { name: "Government & Alliances", desc: "23 leader types, faction warfare, and diplomacy" },
  { name: "Economy & Market", desc: "Real-time resource production, trading, and auctions" },
  { name: "Universe Generation", desc: "Procedural star systems, galaxies, and celestial bodies" },
  { name: "Progression System", desc: "1-99 tier scaling, prestige levels, and empire ranking" },
  { name: "Ship Fitting System", desc: "90+ modules across 6 categories with CPU/powergrid" },
  { name: "Power Grid System", desc: "Interplanetary energy networks and transmission" },
  { name: "Orbital Defense", desc: "Platform classes, modules, doctrines, and combat" },
  { name: "Season & Battle Pass", desc: "Progression tracks and cosmetic rewards" },
  { name: "Durability System", desc: "Equipment, fleet, and building degradation/repair" },
  { name: "Story Campaign", desc: "Multi-chapter narrative with missions and NPCs" },
  { name: "Galaxy Maps", desc: "3D universe visualization and exploration" },
  { name: "Guild Raids", desc: "Cooperative boss battles with loot tables" },
  { name: "Arc Bosses", desc: "3-chapter story bosses with escalating difficulty" },
  { name: "Universe Gates", desc: "Portal system connecting to raid encounters" },
];

const TECH_STATS = {
  totalFiles: "1500+",
  databaseTables: "72",
  apiRoutes: "60+",
  pageComponents: "93",
  configFiles: "95+",
  linesOfCode: "200K+",
  gearItems: "180+",
  unitTypes: "18",
  raidBosses: "60",
  universeGates: "30",
  researchTechs: "900+",
  commanderClasses: "6",
  commanderRaces: "8",
};

export default function About() {
  const gameplayLoops = [
    "Expand economy with mining, logistics, and production balancing.",
    "Convert production into military and exploration capability.",
    "Compete or cooperate through alliance diplomacy and conflict.",
    "Cycle progression through research, policy, and strategic adaptation.",
  ];

  const roadmap = [
    { phase: "Phase I", focus: "Core economy, research, and fleet systems" },
    { phase: "Phase II", focus: "Expanded alliance wars and dynamic events" },
    { phase: "Phase III", focus: "Seasonal progression, relic progression, and narrative arcs" },
    { phase: "Phase IV", focus: "Endgame sovereignty and inter-universe competition" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-400 hover:text-white" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Game
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white" style={{ width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.4 + 0.1 }} />
            ))}
          </div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-orbitron font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              STELLAR DOMINION
            </h1>
            <p className="text-xl text-slate-400 font-rajdhani max-w-2xl mx-auto mb-2">
              A 4X Space Strategy MMORPG
            </p>
            <p className="text-sm text-slate-500">
              Version {DEV_CREDITS.version} | Build {DEV_CREDITS.buildDate} | Engine: {DEV_CREDITS.engine}
            </p>
          </div>
        </div>

        {/* Developer Credits */}
        <Card className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-blue-800/30 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white text-xl">
              <Crown className="w-6 h-6 text-yellow-400" />
              DEVELOPER CREDITS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-700/20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <h2 className="text-2xl font-orbitron font-bold text-white mb-1">{DEV_CREDITS.leadDeveloper.name}</h2>
              <p className="text-blue-300 font-medium mb-2">{DEV_CREDITS.leadDeveloper.role}</p>
              <p className="text-sm text-slate-400 mb-3">
                GitHub: <a href="https://github.com/ArkansasIo" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">ArkansasIo</a> | <a href="https://github.com/Apocalypsecoder0" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">Apocalypsecoder0</a>
              </p>
              <p className="text-xs text-slate-500 italic">"{DEV_CREDITS.studio}"</p>
            </div>

            {/* Team Roles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TEAM_ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <div key={role.role} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold uppercase text-blue-300">{role.role}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{role.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{role.description}</div>
                  </div>
                );
              })}
            </div>

            {/* Tech Stack */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-xs font-bold uppercase text-slate-400 mb-3">Technology Stack</div>
              <div className="flex flex-wrap gap-2">
                {DEV_CREDITS.stack.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-blue-900/30 border border-blue-700/30 rounded-full text-xs font-mono text-blue-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Stats */}
        <Card className="bg-slate-900/50 border-slate-700/30 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Star className="w-5 h-5 text-yellow-400" />
              Project Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(TECH_STATS).map(([key, value]) => (
                <div key={key} className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                  <div className="text-lg font-orbitron font-bold text-white">{value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">{key.replace(/([A-Z])/g, " $1")}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Systems Created */}
        <Card className="bg-slate-900/50 border-slate-700/30 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Zap className="w-5 h-5 text-cyan-400" />
              Systems & Features Created ({SYSTEMS_CREATED.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {SYSTEMS_CREATED.map((system) => (
                <div key={system.name} className="flex items-start gap-2 p-2 bg-white/5 rounded border border-white/10">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">{system.name}</div>
                    <div className="text-[10px] text-slate-400">{system.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <Building className="w-6 h-6 text-blue-500" />
                Build Your Empire
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Construct mines, factories, and research facilities. Expand from a single colony to a sprawling interstellar empire with orbital stations and lunar bases.
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <FlaskConical className="w-6 h-6 text-purple-500" />
                Research Technologies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Unlock powerful technologies across multiple tech trees. From weapons systems to hyperspace drives, research is key to dominance.
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <Swords className="w-6 h-6 text-red-500" />
                Command Fleets
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Build massive fleets of fighters, cruisers, and battleships. Launch attacks, espionage missions, and defend your territory against invaders.
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <Users className="w-6 h-6 text-green-500" />
                Form Alliances
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Join forces with other commanders. Create or join alliances to share resources, coordinate attacks, and dominate the leaderboards.
            </CardContent>
          </Card>
        </div>

        {/* Core Gameplay Loop & Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Core Gameplay Loop</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-600">
              {gameplayLoops.map((item) => (
                <div key={item} className="text-sm">• {item}</div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Development Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-600">
              {roadmap.map((step) => (
                <div key={step.phase} className="rounded border border-slate-200 bg-slate-50 p-3">
                  <div className="font-semibold text-slate-900">{step.phase}</div>
                  <div className="text-sm">{step.focus}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Special Thanks */}
        <Card className="bg-slate-900/50 border-slate-700/30 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Heart className="w-5 h-5 text-red-400" />
              Special Thanks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEV_CREDITS.specialThanks.map((thanks) => (
                <div key={thanks.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Heart className="w-4 h-4 text-red-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">{thanks.name}</div>
                    <div className="text-xs text-slate-400">{thanks.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-orbitron tracking-wider px-8 shadow-lg shadow-blue-500/20" data-testid="button-start-playing">
              <Rocket className="w-5 h-5 mr-2" /> Start Playing
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-sm text-slate-400">
              © 2026 {DEV_CREDITS.studio} | Created by <span className="text-white font-semibold">{DEV_CREDITS.leadDeveloper.name}</span>
            </p>
            <p className="text-xs text-slate-500">
              Built with <Heart className="w-3 h-3 inline text-red-400" /> for space strategy enthusiasts
            </p>
            <p className="text-xs text-slate-600 font-mono">
              v{DEV_CREDITS.version} | {DEV_CREDITS.buildDate} | TypeScript + React + PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
