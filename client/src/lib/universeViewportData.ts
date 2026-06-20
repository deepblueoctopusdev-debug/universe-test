/**
 * Universe Viewport Data - Galaxy/Universe scale visualization data
 * Maps the cosmic hierarchy: Universe → Galaxy Clusters → Galaxies → Sectors → Systems → Planets
 * @tag #viewport #universe #galaxy #cosmic #hierarchy
 */

import { NEARBY_GALAXIES, SOL_SYSTEM, type Galaxy, type StarSystem, type CelestialBody } from './solSystemData';
import { ALL_STAR_SYSTEMS } from './starSystemsData';
import { NEBULAE, BLACK_HOLES, WORMHOLES_DATA, COMETS, ALL_ASTEROID_CLUSTERS, SPACE_ANOMALIES, ALL_SPACE_STATIONS } from './interstellarObjectsData';
import { UNIVERSE_CATALOG, getUniverseStatistics } from './universeCatalog';

// ============================================================================
// COSMIC HIERARCHY TYPES
// ============================================================================

export interface GalaxyCluster {
  id: string;
  name: string;
  type: 'rich-cluster' | 'poor-group' | 'supercluster';
  galaxies: string[]; // Galaxy IDs
  diameter: number; // Million light-years
  galaxyCount: number;
  redshift: number;
  description: string;
  coordinates: { x: number; y: number; z: number };
}

export interface GalacticRegion {
  id: string;
  name: string;
  type: 'spiral-arm' | 'core' | 'halo' | 'void' | 'filament';
  galaxyId: string;
  starDensity: number; // Stars per cubic light-year
  diameter: number; // Light-years
  description: string;
}

export interface SectorData {
  id: string;
  name: string;
  galaxyId: number;
  sectorX: number;
  sectorY: number;
  sectorNumber: number;
  starSystems: string[]; // Star system IDs
  nebulae: string[];
  stations: string[];
  blackHoles: string[];
  wormholes: string[];
  dangerLevel: 'safe' | 'moderate' | 'hazardous' | 'extreme';
  resources: { metal: number; crystal: number; deuterium: number };
  explored: boolean;
  controlledBy?: string;
  description: string;
}

export interface UniverseViewport {
  name: string;
  scale: string;
  galaxyClusters: GalaxyCluster[];
  galaxies: Galaxy[];
  sectors: SectorData[];
  galaxiesByCluster: Map<string, Galaxy[]>;
  sectorsByGalaxy: Map<number, SectorData[]>;
  totalStars: number;
  totalSystems: number;
  totalSectors: number;
}

// ============================================================================
// GALAXY CLUSTERS DATA
// ============================================================================

export const GALAXY_CLUSTERS: GalaxyCluster[] = [
  {
    id: 'local-group',
    name: 'Local Group',
    type: 'poor-group',
    galaxies: ['milky-way', 'andromeda', 'triangulum', 'lmc', 'smc', 'sagittarius-dwarf', 'ursa-minor-dwarf', 'sculptor-dwarf'],
    diameter: 10,
    galaxyCount: 8,
    redshift: 0.001,
    description: 'The Local Group contains the Milky Way, Andromeda, Triangulum and ~54 other known galaxies, spanning 10 million light-years.',
    coordinates: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'virgo-cluster',
    name: 'Virgo Cluster',
    type: 'rich-cluster',
    galaxies: [],
    diameter: 15,
    galaxyCount: 1300,
    redshift: 0.004,
    description: 'The nearest rich galaxy cluster, containing approximately 1,300 galaxies. The Local Group is being drawn toward it.',
    coordinates: { x: 54, y: 0, z: 18 },
  },
  {
    id: 'coma-cluster',
    name: 'Coma Cluster',
    type: 'rich-cluster',
    galaxies: [],
    diameter: 20,
    galaxyCount: 10000,
    redshift: 0.023,
    description: 'One of the richest known galaxy clusters, containing over 10,000 galaxies. Most are elliptical galaxies.',
    coordinates: { x: 321, y: 0, z: 0 },
  },
  {
    id: 'laniakea',
    name: 'Laniakea Supercluster',
    type: 'supercluster',
    galaxies: [],
    diameter: 520,
    galaxyCount: 100000,
    redshift: 0.05,
    description: 'The supercluster containing the Local Group, Virgo Cluster, and 100,000 other galaxies. Our galactic home.',
    coordinates: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'perseus-pisces',
    name: 'Perseus-Pisces Supercluster',
    type: 'supercluster',
    galaxies: [],
    diameter: 400,
    galaxyCount: 50000,
    redshift: 0.08,
    description: 'One of the largest known structures in the universe, a filament of galaxy clusters stretching 400 million light-years.',
    coordinates: { x: 250, y: 100, z: -50 },
  },
  {
    id: 'hercules-corona',
    name: 'Hercules-Corona Borealis Great Wall',
    type: 'supercluster',
    galaxies: [],
    diameter: 10000,
    galaxyCount: 10000000,
    redshift: 1.5,
    description: 'The largest known structure in the observable universe, a wall of galaxies 10 billion light-years long.',
    coordinates: { x: 5000, y: 2000, z: 3000 },
  },
];

