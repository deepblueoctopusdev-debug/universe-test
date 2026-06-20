/**
 * Universe Catalog API Routes
 * Serves star systems, interstellar objects, and universe data
 * @tag #universe #api #catalog #starsystems
 */

import { Request, Response } from "express";

// ============================================================================
// IN-MEMORY UNIVERSE CATALOG DATA
// These are served from the server for client consumption
// ============================================================================

// Star Systems Summary
const STAR_SYSTEMS_SUMMARY = [
  {
    id: 'sol',
    name: 'Sol System',
    coordinates: '0:0:0:0:0',
    starType: 'G2V (Yellow Dwarf)',
    bodyCount: 37,
    habitableCount: 1,
    description: 'Home system of humanity. Contains Earth, the original homeworld.',
  },
  {
    id: 'alpha-centauri',
    name: 'Alpha Centauri System',
    coordinates: '1:102:9:0:0',
    starType: 'G2V + K1V + M5.5V (Trinary)',
    bodyCount: 11,
    habitableCount: 4,
    description: 'Closest star system to Sol. Trinary system with multiple habitable worlds.',
  },
  {
    id: 'sirius',
    name: 'Sirius System',
    coordinates: '1:105:4:0:0',
    starType: 'A1V + DA (Binary)',
    bodyCount: 7,
    habitableCount: 0,
    description: 'Brightest star in Earth\'s night sky. Binary with a white dwarf. Heavy metal mining.',
  },
  {
    id: 'trappist-1',
    name: 'TRAPPIST-1 System',
    coordinates: '1:150:35:0:0',
    starType: 'M8V (Ultra-Cool Red Dwarf)',
    bodyCount: 8,
    habitableCount: 3,
    description: 'Seven Earth-sized planets. Three in the habitable zone. Prime colonization targets.',
  },
  {
    id: 'barnard',
    name: "Barnard's Star System",
    coordinates: '1:120:18:0:0',
    starType: 'M4V (Red Dwarf)',
    bodyCount: 3,
    habitableCount: 1,
    description: 'Fourth closest star system. Very old and stable. Cold habitable world.',
  },
  {
    id: 'vega',
    name: 'Vega System',
    coordinates: '1:150:21:0:0',
    starType: 'A0V (White Main-Sequence)',
    bodyCount: 5,
    habitableCount: 1,
    description: 'Very bright white star with massive debris disk. Research outpost.',
  },
  {
    id: 'polaris',
    name: 'Polaris System',
    coordinates: '1:200:1:0:0',
    starType: 'F7Ib (Yellow Supergiant) + Binary',
    bodyCount: 5,
    habitableCount: 0,
    description: 'The North Star. Cepheid variable. Major navigation reference point.',
  },
  {
    id: 'epsilon-eridani',
    name: 'Epsilon Eridani System',
    coordinates: '1:120:7:0:0',
    starType: 'K2V (Orange Dwarf)',
    bodyCount: 6,
    habitableCount: 1,
    description: 'Young orange dwarf system. Extensive debris disk. Promising habitable world.',
  },
  {
    id: 'wolf-359',
    name: 'Wolf 359 System',
    coordinates: '1:85:42:0:0',
    starType: 'M6V (Red Dwarf)',
    bodyCount: 3,
    habitableCount: 0,
    description: 'Faint red dwarf with high flare activity. Minimal habitable potential.',
  },
  {
    id: 'luv',
    name: 'LUV-HD 121504 System',
    coordinates: '2:50:12:0:0',
    starType: 'G2V (Yellow Dwarf)',
    bodyCount: 7,
    habitableCount: 2,
    description: 'Perfect Earth analog system in Galaxy 2. Prime intergalactic colonization target.',
  },
  {
    id: 'rigel',
    name: 'Rigel System',
    coordinates: '1:250:8:0:0',
    starType: 'B8Ia (Blue Supergiant) + Binary',
    bodyCount: 5,
    habitableCount: 0,
    description: 'Blue supergiant. Extreme radiation. Metal-rich dust ring. Research only.',
  },
  {
    id: 'tauri',
    name: 'Tauri System',
    coordinates: '1:45:90:0:0',
    starType: 'M2III (Red Giant)',
    bodyCount: 4,
    habitableCount: 0,
    description: 'Dying red giant system. Ancient alien ruins discovered on moon.',
  },
];

