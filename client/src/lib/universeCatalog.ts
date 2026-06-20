/**
 * Universe Catalog - Unified index of all celestial objects, star systems, and interstellar phenomena
 * Combines data from solSystemData, starSystemsData, and interstellarObjectsData
 * @tag #universe #catalog #index #celestial
 */

import { SOL_SYSTEM, NEARBY_GALAXIES, type StarSystem, type Galaxy, type CelestialBody } from './solSystemData';
import { ALL_STAR_SYSTEMS, getStarSystemById, getStarSystemByCoords, getAllBodies, getBodiesByType, getTotalHabitablePlanets } from './starSystemsData';
import {
  ALL_NEBULAE, ALL_BLACK_HOLES, ALL_WORMHOLES, ALL_COMETS,
  ALL_ASTEROID_CLUSTERS, ALL_SPACE_ANOMALIES, ALL_SPACE_STATIONS,
  type Nebula, type BlackHole, type Wormhole, type Comet,
  type AsteroidCluster, type SpaceAnomaly, type SpaceStation,
  getObjectByCoordinates, getObjectsInCoordinates,
} from './interstellarObjectsData';

// ============================================================================
// COMBINED UNIVERSE CATALOG
// ============================================================================

export interface UniverseObject {
  id: string;
  name: string;
  coordinates: string;
  category: 'star-system' | 'nebula' | 'black-hole' | 'wormhole' | 'comet' | 'asteroid-cluster' | 'space-station' | 'anomaly' | 'galaxy';
  type: string;
  dangerLevel?: string;
  description: string;
  data: any; // Reference to the full object data
}

export interface UniverseStatistics {
  totalStarSystems: number;
  totalStars: number;
  totalPlanets: number;
  totalMoons: number;
  totalAsteroidBelts: number;
  totalComets: number;
  totalNebulae: number;
  totalBlackHoles: number;
  totalWormholes: number;
  totalSpaceStations: number;
  totalAnomalies: number;
  totalGalaxies: number;
  totalHabitablePlanets: number;
  totalBodies: number;
}

// ============================================================================
// BUILD COMBINED CATALOG
// ============================================================================

function buildUniverseCatalog(): UniverseObject[] {
  const catalog: UniverseObject[] = [];

  // Add all star systems
  const allSystems = [SOL_SYSTEM, ...ALL_STAR_SYSTEMS];
  allSystems.forEach(sys => {
    catalog.push({
      id: sys.id,
      name: sys.name,
      coordinates: sys.coordinateString,
      category: 'star-system',
      type: sys.starType,
      description: `${sys.name} - ${sys.starType} system with ${sys.bodies.length} celestial bodies`,
      data: sys,
    });
  });

  // Add all nebulae
  ALL_NEBULAE.forEach(neb => {
    catalog.push({
      id: neb.id,
      name: neb.name,
      coordinates: neb.coordinates,
      category: 'nebula',
      type: neb.type,
      dangerLevel: neb.dangerLevel,
      description: neb.description,
      data: neb,
    });
  });

  // Add all black holes
  ALL_BLACK_HOLES.forEach(bh => {
    catalog.push({
      id: bh.id,
      name: bh.name,
      coordinates: bh.coordinates,
      category: 'black-hole',
      type: bh.type,
      dangerLevel: bh.danger,
      description: bh.description,
      data: bh,
    });
  });

  // Add all wormholes
  ALL_WORMHOLES.forEach(wh => {
    catalog.push({
      id: wh.id,
      name: wh.name,
      coordinates: wh.startCoordinates,
      category: 'wormhole',
      type: wh.type,
      dangerLevel: wh.dangerLevel,
      description: wh.description,
      data: wh,
    });
  });

  // Add all comets
  ALL_COMETS.forEach(comet => {
    catalog.push({
      id: comet.id,
      name: comet.name,
      coordinates: comet.currentCoordinates,
      category: 'comet',
      type: comet.type,
      dangerLevel: comet.hazardLevel,
      description: comet.description,
      data: comet,
    });
  });

  // Add all asteroid clusters
  ALL_ASTEROID_CLUSTERS.forEach(ac => {
    catalog.push({
      id: ac.id,
      name: ac.name,
      coordinates: ac.coordinates,
      category: 'asteroid-cluster',
      type: ac.type,
      dangerLevel: ac.hazardLevel,
      description: ac.description,
      data: ac,
    });
  });

  // Add all space stations
  ALL_SPACE_STATIONS.forEach(station => {
    catalog.push({
      id: station.id,
      name: station.name,
      coordinates: station.coordinates,
      category: 'space-station',
      type: station.type,
      description: station.description,
      data: station,
    });
  });

  // Add all anomalies
  ALL_SPACE_ANOMALIES.forEach(anom => {
    catalog.push({
      id: anom.id,
      name: anom.name,
      coordinates: anom.coordinates,
      category: 'anomaly',
      type: anom.type,
      dangerLevel: anom.danger,
      description: anom.description,
      data: anom,
    });
  });

  // Add galaxies
  NEARBY_GALAXIES.forEach(gal => {
    catalog.push({
      id: gal.id,
      name: gal.name,
      coordinates: `${gal.coordinates.x}:${gal.coordinates.y}:${gal.coordinates.z}`,
      category: 'galaxy',
      type: gal.type,
      description: `${gal.name} - ${gal.type} galaxy, ${gal.size} size, ${gal.starCount.toLocaleString()} stars`,
      data: gal,
    });
  });

  return catalog;
}