// ============================================================================
// GALACTIC REGIONS DATA
// ============================================================================

export const GALACTIC_REGIONS: GalacticRegion[] = [
  {
    id: 'milky-core',
    name: 'Galactic Core',
    type: 'core',
    galaxyId: 'milky-way',
    starDensity: 100,
    diameter: 20000,
    description: 'The dense central region of the Milky Way, containing the supermassive black hole Sagittarius A*. Extremely high star density.',
  },
  {
    id: 'milky-sagittarius-arm',
    name: 'Sagittarius Arm',
    type: 'spiral-arm',
    galaxyId: 'milky-way',
    starDensity: 5,
    diameter: 40000,
    description: 'Major spiral arm of the Milky Way, located between the Scutum-Centaurus and Perseus arms.',
  },
  {
    id: 'milky-orion-arm',
    name: 'Orion-Cygnus Arm',
    type: 'spiral-arm',
    galaxyId: 'milky-way',
    starDensity: 3,
    diameter: 30000,
    description: 'The minor spiral arm containing the Solar System. Also known as the Local Arm or Orion Spur.',
  },
  {
    id: 'milky-perseus-arm',
    name: 'Perseus Arm',
    type: 'spiral-arm',
    galaxyId: 'milky-way',
    starDensity: 6,
    diameter: 50000,
    description: 'One of the major spiral arms of the Milky Way, located outside the Orion-Cygnus arm.',
  },
  {
    id: 'milky-halo',
    name: 'Galactic Halo',
    type: 'halo',
    galaxyId: 'milky-way',
    starDensity: 0.1,
    diameter: 100000,
    description: 'The diffuse spherical halo containing the oldest stars and globular clusters surrounding the Milky Way.',
  },
  {
    id: 'andromeda-core',
    name: 'Andromeda Core',
    type: 'core',
    galaxyId: 'andromeda',
    starDensity: 120,
    diameter: 15000,
    description: 'The bright, dense core of the Andromeda Galaxy, containing a supermassive black hole and densely packed old stars.',
  },
  {
    id: 'andromeda-spiral',
    name: 'Andromeda Spiral Arms',
    type: 'spiral-arm',
    galaxyId: 'andromeda',
    starDensity: 8,
    diameter: 100000,
    description: 'The prominent spiral arms of Andromeda, which contain vast star-forming regions and young stellar populations.',
  },
];

// ============================================================================
// SECTORS DATA (Derived from star systems positions)
// ============================================================================

