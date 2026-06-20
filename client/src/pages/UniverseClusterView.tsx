import { useState, useMemo } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Globe, Star, Orbit, Compass, Maximize2,
  Search, Grid3x3, Hexagon, Layers, Telescope,
  Sun, Download, Info, CircleDot, Map,
  Shield, AlertTriangle, Zap, Database,
  ChevronRight, ChevronDown, ExternalLink,
  Satellite, Radio, Sparkles, Stars,
  Navigation, Crosshair, Eye, EyeOff
} from "lucide-react";
import {
  GALAXY_CLUSTERS, GALACTIC_REGIONS, ALL_SECTORS,
  buildUniverseHierarchy, getSectorsInGalaxy,
  getSectorByCoordinates, getGalaxyClustersContaining,
  type GalaxyCluster, type GalacticRegion, type SectorData,
  type ViewportConfig, DEFAULT_VIEWPORT_CONFIG,
  ALL_STAR_SYSTEMS, SOL_SYSTEM,
  NEBULAE, BLACK_HOLES, WORMHOLES_DATA,
  getUniverseStatistics
} from "@/lib/universeViewportData";
import { NEARBY_GALAXIES } from "@/lib/solSystemData";
import { ALL_SPACE_STATIONS } from "@/lib/interstellarObjectsData";

// ============================================================================
// DANGER LEVEL STYLING
// ============================================================================

const DANGER_STYLES: Record<string, { color: string; bg: string; border: string; icon: any }> = {
  safe: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: Shield },
  moderate: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Eye },
  hazardous: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle },
  extreme: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: Zap },
};

const GALAXY_TYPE_COLORS: Record<string, string> = {
  spiral: "from-blue-500 to-purple-600",
  elliptical: "from-amber-400 to-orange-600",
  irregular: "from-emerald-400 to-teal-600",
  lenticular: "from-slate-400 to-slate-600",
  ring: "from-cyan-400 to-blue-600",
};

// ============================================================================
// COSMIC SCALE INDICATOR
// ============================================================================