export const UNIVERSE_CATALOG: UniverseObject[] = buildUniverseCatalog();

// ============================================================================
// STATISTICS
// ============================================================================

export function getUniverseStatistics(): UniverseStatistics {
  const allSystems = [SOL_SYSTEM, ...ALL_STAR_SYSTEMS];
  const allBodies = allSystems.flatMap(s => s.bodies);
  
  return {
    totalStarSystems: allSystems.length,
    totalStars: allBodies.filter(b => b.type === 'star').length,
    totalPlanets: allBodies.filter(b => b.type === 'planet').length,
    totalMoons: allBodies.filter(b => b.type === 'moon').length,
    totalAsteroidBelts: allBodies.filter(b => b.type === 'asteroid').length,
    totalComets: ALL_COMETS.length,
    totalNebulae: ALL_NEBULAE.length,
    totalBlackHoles: ALL_BLACK_HOLES.length,
    totalWormholes: ALL_WORMHOLES.length,
    totalSpaceStations: ALL_SPACE_STATIONS.length,
    totalAnomalies: ALL_SPACE_ANOMALIES.length,
    totalGalaxies: NEARBY_GALAXIES.length,
    totalHabitablePlanets: getTotalHabitablePlanets(),
    totalBodies: allBodies.length,
  };
}

// ============================================================================
// SEARCH & QUERY FUNCTIONS
// ============================================================================

export function searchUniverse(query: string): UniverseObject[] {
  const lowerQuery = query.toLowerCase();
  return UNIVERSE_CATALOG.filter(obj =>
    obj.name.toLowerCase().includes(lowerQuery) ||
    obj.description.toLowerCase().includes(lowerQuery) ||
    obj.type.toLowerCase().includes(lowerQuery) ||
    obj.coordinates.includes(query)
  );
}

export function getUniverseObjectById(id: string): UniverseObject | undefined {
  return UNIVERSE_CATALOG.find(obj => obj.id === id);
}

export function getObjectsByCategory(category: string): UniverseObject[] {
  return UNIVERSE_CATALOG.filter(obj => obj.category === category);
}

export function getObjectsByDangerLevel(dangerLevel: string): UniverseObject[] {
  return UNIVERSE_CATALOG.filter(obj => obj.dangerLevel === dangerLevel);
}

export function getObjectsInGalaxy(galaxy: number): UniverseObject[] {
  return UNIVERSE_CATALOG.filter(obj => {
    const parts = obj.coordinates.split(':');
    return parts.length >= 1 && parseInt(parts[0]) === galaxy;
  });
}

export function getObjectsInSector(galaxy: number, sector: number): UniverseObject[] {
  return UNIVERSE_CATALOG.filter(obj => {
    const parts = obj.coordinates.split(':');
    return parts.length >= 2 && parseInt(parts[0]) === galaxy && parseInt(parts[1]) === sector;
  });
}

// ============================================================================
// NAVIGATION DATA
// ============================================================================

export interface NavigationWaypoint {
  id: string;
  name: string;
  coordinates: string;
  category: string;
  hasStation: boolean;
  hasResources: boolean;
  dangerLevel?: string;
  isHabitable: boolean;
}

export function getNavigationWaypoints(): NavigationWaypoint[] {
  const waypoints: NavigationWaypoint[] = [];

  // Star systems with habitable planets
  const allSystems = [SOL_SYSTEM, ...ALL_STAR_SYSTEMS];
  allSystems.forEach(sys => {
    const hasHabitable = sys.bodies.some(b => b.type === 'planet' && b.properties.habitable);
    const hasStation = ALL_SPACE_STATIONS.some(s => {
      const parts = s.coordinates.split(':');
      const sysParts = sys.coordinateString.split(':');
      return parts[0] === sysParts[0] && parts[1] === sysParts[1] && parts[2] === sysParts[2];
    });
    
    waypoints.push({
      id: sys.id,
      name: sys.name,
      coordinates: sys.coordinateString,
      category: 'star-system',
      hasStation,
      hasResources: true,
      isHabitable: hasHabitable,
    });
  });

  // Space stations
  ALL_SPACE_STATIONS.forEach(station => {
    if (!waypoints.find(w => w.coordinates === station.coordinates)) {
      waypoints.push({
        id: station.id,
        name: station.name,
        coordinates: station.coordinates,
        category: 'space-station',
        hasStation: true,
        hasResources: true,
        isHabitable: true,
      });
    }
  });

  return waypoints;
}

// ============================================================================
// EXPORT ALL DATA
// ============================================================================

export {
  // Re-export from solSystemData
  SOL_SYSTEM, NEARBY_GALAXIES,
  // Re-export from starSystemsData
  ALL_STAR_SYSTEMS, getStarSystemById, getStarSystemByCoords, getAllBodies, getBodiesByType,
  // Re-export from interstellarObjectsData
  ALL_NEBULAE, ALL_BLACK_HOLES, ALL_WORMHOLES, ALL_COMETS,
  ALL_ASTEROID_CLUSTERS, ALL_SPACE_ANOMALIES, ALL_SPACE_STATIONS,
  getObjectByCoordinates, getObjectsInCoordinates,
};