export interface Destination {
  id: string;
  name: string;
  coordinates: string;
  distance: number; // Light years
  dangerLevel: "low" | "medium" | "high" | "extreme";
  type: "colony" | "asteroid" | "nebula" | "blackhole" | "station" | "gate" | "star-system";
  resources: {
    metal: "low" | "medium" | "high";
    crystal: "low" | "medium" | "high";
    deuterium: "low" | "medium" | "high";
  };
  description?: string;
}

export const DESTINATIONS: Destination[] = [
  // === SOL SYSTEM ===
  { id: "sol_earth", name: "Earth (Sol)", coordinates: "1:1:100:3", distance: 0, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "medium", deuterium: "medium" }, description: "Homeworld of humanity. Third planet from Sol." },
  { id: "sol_luna", name: "Luna Moon (Sol)", coordinates: "1:1:100:3:1", distance: 0.002, dangerLevel: "low", type: "colony", resources: { metal: "low", crystal: "low", deuterium: "high" }, description: "Earth's moon. Major population center and mining hub." },
  { id: "sol_mars", name: "Mars (Sol)", coordinates: "1:1:100:4", distance: 0.003, dangerLevel: "low", type: "colony", resources: { metal: "high", crystal: "medium", deuterium: "low" }, description: "The Red Planet. Terraformed colonies and mining operations." },
  
  // === ALPHA CENTAURI SYSTEM ===
  { id: "alpha_centauri", name: "Alpha Centauri Outpost", coordinates: "1:102:9", distance: 4.3, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "low", deuterium: "medium" }, description: "Trinary star system. Closest system to Sol. Multiple habitable worlds." },
  { id: "centauri_prime", name: "Centauri Prime", coordinates: "1:102:9:2:0", distance: 4.3, dangerLevel: "low", type: "colony", resources: { metal: "high", crystal: "medium", deuterium: "medium" }, description: "Earth-like world orbiting Alpha Centauri A. Prime colonization target." },
  { id: "new_eden", name: "New Eden", coordinates: "1:102:9:2:1", distance: 4.3, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "high", deuterium: "medium" }, description: "Cooler habitable world with vast forests and exotic flora." },
  { id: "proxima_b", name: "Proxima Centauri b", coordinates: "1:102:9:1:0", distance: 4.2, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "medium", deuterium: "high" }, description: "Earth-mass exoplanet in Proxima's habitable zone." },
  
  // === SIRIUS SYSTEM ===
  { id: "sirius_b", name: "Sirius Mining Belt", coordinates: "1:105:4", distance: 8.6, dangerLevel: "medium", type: "asteroid", resources: { metal: "high", crystal: "medium", deuterium: "low" }, description: "Binary star system with white dwarf. Rich in heavy metals." },
  { id: "sirius_prime", name: "Sirius Prime", coordinates: "1:105:4:1:0", distance: 8.6, dangerLevel: "high", type: "colony", resources: { metal: "high", crystal: "high", deuterium: "medium" }, description: "Super-Earth with dense atmosphere. Dome colonies under intense UV." },
  { id: "helios_station", name: "Helios Station", coordinates: "1:105:4:1:3", distance: 8.6, dangerLevel: "medium", type: "station", resources: { metal: "low", crystal: "medium", deuterium: "high" }, description: "Helium-3 extraction facility on icy moon." },
  
  // === TRAPPIST-1 SYSTEM ===
  { id: "trappist_1e", name: "TRAPPIST-1e", coordinates: "1:150:35:1:3", distance: 39.5, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "high", deuterium: "medium" }, description: "BEST HABITABLE CANDIDATE. Earth-like conditions with oceans." },
  { id: "trappist_1f", name: "TRAPPIST-1f", coordinates: "1:150:35:1:4", distance: 39.5, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "medium", deuterium: "high" }, description: "Global ocean world with icy continents. Rich aquatic life." },
  
  // === BARNARD'S STAR ===
  { id: "barnard_b", name: "Barnard's Star b", coordinates: "1:120:18:1:0", distance: 5.9, dangerLevel: "low", type: "colony", resources: { metal: "high", crystal: "medium", deuterium: "medium" }, description: "Super-Earth in outer habitable zone. Cold climate, extensive ice." },
  
  // === VEGA SYSTEM ===
  { id: "vega_station", name: "Vega Station", coordinates: "1:150:21:1:1", distance: 25.3, dangerLevel: "medium", type: "station", resources: { metal: "medium", crystal: "medium", deuterium: "high" }, description: "Temperate world with carbon cycle. Research outpost." },
  { id: "vega_relay", name: "Vega Relay Station", coordinates: "1:150:21", distance: 25.3, dangerLevel: "medium", type: "station", resources: { metal: "medium", crystal: "medium", deuterium: "high" }, description: "Remote research station studying Vega's debris disk." },
  
  // === EPSILON ERIDANI ===
  { id: "epsilon_eridani", name: "Epsilon Eridani Colony", coordinates: "1:120:7", distance: 10.5, dangerLevel: "low", type: "colony", resources: { metal: "high", crystal: "medium", deuterium: "medium" }, description: "Young orange dwarf system. Promising habitable world Eridania." },
  { id: "eridania", name: "Eridania", coordinates: "1:120:7:1:2", distance: 10.5, dangerLevel: "low", type: "colony", resources: { metal: "high", crystal: "high", deuterium: "medium" }, description: "Promising habitable world with active geology and carbon cycle." },
  
  // === POLARIS SYSTEM ===
  { id: "polaris_obs", name: "Polaris Observatory", coordinates: "1:200:1", distance: 323, dangerLevel: "low", type: "station", resources: { metal: "low", crystal: "low", deuterium: "medium" }, description: "Navigation reference station. Calibrates all FTL drives." },
  { id: "lodestar", name: "Lodestar Station", coordinates: "1:200:1:1:1", distance: 323, dangerLevel: "low", type: "station", resources: { metal: "low", crystal: "medium", deuterium: "high" }, description: "Major navigational hub and Stellar Navigation Academy." },
  
  // === LUV SYSTEM (Galaxy 2) ===
  { id: "luv_a", name: "LUV-A (New Earth)", coordinates: "2:50:12:1:0", distance: 5000, dangerLevel: "low", type: "colony", resources: { metal: "high", crystal: "high", deuterium: "high" }, description: "Perfect Earth analog. Oceans, continents, thriving biosphere." },
  { id: "luv_b", name: "LUV-B (Jungle World)", coordinates: "2:50:12:1:1", distance: 5000, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "high", deuterium: "medium" }, description: "Warm terrestrial world with dense jungles and rich biomes." },
  
  // === RIGEL SYSTEM ===
  { id: "rigel_belt", name: "Rigel Dust Ring", coordinates: "1:250:8", distance: 860, dangerLevel: "extreme", type: "asteroid", resources: { metal: "high", crystal: "medium", deuterium: "low" }, description: "Metal-rich dust ring around blue supergiant. Extreme radiation." },
  
  // === TAURI SYSTEM ===
  { id: "tauri_ruins", name: "Tauri Ancient Ruins", coordinates: "1:45:90:1:2", distance: 1200, dangerLevel: "high", type: "colony", resources: { metal: "low", crystal: "high", deuterium: "medium" }, description: "Ancient alien ruins discovered beneath ice on dying star's moon." },
  
  // === ORIGINAL DESTINATIONS ===
  { id: "homeworld", name: "Homeworld", coordinates: "1:102:8", distance: 0.5, dangerLevel: "low", type: "colony", resources: { metal: "medium", crystal: "medium", deuterium: "medium" }, description: "Primary homeworld of the Stellar Dominion." },
  { id: "proxima", name: "Proxima Station", coordinates: "1:110:2", distance: 12.5, dangerLevel: "low", type: "station", resources: { metal: "low", crystal: "low", deuterium: "high" }, description: "Major trade hub and refueling station." },
  { id: "orion_nebula", name: "Orion Nebula", coordinates: "1:160:25", distance: 1344, dangerLevel: "high", type: "nebula", resources: { metal: "low", crystal: "high", deuterium: "high" }, description: "Bright stellar nursery with active star formation." },
  { id: "cygnus_x1", name: "Cygnus Black Hole", coordinates: "4:200:15", distance: 6000, dangerLevel: "extreme", type: "blackhole", resources: { metal: "low", crystal: "low", deuterium: "high" }, description: "First discovered black hole. X-ray binary system." },
  { id: "crab_nebula", name: "Crab Nebula", coordinates: "1:180:15", distance: 6500, dangerLevel: "high", type: "nebula", resources: { metal: "low", crystal: "medium", deuterium: "high" }, description: "Supernova remnant with central pulsar. Exotic matter rich." },
  { id: "eagle_nebula", name: "Eagle Nebula", coordinates: "1:175:33", distance: 7000, dangerLevel: "medium", type: "nebula", resources: { metal: "low", crystal: "high", deuterium: "medium" }, description: "Home of the Pillars of Creation. Active star formation." },
  { id: "gate_terra", name: "Terra Gate Station", coordinates: "1:001:1", distance: 500, dangerLevel: "low", type: "gate", resources: { metal: "low", crystal: "low", deuterium: "low" }, description: "Primary stargate control station and naval base." },
  { id: "gate_luna", name: "Luna Gate", coordinates: "3:200:5", distance: 8000, dangerLevel: "medium", type: "gate", resources: { metal: "low", crystal: "low", deuterium: "low" }, description: "Intergalactic stargate connecting to Galaxy 3." },
  { id: "nova_gate", name: "Nova Gate Hub", coordinates: "2:250:3", distance: 2300, dangerLevel: "high", type: "gate", resources: { metal: "low", crystal: "low", deuterium: "low" }, description: "Intergalactic trade hub between Galaxy 1 and Galaxy 2." },
  { id: "helix_nebula", name: "Helix Nebula", coordinates: "2:080:12", distance: 1650, dangerLevel: "high", type: "nebula", resources: { metal: "low", crystal: "high", deuterium: "high" }, description: "Planetary nebula. Eye of God. Dying star at center." },
  { id: "titanium_belt", name: "Titanium Belt", coordinates: "1:080:13", distance: 320, dangerLevel: "medium", type: "asteroid", resources: { metal: "high", crystal: "medium", deuterium: "low" }, description: "Rich asteroid belt with high-grade metal ores." },
  { id: "voids_edge", name: "Void's Edge Black Hole", coordinates: "5:300:18", distance: 7200, dangerLevel: "extreme", type: "blackhole", resources: { metal: "low", crystal: "low", deuterium: "high" }, description: "Intermediate-mass black hole at the edge of a galactic void." },
  { id: "sagittarius_a", name: "Sagittarius A*", coordinates: "1:300:1", distance: 26000, dangerLevel: "extreme", type: "blackhole", resources: { metal: "low", crystal: "low", deuterium: "high" }, description: "Supermassive black hole at the center of the Milky Way." },
  { id: "deep_space_9", name: "Deep Space 9", coordinates: "2:50:12", distance: 5000, dangerLevel: "medium", type: "station", resources: { metal: "medium", crystal: "medium", deuterium: "medium" }, description: "Multi-species station at the mouth of a stable wormhole." },
  { id: "einstein_gate", name: "Einstein Gate", coordinates: "1:50:100", distance: 2000, dangerLevel: "low", type: "gate", resources: { metal: "low", crystal: "low", deuterium: "low" }, description: "Ancient stable wormhole connecting to Galaxy 4." },
  { id: "eta_carinae", name: "Eta Carinae Nebula", coordinates: "1:200:45", distance: 7500, dangerLevel: "extreme", type: "nebula", resources: { metal: "low", crystal: "high", deuterium: "high" }, description: "Massive unstable star system. Extreme danger. Rich in exotic resources." },
];

export function getDestinationById(id: string): Destination | undefined {
  return DESTINATIONS.find(d => d.id === id);
}

export function getDestinationsByType(type: string): Destination[] {
  return DESTINATIONS.filter(d => d.type === type);
}

export function getDestinationsByDanger(level: string): Destination[] {
  return DESTINATIONS.filter(d => d.dangerLevel === level);
}

export function getDestinationsByGalaxy(galaxy: number): Destination[] {
  return DESTINATIONS.filter(d => {
    const parts = d.coordinates.split(':');
    return parts.length >= 1 && parseInt(parts[0]) === galaxy;
  });
}

export function searchDestinations(query: string): Destination[] {
  const lower = query.toLowerCase();
  return DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(lower) ||
    d.id.toLowerCase().includes(lower) ||
    (d.description && d.description.toLowerCase().includes(lower))
  );
}