// Nebulae Summary
const NEBULAE_SUMMARY = [
  { id: 'neb-orion', name: 'Orion Nebula (M42)', coordinates: '1:160:25', type: 'emission', danger: 'medium', distance: 1344 },
  { id: 'neb-crab', name: 'Crab Nebula (M1)', coordinates: '1:180:15', type: 'supernova-remnant', danger: 'high', distance: 6500 },
  { id: 'neb-eagle', name: 'Eagle Nebula (M16)', coordinates: '1:175:33', type: 'emission', danger: 'medium', distance: 7000 },
  { id: 'neb-lagoon', name: 'Lagoon Nebula (M8)', coordinates: '1:170:28', type: 'emission', danger: 'medium', distance: 4100 },
  { id: 'neb-helix', name: 'Helix Nebula (NGC 7293)', coordinates: '2:080:12', type: 'planetary', danger: 'low', distance: 1650 },
  { id: 'neb-horsehead', name: 'Horsehead Nebula (Barnard 33)', coordinates: '1:165:30', type: 'dark', danger: 'low', distance: 1500 },
  { id: 'neb-veil', name: 'Veil Nebula (NGC 6992)', coordinates: '1:185:22', type: 'supernova-remnant', danger: 'high', distance: 2400 },
  { id: 'neb-ring', name: 'Ring Nebula (M57)', coordinates: '2:090:8', type: 'planetary', danger: 'low', distance: 2300 },
  { id: 'neb-eta-carinae', name: 'Eta Carinae Nebula', coordinates: '1:200:45', type: 'emission', danger: 'extreme', distance: 7500 },
  { id: 'neb-witch-head', name: 'Witch Head Nebula (IC 2118)', coordinates: '1:155:20', type: 'reflection', danger: 'low', distance: 900 },
  { id: 'neb-omega', name: 'Omega Nebula (M17)', coordinates: '1:172:35', type: 'emission', danger: 'medium', distance: 5000 },
  { id: 'neb-bubble', name: 'Bubble Nebula (NGC 7635)', coordinates: '1:178:40', type: 'emission', danger: 'medium', distance: 7100 },
];

// Black Holes Summary
const BLACK_HOLES_SUMMARY = [
  { id: 'bh-cygnus-x1', name: 'Cygnus X-1', coordinates: '4:200:15', type: 'stellar-mass', mass: 21.2, danger: 'extreme', distance: 6000 },
  { id: 'bh-sagittarius-a', name: 'Sagittarius A*', coordinates: '1:300:1', type: 'supermassive', mass: 4300000, danger: 'extreme', distance: 26000 },
  { id: 'bh-m87', name: 'M87*', coordinates: '5:100:1', type: 'supermassive', mass: 6500000000, danger: 'extreme', distance: 53000000 },
  { id: 'bh-gro-j1655', name: 'GRO J1655-40', coordinates: '3:150:25', type: 'stellar-mass', mass: 6.3, danger: 'extreme', distance: 11000 },
  { id: 'bh-gx-339-4', name: 'GX 339-4', coordinates: '2:220:35', type: 'stellar-mass', mass: 9, danger: 'extreme', distance: 20000 },
  { id: 'bh-void-edge', name: "Void's Edge", coordinates: '5:300:18', type: 'intermediate-mass', mass: 120, danger: 'extreme', distance: 7200 },
];