function CosmicScaleIndicator() {
  const scales = [
    { name: "Universe", size: "93 Gly", icon: Globe },
    { name: "Supercluster", size: "500 Mly", icon: Layers },
    { name: "Galaxy Cluster", size: "10 Mly", icon: Hexagon },
    { name: "Galaxy", size: "100 Kly", icon: Stars },
    { name: "Sector", size: "1 Kly", icon: Compass },
    { name: "Star System", size: "100 AU", icon: Sun },
    { name: "Planet", size: "10,000 km", icon: CircleDot },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">
      {scales.map((scale, i) => {
        const Icon = scale.icon;
        return (
          <div key={scale.name} className="flex items-center gap-1">
            <Icon className="w-3 h-3 text-slate-400" />
            <span className="text-[9px] text-slate-500 font-mono">{scale.size}</span>
            {i < scales.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-slate-300" />}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// UNIVERSE STATISTICS PANEL
// ============================================================================

function UniverseStatisticsPanel() {
  const stats = getUniverseStatistics();
  const hierarchy = buildUniverseHierarchy();

  const statCards = [
    { label: "Galaxy Clusters", value: hierarchy.clusterCount, icon: Layers, color: "text-purple-600" },
    { label: "Galaxies", value: hierarchy.galaxyCount, icon: Stars, color: "text-blue-600" },
    { label: "Sectors", value: hierarchy.sectorCount, icon: Compass, color: "text-cyan-600" },
    { label: "Star Systems", value: stats.totalStarSystems, icon: Sun, color: "text-amber-600" },
    { label: "Stars", value: stats.totalStars, icon: Star, color: "text-yellow-600" },
    { label: "Planets", value: stats.totalPlanets, icon: CircleDot, color: "text-emerald-600" },
    { label: "Moons", value: stats.totalMoons, icon: Orbit, color: "text-slate-600" },
    { label: "Habitable", value: stats.totalHabitablePlanets, icon: Sparkles, color: "text-green-600" },
    { label: "Nebulae", value: stats.totalNebulae, icon: Layers, color: "text-pink-600" },
    { label: "Black Holes", value: stats.totalBlackHoles, icon: Radio, color: "text-red-600" },
    { label: "Wormholes", value: stats.totalWormholes, icon: Navigation, color: "text-indigo-600" },
    { label: "Stations", value: stats.totalSpaceStations, icon: Satellite, color: "text-teal-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-lg p-3 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
            </div>
            <div className={`text-xl font-bold font-orbitron ${stat.color}`}>
              {stat.value.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// GALAXY CLUSTER CARD
// ============================================================================

function GalaxyClusterCard({ cluster }: { cluster: GalaxyCluster }) {
  const [expanded, setExpanded] = useState(false);

  const typeColors: Record<string, string> = {
    'rich-cluster': 'bg-purple-100 text-purple-700 border-purple-200',
    'poor-group': 'bg-blue-100 text-blue-700 border-blue-200',
    'supercluster': 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return (
    <Card className="border-slate-200 hover:border-primary/30 transition-all">
      <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-orbitron text-slate-900">{cluster.name}</CardTitle>
              <CardDescription className="text-[10px]">{cluster.description.slice(0, 80)}...</CardDescription>
            </div>
          </div>
          <Badge className={`text-[9px] ${typeColors[cluster.type] || 'bg-slate-100 text-slate-700'}`}>
            {cluster.type.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="text-center p-1.5 rounded bg-slate-50">
            <div className="text-[9px] text-slate-400">Diameter</div>
            <div className="text-[11px] font-bold text-slate-700">{cluster.diameter} Mly</div>
          </div>
          <div className="text-center p-1.5 rounded bg-slate-50">
            <div className="text-[9px] text-slate-400">Galaxies</div>
            <div className="text-[11px] font-bold text-slate-700">{cluster.galaxyCount.toLocaleString()}</div>
          </div>
          <div className="text-center p-1.5 rounded bg-slate-50">
            <div className="text-[9px] text-slate-400">Redshift</div>
            <div className="text-[11px] font-bold text-slate-700">z={cluster.redshift}</div>
          </div>
        </div>
        {expanded && (
          <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-600 leading-relaxed">{cluster.description}</p>
            {cluster.galaxies.length > 0 && (
              <div className="mt-2">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Member Galaxies</div>
                <div className="flex flex-wrap gap-1">
                  {cluster.galaxies.map(gId => {
                    const galaxy = NEARBY_GALAXIES.find(g => g.id === gId);
                    return galaxy ? (
                      <Badge key={gId} variant="outline" className="text-[9px] border-slate-300">
                        {galaxy.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// GALAXY CARD
// ============================================================================

function GalaxyCard({ galaxy }: { galaxy: typeof NEARBY_GALAXIES[0] }) {
  const [expanded, setExpanded] = useState(false);
  const sectors = ALL_SECTORS.filter(s => s.galaxyId === parseInt(galaxy.id.replace(/\D/g, '')) || galaxy.id === 'milky-way');
  const clusters = getGalaxyClustersContaining(galaxy.id);

  return (
    <Card className="border-slate-200 hover:border-primary/30 transition-all overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${GALAXY_TYPE_COLORS[galaxy.type] || 'from-slate-400 to-slate-600'}`} />
      <CardHeader className="p-4 pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${GALAXY_TYPE_COLORS[galaxy.type] || 'from-slate-400 to-slate-600'} flex items-center justify-center`}>
              <Stars className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-orbitron text-slate-900">{galaxy.name}</CardTitle>
              <CardDescription className="text-[10px] capitalize">{galaxy.type} · {galaxy.size}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-[9px] border-slate-300">
            {galaxy.starCount.toLocaleString()} stars
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="text-center p-1.5 rounded bg-slate-50">
            <div className="text-[9px] text-slate-400">Diameter</div>
            <div className="text-[11px] font-bold text-slate-700">{galaxy.diameter.toLocaleString()} ly</div>
          </div>
          <div className="text-center p-1.5 rounded bg-slate-50">
            <div className="text-[9px] text-slate-400">Sectors</div>
            <div className="text-[11px] font-bold text-slate-700">{sectors.length}</div>
          </div>
          <div className="text-center p-1.5 rounded bg-slate-50">
            <div className="text-[9px] text-slate-400">Clusters</div>
            <div className="text-[11px] font-bold text-slate-700">{clusters.length}</div>
          </div>
        </div>
        {expanded && (
          <div className="mt-2 space-y-2">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Galactic Regions</div>
              <div className="space-y-1">
                {GALACTIC_REGIONS.filter(r => r.galaxyId === galaxy.id).map(region => (
                  <div key={region.id} className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-600">{region.name}</span>
                    <span className="text-slate-400">{region.diameter.toLocaleString()} ly</span>
                  </div>
                ))}
              </div>
            </div>
            {clusters.length > 0 && (
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Member of</div>
                <div className="flex flex-wrap gap-1">
                  {clusters.map(c => (
                    <Badge key={c.id} variant="secondary" className="text-[9px]">{c.name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTOR MAP VIEW
// ============================================================================

function SectorMapView({ galaxyId }: { galaxyId: number }) {
  const sectors = getSectorsInGalaxy(galaxyId);
  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null);
  const [filterDanger, setFilterDanger] = useState<string | null>(null);

  const filteredSectors = filterDanger
    ? sectors.filter(s => s.dangerLevel === filterDanger)
    : sectors;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase text-slate-500">Filter:</span>
        {['all', 'safe', 'moderate', 'hazardous', 'extreme'].map(d => (
          <Button
            key={d}
            variant={filterDanger === d || (d === 'all' && !filterDanger) ? "default" : "outline"}
            size="sm"
            className="text-[10px] h-7 px-2"
            onClick={() => setFilterDanger(d === 'all' ? null : d)}
          >
            {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
          </Button>
        ))}
        <span className="text-[10px] text-slate-400 ml-auto">{filteredSectors.length} sectors</span>
      </div>

      {/* Sector grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {filteredSectors.map(sector => {
          const dangerStyle = DANGER_STYLES[sector.dangerLevel] || DANGER_STYLES.moderate;
          const DangerIcon = dangerStyle.icon;
          const isSelected = selectedSector?.id === sector.id;

          return (
            <div
              key={sector.id}
              onClick={() => setSelectedSector(isSelected ? null : sector)}
              className={`
                p-2 rounded-lg border cursor-pointer transition-all
                ${isSelected ? 'ring-2 ring-primary border-primary' : dangerStyle.border}
                ${dangerStyle.bg} hover:shadow-md
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-slate-500">S{sector.sectorNumber}</span>
                <DangerIcon className={`w-3 h-3 ${dangerStyle.color}`} />
              </div>
              <div className="text-[10px] font-semibold text-slate-700 truncate">{sector.name}</div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-2.5 h-2.5 text-amber-500" />
                <span className="text-[8px] text-slate-400">{sector.starSystems.length} sys</span>
                {sector.stations.length > 0 && (
                  <>
                    <Satellite className="w-2.5 h-2.5 text-teal-500 ml-1" />
                    <span className="text-[8px] text-slate-400">{sector.stations.length}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[8px] text-slate-400">M:{sector.resources.metal} C:{sector.resources.crystal} D:{sector.resources.deuterium}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected sector detail */}
      {selectedSector && (
        <Card className="border-primary/30">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-orbitron">{selectedSector.name}</CardTitle>
              <Badge className={DANGER_STYLES[selectedSector.dangerLevel]?.bg + ' ' + DANGER_STYLES[selectedSector.dangerLevel]?.color}>
                {selectedSector.dangerLevel.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-[11px] text-slate-600 mb-3">{selectedSector.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-[9px] text-slate-400">Star Systems</div>
                <div className="text-sm font-bold text-slate-700">{selectedSector.starSystems.length}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-[9px] text-slate-400">Nebulae</div>
                <div className="text-sm font-bold text-slate-700">{selectedSector.nebulae.length}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-[9px] text-slate-400">Stations</div>
                <div className="text-sm font-bold text-slate-700">{selectedSector.stations.length}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-[9px] text-slate-400">Wormholes</div>
                <div className="text-sm font-bold text-slate-700">{selectedSector.wormholes.length}</div>
              </div>
            </div>
            <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Resources</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] text-slate-600">Metal: {selectedSector.resources.metal}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-[10px] text-slate-600">Crystal: {selectedSector.resources.crystal}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] text-slate-600">Deuterium: {selectedSector.resources.deuterium}</span>
                </div>
              </div>
            </div>
            {selectedSector.starSystems.length > 0 && (
              <div className="mt-3">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Star Systems</div>
                <div className="flex flex-wrap gap-1">
                  {selectedSector.starSystems.map(sysId => {
                    const sys = ALL_STAR_SYSTEMS.find(s => s.id === sysId) || SOL_SYSTEM;
                    return (
                      <Badge key={sysId} variant="outline" className="text-[9px] border-slate-300">
                        {sys.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// INTERSTELLAR OBJECTS BROWSER
// ============================================================================

function InterstellarObjectsBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allObjects = useMemo(() => {
    const objects: { id: string; name: string; category: string; coordinates: string; danger?: string }[] = [];

    NEBULAE.forEach(n => objects.push({ id: n.id, name: n.name, category: 'Nebula', coordinates: n.coordinates, danger: n.dangerLevel }));
    BLACK_HOLES.forEach(b => objects.push({ id: b.id, name: b.name, category: 'Black Hole', coordinates: b.coordinates, danger: b.danger }));
    WORMHOLES_DATA.forEach(w => objects.push({ id: w.id, name: w.name, category: 'Wormhole', coordinates: w.startCoordinates, danger: w.dangerLevel }));
    ALL_SPACE_STATIONS.forEach(s => objects.push({ id: s.id, name: s.name, category: 'Station', coordinates: s.coordinates }));

    return objects;
  }, []);

  const filtered = useMemo(() => {
    let result = allObjects;
    if (selectedCategory) result = result.filter(o => o.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
    }
    return result;
  }, [allObjects, selectedCategory, searchQuery]);

  const categories = [...new Set(allObjects.map(o => o.category))];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search objects..."
            className="pl-9 text-sm h-8"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            className="text-[10px] h-7"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              className="text-[10px] h-7"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}s
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map(obj => (
          <div key={obj.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors bg-white">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                obj.category === 'Nebula' ? 'bg-pink-500' :
                obj.category === 'Black Hole' ? 'bg-red-800' :
                obj.category === 'Wormhole' ? 'bg-indigo-500' :
                'bg-teal-500'
              }`} />
              <div>
                <div className="text-[11px] font-semibold text-slate-700">{obj.name}</div>
                <div className="text-[9px] text-slate-400">{obj.coordinates}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[8px] border-slate-300">{obj.category}</Badge>
              {obj.danger && (
                <Badge className={`text-[8px] ${
                  obj.danger === 'extreme' || obj.danger === 'critical' ? 'bg-red-100 text-red-700' :
                  obj.danger === 'high' || obj.danger === 'hazardous' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {obj.danger}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function UniverseClusterView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGalaxy, setSelectedGalaxy] = useState<number>(1);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<ViewportConfig>(DEFAULT_VIEWPORT_CONFIG);
  const { toast } = useToast();

  const hierarchy = useMemo(() => buildUniverseHierarchy(), []);

  return (
    <GameLayout>
      <div className="h-full flex flex-col bg-white">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            <h1 className="font-orbitron text-sm font-bold text-slate-900 tracking-wider uppercase">
              Universe Cluster View
            </h1>
          </div>

          <div className="flex-1" />

          <CosmicScaleIndicator />

          <Button
            variant="ghost"
            size="sm"
            className="text-[10px]"
            onClick={() => setShowConfig(!showConfig)}
          >
            {showConfig ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            {showConfig ? "Hide Config" : "View Config"}
          </Button>
        </div>

        {/* Config panel */}
        {showConfig && (
          <div className="px-6 py-2 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-4 flex-wrap">
              {Object.entries(config).map(([key, value]) => (
                <label key={key} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={typeof value === 'boolean' ? value : true}
                    onChange={() => setConfig(prev => ({ ...prev, [key]: !(prev as any)[key] }))}
                    className="w-3 h-3"
                    disabled={typeof value !== 'boolean'}
                  />
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 border-b border-slate-200">
            <TabsList className="bg-transparent border-b-0">
              <TabsTrigger value="overview" className="text-[11px] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                Universe Overview
              </TabsTrigger>
              <TabsTrigger value="clusters" className="text-[11px] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                Galaxy Clusters
              </TabsTrigger>
              <TabsTrigger value="galaxies" className="text-[11px] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Stars className="w-3.5 h-3.5 mr-1.5" />
                Galaxies
              </TabsTrigger>
              <TabsTrigger value="sectors" className="text-[11px] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Compass className="w-3.5 h-3.5 mr-1.5" />
                Sectors
              </TabsTrigger>
              <TabsTrigger value="objects" className="text-[11px] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Radio className="w-3.5 h-3.5 mr-1.5" />
                Interstellar Objects
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div>
                <h2 className="font-orbitron text-lg font-bold text-slate-900 mb-1">{hierarchy.name}</h2>
                <p className="text-sm text-slate-500 mb-4">{hierarchy.scale}</p>
                <UniverseStatisticsPanel />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-orbitron">Cosmic Hierarchy</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-2">
                      {[
                        { level: "Universe", count: "1", desc: "All of existence", icon: Globe },
                        { level: "Superclusters", count: hierarchy.clusterCount.toString(), desc: "Largest gravitationally bound structures", icon: Layers },
                        { level: "Galaxy Clusters", count: "~100+", desc: "Groups of galaxies bound by gravity", icon: Hexagon },
                        { level: "Galaxies", count: hierarchy.galaxyCount.toString(), desc: "Massive star systems", icon: Stars },
                        { level: "Sectors", count: hierarchy.sectorCount.toString(), desc: "Sub-regions within galaxies", icon: Compass },
                        { level: "Star Systems", count: hierarchy.systemCount.toString(), desc: "Individual stellar systems", icon: Sun },
                        { level: "Celestial Bodies", count: hierarchy.bodyCount.toString(), desc: "Planets, moons, asteroids", icon: CircleDot },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.level} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
                            <Icon className="w-4 h-4 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-semibold text-slate-700">{item.level}</div>
                              <div className="text-[9px] text-slate-400">{item.desc}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[11px] font-bold text-slate-900">{item.count}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-orbitron">Galactic Regions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-2">
                      {GALACTIC_REGIONS.map(region => (
                        <div key={region.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                region.type === 'core' ? 'bg-amber-500' :
                                region.type === 'spiral-arm' ? 'bg-blue-500' :
                                region.type === 'halo' ? 'bg-slate-400' :
                                'bg-purple-500'
                              }`} />
                              <span className="text-[11px] font-semibold text-slate-700">{region.name}</span>
                            </div>
                            <Badge variant="outline" className="text-[8px] border-slate-300">{region.type.replace('-', ' ')}</Badge>
                          </div>
                          <p className="text-[9px] text-slate-500 mt-1">{region.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-400">
                            <span>Density: {region.starDensity} stars/ly³</span>
                            <span>·</span>
                            <span>{region.diameter.toLocaleString()} ly</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CLUSTERS TAB */}
            <TabsContent value="clusters" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-lg font-bold text-slate-900">Galaxy Clusters & Superclusters</h2>
                <Badge variant="secondary">{hierarchy.clusterCount} clusters</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {GALAXY_CLUSTERS.map(cluster => (
                  <GalaxyClusterCard key={cluster.id} cluster={cluster} />
                ))}
              </div>
            </TabsContent>

            {/* GALAXIES TAB */}
            <TabsContent value="galaxies" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-lg font-bold text-slate-900">Galaxies</h2>
                <Badge variant="secondary">{NEARBY_GALAXIES.length} galaxies</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {NEARBY_GALAXIES.map(galaxy => (
                  <GalaxyCard key={galaxy.id} galaxy={galaxy} />
                ))}
              </div>
            </TabsContent>

            {/* SECTORS TAB */}
            <TabsContent value="sectors" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-lg font-bold text-slate-900">Sector Map</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Galaxy:</span>
                  <select
                    value={selectedGalaxy}
                    onChange={e => setSelectedGalaxy(parseInt(e.target.value))}
                    className="text-[11px] border border-slate-200 rounded px-2 py-1 bg-white"
                  >
                    {[1, 2, 3, 4, 5].map(g => (
                      <option key={g} value={g}>Galaxy {g}</option>
                    ))}
                  </select>
                  <Badge variant="secondary">{getSectorsInGalaxy(selectedGalaxy).length} sectors</Badge>
                </div>
              </div>
              <SectorMapView galaxyId={selectedGalaxy} />
            </TabsContent>

            {/* OBJECTS TAB */}
            <TabsContent value="objects" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-orbitron text-lg font-bold text-slate-900">Interstellar Objects</h2>
                <Badge variant="secondary">
                  {NEBULAE.length + BLACK_HOLES.length + WORMHOLES_DATA.length + ALL_SPACE_STATIONS.length} objects
                </Badge>
              </div>
              <InterstellarObjectsBrowser />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </GameLayout>
  );
}