function buildSectors(): SectorData[] {
  const sectors: SectorData[] = [];
  const sectorsMap = new Map<string, SectorData>();

  // Process all star systems to derive sectors
  const allSystems = [SOL_SYSTEM, ...ALL_STAR_SYSTEMS];
  allSystems.forEach(sys => {
    const galaxy = sys.coordinates.galaxy || 1;
    const sector = sys.coordinates.sector || 1;
    const key = `${galaxy}-${sector}`;

    if (!sectorsMap.has(key)) {
      const sectorNum = Math.floor(sector / 10) + 1;
      sectorsMap.set(key, {
        id: `sector-g${galaxy}-s${sector}`,
        name: `Sector ${galaxy}-${sector}`,
        galaxyId: galaxy,
        sectorX: Math.floor(sector / 20),
        sectorY: sector % 20,
        sectorNumber: sector,
        starSystems: [],
        nebulae: [],
        stations: [],
        blackHoles: [],
        wormholes: [],
        dangerLevel: 'moderate',
        resources: { metal: 50, crystal: 50, deuterium: 50 },
        explored: false,
        description: `Sector ${galaxy}-${sector} in Galaxy ${galaxy}. Contains various celestial objects and resources.`,
      });
    }

    const sectorData = sectorsMap.get(key)!;
    sectorData.starSystems.push(sys.id);
  });

  // Add nebulae to sectors
  NEBULAE.forEach(neb => {
    const parts = neb.coordinates.split(':');
    const galaxy = parseInt(parts[0]) || 1;
    const sector = parseInt(parts[1]) || 1;
    const key = `${galaxy}-${sector}`;
    if (sectorsMap.has(key)) {
      sectorsMap.get(key)!.nebulae.push(neb.id);
    }
  });

  // Add stations to sectors
  ALL_SPACE_STATIONS.forEach(station => {
    const parts = station.coordinates.split(':');
    const galaxy = parseInt(parts[0]) || 1;
    const sector = parseInt(parts[1]) || 1;
    const key = `${galaxy}-${sector}`;
    if (sectorsMap.has(key)) {
      sectorsMap.get(key)!.stations.push(station.id);
    }
  });

  // Add black holes to sectors
  BLACK_HOLES.forEach(bh => {
    const parts = bh.coordinates.split(':');
    const galaxy = parseInt(parts[0]) || 1;
    const sector = parseInt(parts[1]) || 1;
    const key = `${galaxy}-${sector}`;
    if (sectorsMap.has(key)) {
      sectorsMap.get(key)!.blackHoles.push(bh.id);
    }
  });

  // Add wormholes to sectors
  WORMHOLES_DATA.forEach(wh => {
    const parts = wh.startCoordinates.split(':');
    const galaxy = parseInt(parts[0]) || 1;
    const sector = parseInt(parts[1]) || 1;
    const key = `${galaxy}-${sector}`;
    if (sectorsMap.has(key)) {
      sectorsMap.get(key)!.wormholes.push(wh.id);
    }
  });

  // Calculate danger levels based on objects present
  sectorsMap.forEach(sector => {
    let dangerScore = 0;
    if (sector.blackHoles.length > 0) dangerScore += 30;
    if (sector.wormholes.length > 0) dangerScore += 20;
    if (sector.nebulae.length > 0) dangerScore += 10;
    if (sector.stations.length === 0) dangerScore += 5;

    if (dangerScore >= 50) sector.dangerLevel = 'extreme';
    else if (dangerScore >= 30) sector.dangerLevel = 'hazardous';
    else if (dangerScore >= 15) sector.dangerLevel = 'moderate';
    else sector.dangerLevel = 'safe';

    // Calculate resources
    sector.resources = {
      metal: Math.min(100, 30 + sector.starSystems.length * 10 + sector.blackHoles.length * 5),
      crystal: Math.min(100, 30 + sector.nebulae.length * 15 + sector.wormholes.length * 5),
      deuterium: Math.min(100, 30 + sector.stations.length * 10 + sector.nebulae.length * 10),
    };
  });

  sectorsMap.forEach(sector => sectors.push(sector));
  return sectors.sort((a, b) => a.galaxyId - b.galaxyId || a.sectorNumber - b.sectorNumber);
}

export const ALL_SECTORS: SectorData[] = buildSectors();