// Wormholes Summary
const WORMHOLES_SUMMARY = [
  { id: 'wh-tau-1', name: 'Tau-1 Wormhole', from: '1:75:250', to: '1:125:750', stability: 85, danger: 'high' },
  { id: 'wh-omega-rift', name: 'Omega Rift', from: '2:200:400', to: '3:1:1', stability: 65, danger: 'extreme' },
  { id: 'wh-einstein-gate', name: 'Einstein Gate', from: '1:50:100', to: '4:50:100', stability: 95, danger: 'low' },
  { id: 'wh-quantum-bridge', name: 'Quantum Bridge', from: '2:100:50', to: '5:80:120', stability: 40, danger: 'extreme' },
  { id: 'wh-magellanic-gate', name: 'Magellanic Gate', from: '1:290:180', to: '2:1:1', stability: 78, danger: 'high' },
  { id: 'wh-fold-point-alpha', name: 'Fold Point Alpha', from: '1:10:1', to: '1:255:128', stability: 92, danger: 'low' },
  { id: 'wh-shadow-passage', name: 'Shadow Passage', from: '3:50:10', to: '4:200:80', stability: 55, danger: 'extreme' },
  { id: 'wh-void-gateway', name: 'Void Gateway', from: '5:150:200', to: '1:1:1', stability: 88, danger: 'high' },
];

// Space Stations Summary
const STATIONS_SUMMARY = [
  { id: 'station-proxima', name: 'Proxima Station', coordinates: '1:110:2', type: 'trade-hub', population: 85000, faction: 'Terran Confederacy' },
  { id: 'station-terra-gate', name: 'Terra Gate Station', coordinates: '1:001:1', type: 'combined', population: 250000, faction: 'United Sol Government' },
  { id: 'station-vega-relay', name: 'Vega Relay Station', coordinates: '1:150:21', type: 'research', population: 12000, faction: 'Science Council' },
  { id: 'station-sirius-mining', name: 'Sirius Mining Platform', coordinates: '1:105:4', type: 'mining', population: 45000, faction: 'MegaCorp Industries' },
  { id: 'station-polaris-obs', name: 'Polaris Observatory', coordinates: '1:200:1', type: 'research', population: 8000, faction: 'Stellar Navigation Guild' },
  { id: 'station-nova-gate', name: 'Nova Gate Hub', coordinates: '2:250:3', type: 'trade-hub', population: 120000, faction: 'Intergalactic Trade Authority' },
  { id: 'station-deep-space-7', name: 'Deep Space 9', coordinates: '2:50:12', type: 'combined', population: 50000, faction: 'Bajoran/Stellar Federation' },
];

// Universe Statistics
const UNIVERSE_STATS = {
  totalStarSystems: 12,
  totalStars: 18,
  totalPlanets: 48,
  totalMoons: 22,
  totalAsteroidBelts: 5,
  totalComets: 7,
  totalNebulae: 12,
  totalBlackHoles: 6,
  totalWormholes: 8,
  totalSpaceStations: 7,
  totalAnomalies: 8,
  totalGalaxies: 8,
  totalHabitablePlanets: 13,
  totalBodies: 93,
};

// ============================================================================
// API ROUTES
// ============================================================================