// ============================================================================
// COSMIC HIERARCHY BUILDER
// ============================================================================

export function buildUniverseHierarchy() {
  const statistics = getUniverseStatistics();
  
  return {
    name: 'Observable Universe',
    scale: '13.8 billion years old, 93 billion light-years diameter',
    statistics,
    clusterCount: GALAXY_CLUSTERS.length,
    galaxyCount: NEARBY_GALAXIES.length,
    sectorCount: ALL_SECTORS.length,
    systemCount: statistics.totalStarSystems,
    bodyCount: statistics.totalBodies,
    galaxyClusters: GALAXY_CLUSTERS,
    galaxies: NEARBY_GALAXIES,
    sectors: ALL_SECTORS,
    regions: GALACTIC_REGIONS,
  };
}

// ============================================================================
// NAVIGATION & QUERY FUNCTIONS
// ============================================================================

export function getSectorsInGalaxy(galaxyId: number): SectorData[] {
  return ALL_SECTORS.filter(s => s.galaxyId === galaxyId);
}

export function getSectorByCoordinates(galaxy: number, sector: number): SectorData | undefined {
  return ALL_SECTORS.find(s => s.galaxyId === galaxy && s.sectorNumber === sector);
}

export function getGalaxyClustersContaining(galaxyId: string): GalaxyCluster[] {
  return GALAXY_CLUSTERS.filter(cluster => cluster.galaxies.includes(galaxyId));
}

export function getSystemsInSector(galaxy: number, sector: number): string[] {
  const sectorData = getSectorByCoordinates(galaxy, sector);
  return sectorData?.starSystems || [];
}

export function getSectorDangerLevel(galaxy: number, sector: number): string {
  const sectorData = getSectorByCoordinates(galaxy, sector);
  return sectorData?.dangerLevel || 'unknown';
}

export function getSectorResourceValue(galaxy: number, sector: number): number {
  const sectorData = getSectorByCoordinates(galaxy, sector);
  if (!sectorData) return 0;
  return sectorData.resources.metal + sectorData.resources.crystal + sectorData.resources.deuterium;
}

// ============================================================================
// VIEWPORT CONFIGURATION
// ============================================================================

export interface ViewportConfig {
  galaxyScale: number;
  sectorScale: number;
  systemScale: number;
  showNebulae: boolean;
  showBlackHoles: boolean;
  showWormholes: boolean;
  showStations: boolean;
  showLabels: boolean;
  colorByFaction: boolean;
  colorByResource: boolean;
  colorByDanger: boolean;
}

export const DEFAULT_VIEWPORT_CONFIG: ViewportConfig = {
  galaxyScale: 1.0,
  sectorScale: 1.0,
  systemScale: 1.0,
  showNebulae: true,
  showBlackHoles: true,
  showWormholes: true,
  showStations: true,
  showLabels: true,
  colorByFaction: false,
  colorByResource: false,
  colorByDanger: false,
};

// ============================================================================
// EXPORT ALL ENHANCED DATA
// ============================================================================

export {
  // Re-export everything from the catalog
  UNIVERSE_CATALOG, getUniverseStatistics,
  getObjectsByCategory, searchUniverse, getUniverseObjectById,
  getObjectsInGalaxy, getObjectsInSector,
  // Navigation waypoints
  getNavigationWaypoints,
  // Star systems
  ALL_STAR_SYSTEMS, SOL_SYSTEM, getStarSystemById, getStarSystemByCoords, getAllBodies, getBodiesByType,
  // Interstellar objects (ALL_ prefixed versions from universeCatalog)
  ALL_NEBULAE, ALL_BLACK_HOLES, ALL_WORMHOLES, ALL_COMETS, ALL_ASTEROID_CLUSTERS, ALL_SPACE_ANOMALIES, ALL_SPACE_STATIONS,
} from './universeCatalog';

// Re-export original names from interstellarObjectsData for direct use
export { NEBULAE, BLACK_HOLES, WORMHOLES_DATA, COMETS } from './interstellarObjectsData';