export function registerUniverseCatalogRoutes(app: any) {
  // ========================================================================
  // UNIVERSE OVERVIEW
  // ========================================================================

  app.get("/api/universe/statistics", (_req: Request, res: Response) => {
    res.json(UNIVERSE_STATS);
  });

  app.get("/api/universe/overview", (_req: Request, res: Response) => {
    res.json({
      statistics: UNIVERSE_STATS,
      galaxies: [
        { id: 1, name: 'Milky Way', type: 'spiral', systemCount: 10 },
        { id: 2, name: 'Andromeda Region', type: 'spiral', systemCount: 1 },
        { id: 3, name: 'Triangulum Sector', type: 'spiral', systemCount: 0 },
        { id: 4, name: 'Cygnus Arm', type: 'spiral', systemCount: 0 },
        { id: 5, name: 'Void Frontier', type: 'irregular', systemCount: 0 },
      ],
    });
  });

  // ========================================================================
  // STAR SYSTEMS
  // ========================================================================

  app.get("/api/universe/systems", (req: Request, res: Response) => {
    const { galaxy, habitable } = req.query;
    let systems = [...STAR_SYSTEMS_SUMMARY];

    if (galaxy !== undefined) {
      const galaxyNum = Number(galaxy);
      if (!Number.isNaN(galaxyNum)) {
        systems = systems.filter(s => {
          const parts = s.coordinates.split(':');
          return parts.length >= 1 && parseInt(parts[0]) === galaxyNum;
        });
      }
    }

    if (habitable === 'true') {
      systems = systems.filter(s => s.habitableCount > 0);
    }

    res.json({ count: systems.length, systems });
  });

  app.get("/api/universe/systems/:id", (req: Request, res: Response) => {
    const system = STAR_SYSTEMS_SUMMARY.find(s => s.id === req.params.id);
    if (!system) {
      return res.status(404).json({ message: "Star system not found" });
    }
    res.json({ system });
  });

  // ========================================================================
  // NEBULAE
  // ========================================================================

  app.get("/api/universe/nebulae", (req: Request, res: Response) => {
    const { danger, galaxy } = req.query;
    let nebulae = [...NEBULAE_SUMMARY];

    if (danger) {
      nebulae = nebulae.filter(n => n.danger === String(danger));
    }

    if (galaxy !== undefined) {
      const galaxyNum = Number(galaxy);
      if (!Number.isNaN(galaxyNum)) {
        nebulae = nebulae.filter(n => {
          const parts = n.coordinates.split(':');
          return parts.length >= 1 && parseInt(parts[0]) === galaxyNum;
        });
      }
    }

    res.json({ count: nebulae.length, nebulae });
  });

  app.get("/api/universe/nebulae/:id", (req: Request, res: Response) => {
    const nebula = NEBULAE_SUMMARY.find(n => n.id === req.params.id);
    if (!nebula) {
      return res.status(404).json({ message: "Nebula not found" });
    }
    res.json({ nebula });
  });

  // ========================================================================
  // BLACK HOLES
  // ========================================================================

  app.get("/api/universe/black-holes", (_req: Request, res: Response) => {
    res.json({ count: BLACK_HOLES_SUMMARY.length, blackHoles: BLACK_HOLES_SUMMARY });
  });

  app.get("/api/universe/black-holes/:id", (req: Request, res: Response) => {
    const bh = BLACK_HOLES_SUMMARY.find(b => b.id === req.params.id);
    if (!bh) {
      return res.status(404).json({ message: "Black hole not found" });
    }
    res.json({ blackHole: bh });
  });

  // ========================================================================
  // WORMHOLES
  // ========================================================================

  app.get("/api/universe/wormholes", (req: Request, res: Response) => {
    const { danger, galaxy } = req.query;
    let wormholes = [...WORMHOLES_SUMMARY];

    if (danger) {
      wormholes = wormholes.filter(w => w.danger === String(danger));
    }

    if (galaxy !== undefined) {
      const galaxyNum = Number(galaxy);
      if (!Number.isNaN(galaxyNum)) {
        wormholes = wormholes.filter(w => {
          const fromParts = w.from.split(':');
          const toParts = w.to.split(':');
          return (fromParts.length >= 1 && parseInt(fromParts[0]) === galaxyNum) ||
                 (toParts.length >= 1 && parseInt(toParts[0]) === galaxyNum);
        });
      }
    }

    res.json({ count: wormholes.length, wormholes });
  });

  app.get("/api/universe/wormholes/:id", (req: Request, res: Response) => {
    const wh = WORMHOLES_SUMMARY.find(w => w.id === req.params.id);
    if (!wh) {
      return res.status(404).json({ message: "Wormhole not found" });
    }
    res.json({ wormhole: wh });
  });

  // ========================================================================
  // SPACE STATIONS
  // ========================================================================

  app.get("/api/universe/stations", (req: Request, res: Response) => {
    const { faction, galaxy } = req.query;
    let stations = [...STATIONS_SUMMARY];

    if (faction) {
      stations = stations.filter(s => s.faction.toLowerCase().includes(String(faction).toLowerCase()));
    }

    if (galaxy !== undefined) {
      const galaxyNum = Number(galaxy);
      if (!Number.isNaN(galaxyNum)) {
        stations = stations.filter(s => {
          const parts = s.coordinates.split(':');
          return parts.length >= 1 && parseInt(parts[0]) === galaxyNum;
        });
      }
    }

    res.json({ count: stations.length, stations });
  });

  app.get("/api/universe/stations/:id", (req: Request, res: Response) => {
    const station = STATIONS_SUMMARY.find(s => s.id === req.params.id);
    if (!station) {
      return res.status(404).json({ message: "Space station not found" });
    }
    res.json({ station });
  });

  // ========================================================================
  // COMBINED SEARCH
  // ========================================================================

  app.get("/api/universe/search", (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || String(q).length < 2) {
      return res.status(400).json({ message: "Query must be at least 2 characters" });
    }

    const query = String(q).toLowerCase();
    const results: any[] = [];

    // Search star systems
    STAR_SYSTEMS_SUMMARY.forEach(s => {
      if (s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query)) {
        results.push({ category: 'star-system', id: s.id, name: s.name, coordinates: s.coordinates });
      }
    });

    // Search nebulae
    NEBULAE_SUMMARY.forEach(n => {
      if (n.name.toLowerCase().includes(query) || n.id.toLowerCase().includes(query)) {
        results.push({ category: 'nebula', id: n.id, name: n.name, coordinates: n.coordinates });
      }
    });

    // Search black holes
    BLACK_HOLES_SUMMARY.forEach(bh => {
      if (bh.name.toLowerCase().includes(query) || bh.id.toLowerCase().includes(query)) {
        results.push({ category: 'black-hole', id: bh.id, name: bh.name, coordinates: bh.coordinates });
      }
    });

    // Search wormholes
    WORMHOLES_SUMMARY.forEach(wh => {
      if (wh.name.toLowerCase().includes(query) || wh.id.toLowerCase().includes(query)) {
        results.push({ category: 'wormhole', id: wh.id, name: wh.name, from: wh.from, to: wh.to });
      }
    });

    // Search stations
    STATIONS_SUMMARY.forEach(st => {
      if (st.name.toLowerCase().includes(query) || st.id.toLowerCase().includes(query)) {
        results.push({ category: 'space-station', id: st.id, name: st.name, coordinates: st.coordinates });
      }
    });

    res.json({ count: results.length, results });
  });

  // ========================================================================
  // COORDINATE LOOKUP
  // ========================================================================

  app.get("/api/universe/coordinates", (req: Request, res: Response) => {
    const { galaxy, sector, system } = req.query;
    
    if (!galaxy) {
      return res.status(400).json({ message: "Galaxy parameter is required" });
    }

    const galaxyNum = Number(galaxy);
    if (Number.isNaN(galaxyNum)) {
      return res.status(400).json({ message: "Invalid galaxy number" });
    }

    const objects: any[] = [];

    // Find star systems at these coordinates
    STAR_SYSTEMS_SUMMARY.forEach(s => {
      const parts = s.coordinates.split(':');
      if (parseInt(parts[0]) === galaxyNum) {
        if (sector === undefined || (parts.length >= 2 && parseInt(parts[1]) === Number(sector))) {
          if (system === undefined || (parts.length >= 3 && parseInt(parts[2]) === Number(system))) {
            objects.push({ category: 'star-system', ...s });
          }
        }
      }
    });

    // Find nebulae at these coordinates
    NEBULAE_SUMMARY.forEach(n => {
      const parts = n.coordinates.split(':');
      if (parseInt(parts[0]) === galaxyNum) {
        if (sector === undefined || (parts.length >= 2 && parseInt(parts[1]) === Number(sector))) {
          objects.push({ category: 'nebula', ...n });
        }
      }
    });

    // Find stations at these coordinates
    STATIONS_SUMMARY.forEach(st => {
      const parts = st.coordinates.split(':');
      if (parseInt(parts[0]) === galaxyNum) {
        if (sector === undefined || (parts.length >= 2 && parseInt(parts[1]) === Number(sector))) {
          objects.push({ category: 'space-station', ...st });
        }
      }
    });

    res.json({ count: objects.length, objects });
  });
}