/**
 * Interstellar Objects Catalog
 * Nebulae, Black Holes, Wormholes, Anomalies, Comets, Asteroid Belts, and other deep space objects
 * @tag #interstellar #nebulae #blackholes #wormholes #anomalies #comets #asteroids
 */

// ============================================================================
// NEBULA DATA
// ============================================================================

export interface Nebula {
  id: string;
  name: string;
  coordinates: string; // galaxy:sector:system
  type: 'emission' | 'reflection' | 'dark' | 'planetary' | 'supernova-remnant' | 'hii-region';
  diameter: number; // Light years
  brightness: number; // 0-100
  composition: string[];
  scientificValue: number; // 0-100
  dangerLevel: 'low' | 'medium' | 'high' | 'extreme';
  hasStarFormation: boolean;
  discoveryYear?: number;
  description: string;
  resources?: {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    exotic?: number;
  };
  pointsOfInterest?: string[];
}

export const NEBULAE: Nebula[] = [
  {
    id: 'neb-orion',
    name: 'Orion Nebula (M42)',
    coordinates: '1:160:25',
    type: 'emission',
    diameter: 24,
    brightness: 95,
    composition: ['Hydrogen-alpha', 'Oxygen-III', 'Sulfur-II', 'Dust'],
    scientificValue: 95,
    dangerLevel: 'medium',
    hasStarFormation: true,
    discoveryYear: 1610,
    description: 'One of the brightest nebulae, a stellar nursery with over 700 young stars. Active star formation region.',
    resources: { crystal: 80, deuterium: 60, exotic: 40 },
    pointsOfInterest: ['Trapezium Cluster', 'Proplyds', 'Herbig-Haro Objects'],
  },
  {
    id: 'neb-crab',
    name: 'Crab Nebula (M1)',
    coordinates: '1:180:15',
    type: 'supernova-remnant',
    diameter: 11,
    brightness: 85,
    composition: ['Synchrotron Radiation', 'Hydrogen', 'Helium', 'Oxygen', 'Iron'],
    scientificValue: 98,
    dangerLevel: 'high',
    hasStarFormation: false,
    discoveryYear: 1731,
    description: 'Remnant of a supernova observed in 1054 AD. Pulsar at center. High levels of exotic radiation.',
    resources: { metal: 20, crystal: 40, deuterium: 30, exotic: 90 },
    pointsOfInterest: ['Crab Pulsar', 'Central Neutron Star', 'Expanding Filaments'],
  },
  {
    id: 'neb-eagle',
    name: 'Eagle Nebula (M16)',
    coordinates: '1:175:33',
    type: 'emission',
    diameter: 70,
    brightness: 75,
    composition: ['Hydrogen-alpha', 'Oxygen-III', 'Sulfur-II', 'Dark Dust'],
    scientificValue: 90,
    dangerLevel: 'medium',
    hasStarFormation: true,
    description: 'Home of the famous Pillars of Creation. Massive star cluster NGC 6611 illuminates the nebula.',
    resources: { crystal: 70, deuterium: 50, exotic: 30 },
    pointsOfInterest: ['Pillars of Creation', 'Spire', 'Stellar Spire'],
  },
  {
    id: 'neb-lagoon',
    name: 'Lagoon Nebula (M8)',
    coordinates: '1:170:28',
    type: 'emission',
    diameter: 110,
    brightness: 80,
    composition: ['Hydrogen', 'Helium', 'Dust', 'Ionized Gas'],
    scientificValue: 82,
    dangerLevel: 'medium',
    hasStarFormation: true,
    description: 'Giant interstellar cloud with a bright hourglass structure. Contains a young open cluster.',
    resources: { crystal: 60, deuterium: 45, exotic: 20 },
    pointsOfInterest: ['Hourglass Nebula', 'Herschel 36 Star', 'Open Cluster NGC 6530'],
  },
  {
    id: 'neb-helix',
    name: 'Helix Nebula (NGC 7293)',
    coordinates: '2:080:12',
    type: 'planetary',
    diameter: 2.5,
    brightness: 65,
    composition: ['Hydrogen', 'Helium', 'Oxygen', 'Nitrogen'],
    scientificValue: 88,
    dangerLevel: 'low',
    hasStarFormation: false,
    description: 'Planetary nebula with a dying star at center. Known as the "Eye of God". Closest planetary nebula.',
    resources: { crystal: 50, deuterium: 30, exotic: 60 },
    pointsOfInterest: ['Central White Dwarf', 'Cometary Knots', 'Outer Ring'],
  },
  {
    id: 'neb-horsehead',
    name: 'Horsehead Nebula (Barnard 33)',
    coordinates: '1:165:30',
    type: 'dark',
    diameter: 3.5,
    brightness: 15,
    composition: ['Cold Dust', 'Molecular Gas', 'Carbon Monoxide'],
    scientificValue: 75,
    dangerLevel: 'low',
    hasStarFormation: false,
    description: 'Dark nebula silhouetted against the glowing IC 434. Iconic horse-head shape. Dense molecular cloud.',
    resources: { metal: 30, deuterium: 40, exotic: 25 },
    pointsOfInterest: ['IC 434 Background', 'Molecular Cloud Complex'],
  },
  {
    id: 'neb-veil',
    name: 'Veil Nebula (NGC 6992)',
    coordinates: '1:185:22',
    type: 'supernova-remnant',
    diameter: 50,
    brightness: 50,
    composition: ['Hydrogen-alpha', 'Oxygen-III', 'Sulfur-II', 'Shock Waves'],
    scientificValue: 85,
    dangerLevel: 'high',
    hasStarFormation: false,
    description: 'Expanding remnant of a supernova that exploded 10,000 years ago. Delicate filamentary structure.',
    resources: { metal: 15, crystal: 35, deuterium: 25, exotic: 70 },
    pointsOfInterest: ['Eastern Veil', 'Western Veil', 'Pickering\'s Triangle'],
  },
  {
    id: 'neb-ring',
    name: 'Ring Nebula (M57)',
    coordinates: '2:090:8',
    type: 'planetary',
    diameter: 1.3,
    brightness: 70,
    composition: ['Ionized Oxygen', 'Hydrogen', 'Helium', 'Nitrogen'],
    scientificValue: 80,
    dangerLevel: 'low',
    hasStarFormation: false,
    description: 'Planetary nebula shaped like a ring. Central white dwarf visible. Famous for its donut shape.',
    resources: { crystal: 40, deuterium: 25, exotic: 50 },
    pointsOfInterest: ['Central Star', 'Ring Structure', 'Outer Halo'],
  },
  {
    id: 'neb-eta-carinae',
    name: 'Eta Carinae Nebula (NGC 3372)',
    coordinates: '1:200:45',
    type: 'emission',
    diameter: 300,
    brightness: 90,
    composition: ['Hydrogen', 'Helium', 'Nitrogen', 'Dust', 'Ejecta'],
    scientificValue: 95,
    dangerLevel: 'extreme',
    hasStarFormation: true,
    description: 'Massive nebula surrounding the unstable star Eta Carinae. Contains the Homunculus Nebula.',
    resources: { crystal: 90, deuterium: 75, exotic: 85 },
    pointsOfInterest: ['Eta Carinae Star', 'Homunculus Nebula', 'Keyhole Nebula', 'Trumpler 14 Cluster'],
  },
  {
    id: 'neb-witch-head',
    name: 'Witch Head Nebula (IC 2118)',
    coordinates: '1:155:20',
    type: 'reflection',
    diameter: 50,
    brightness: 40,
    composition: ['Dust', 'Gas', 'Interstellar Medium'],
    scientificValue: 60,
    dangerLevel: 'low',
    hasStarFormation: false,
    description: 'Reflection nebula illuminated by Rigel. Eerie witch-like profile. Fine dust particles.',
    resources: { crystal: 30, deuterium: 20, exotic: 15 },
    pointsOfInterest: ['Rigel Reflection', 'Dust Filaments'],
  },
  {
    id: 'neb-omega',
    name: 'Omega Nebula (M17)',
    coordinates: '1:172:35',
    type: 'emission',
    diameter: 15,
    brightness: 78,
    composition: ['Hydrogen', 'Ionized Gas', 'Dust'],
    scientificValue: 78,
    dangerLevel: 'medium',
    hasStarFormation: true,
    description: 'Star-forming region shaped like a swan. Also called the Swan Nebula. Bright HII region.',
    resources: { crystal: 65, deuterium: 50, exotic: 25 },
    pointsOfInterest: ['Star Cluster NGC 6618', 'Dark Lanes'],
  },
  {
    id: 'neb-bubble',
    name: 'Bubble Nebula (NGC 7635)',
    coordinates: '1:178:40',
    type: 'emission',
    diameter: 4,
    brightness: 55,
    composition: ['Hydrogen', 'Oxygen', 'Nitrogen', 'Sulfur'],
    scientificValue: 72,
    dangerLevel: 'medium',
    hasStarFormation: false,
    description: 'Unique bubble-shaped nebula created by stellar wind from a massive central star.',
    resources: { crystal: 45, deuterium: 35, exotic: 30 },
    pointsOfInterest: ['Central Star BD+60 2522', 'Bubble Structure'],
  },
];

// ============================================================================
// BLACK HOLE DATA
// ============================================================================

export interface BlackHole {
  id: string;
  name: string;
  coordinates: string;
  mass: number; // Solar masses
  schwarzschildRadius: number; // km
  accretionDiskTemperature: number; // Kelvin
  spinParameter: number; // 0-1 (Kerr parameter)
  hawkingRadiation: boolean;
  danger: 'extreme' | 'critical' | 'hazardous';
  type: 'stellar-mass' | 'intermediate-mass' | 'supermassive' | 'micro';
  discoveryYear?: number;
  description: string;
  specialProperties?: string[];
  resources?: {
    exotic?: number;
    energy?: number;
  };
  // For navigation
  tidalForceZone: number; // km from center where tidal forces destroy ships
  eventHorizonDiameter: number; // km
}

export const BLACK_HOLES: BlackHole[] = [
  {
    id: 'bh-cygnus-x1',
    name: 'Cygnus X-1',
    coordinates: '4:200:15',
    mass: 21.2,
    schwarzschildRadius: 62,
    accretionDiskTemperature: 7000000,
    spinParameter: 0.85,
    hawkingRadiation: false,
    danger: 'extreme',
    type: 'stellar-mass',
    discoveryYear: 1964,
    description: 'First widely accepted black hole discovery. X-ray binary with a blue supergiant companion.',
    specialProperties: ['X-ray jet', 'Strong gravitational lensing', 'Variable accretion rate'],
    resources: { exotic: 95, energy: 90 },
    tidalForceZone: 500,
    eventHorizonDiameter: 124,
  },
  {
    id: 'bh-sagittarius-a',
    name: 'Sagittarius A*',
    coordinates: '1:300:1',
    mass: 4300000,
    schwarzschildRadius: 12700000,
    accretionDiskTemperature: 10000000,
    spinParameter: 0.9,
    hawkingRadiation: false,
    danger: 'extreme',
    type: 'supermassive',
    discoveryYear: 1974,
    description: 'Supermassive black hole at the center of the Milky Way. 4.3 million solar masses.',
    specialProperties: ['Galactic core', 'Strong gravitational influence', 'Occasional flares'],
    resources: { exotic: 100, energy: 100 },
    tidalForceZone: 50000000,
    eventHorizonDiameter: 25400000,
  },
  {
    id: 'bh-m87',
    name: 'M87*',
    coordinates: '5:100:1',
    mass: 6500000000,
    schwarzschildRadius: 19000000000,
    accretionDiskTemperature: 8000000,
    spinParameter: 0.95,
    hawkingRadiation: false,
    danger: 'extreme',
    type: 'supermassive',
    discoveryYear: 1918,
    description: 'First black hole ever imaged (2019). 6.5 billion solar masses. Massive relativistic jet.',
    specialProperties: ['Relativistic jet 5000 LY long', 'Polarized light emissions', 'Shadow imaged'],
    resources: { exotic: 100, energy: 100 },
    tidalForceZone: 50000000000,
    eventHorizonDiameter: 38000000000,
  },
  {
    id: 'bh-gro-j1655',
    name: 'GRO J1655-40',
    coordinates: '3:150:25',
    mass: 6.3,
    schwarzschildRadius: 18.6,
    accretionDiskTemperature: 9000000,
    spinParameter: 0.7,
    hawkingRadiation: false,
    danger: 'extreme',
    type: 'stellar-mass',
    description: 'X-ray binary black hole with a F-type star companion. Rapidly spinning.',
    specialProperties: ['Relativistic jets', 'Quasi-periodic oscillations'],
    resources: { exotic: 80, energy: 75 },
    tidalForceZone: 200,
    eventHorizonDiameter: 37.2,
  },
  {
    id: 'bh-gx-339-4',
    name: 'GX 339-4',
    coordinates: '2:220:35',
    mass: 9,
    schwarzschildRadius: 27,
    accretionDiskTemperature: 8000000,
    spinParameter: 0.8,
    hawkingRadiation: false,
    danger: 'extreme',
    type: 'stellar-mass',
    description: 'Low-mass X-ray binary. Known for frequent outbursts and state transitions.',
    specialProperties: ['Jet emissions', 'State transitions', 'Fast variability'],
    resources: { exotic: 75, energy: 70 },
    tidalForceZone: 300,
    eventHorizonDiameter: 54,
  },
  {
    id: 'bh-void-edge',
    name: "Void's Edge",
    coordinates: '5:300:18',
    mass: 120,
    schwarzschildRadius: 354,
    accretionDiskTemperature: 5000000,
    spinParameter: 0.6,
    hawkingRadiation: false,
    danger: 'extreme',
    type: 'intermediate-mass',
    description: 'Intermediate-mass black hole at the edge of a galactic void. Gravitational anomaly zone.',
    specialProperties: ['Lensing effects', 'Time dilation zone', 'Unexplored environment'],
    resources: { exotic: 90, energy: 85 },
    tidalForceZone: 2000,
    eventHorizonDiameter: 708,
  },
];

// ============================================================================
// WORMHOLE DATA
// ============================================================================

export interface Wormhole {
  id: string;
  name: string;
  startCoordinates: string;
  endCoordinates: string;
  type: 'stable' | 'unstable' | 'ancient' | 'artificial' | 'natural' | 'seasonal';
  stability: number; // 0-100
  diameter: number; // km
  traversable: boolean;
  maxShipSize?: number; // Hull points
  minShipSize?: number;
  energyCost: number;
  dangerLevel: 'low' | 'medium' | 'high' | 'extreme' | 'legendary';
  discoveryYear?: number;
  discoveredBy?: string;
  description: string;
  hazards: string[];
  rewards?: string[];
  // For seasonal wormholes
  seasonalWindow?: { start: number; end: number };
  // One-way
  oneWay: boolean;
}

export const WORMHOLES_DATA: Wormhole[] = [
  {
    id: 'wh-tau-1',
    name: 'Tau-1 Wormhole',
    startCoordinates: '1:75:250',
    endCoordinates: '1:125:750',
    type: 'natural',
    stability: 85,
    diameter: 500,
    traversable: true,
    maxShipSize: 50000,
    minShipSize: 1000,
    energyCost: 500,
    dangerLevel: 'high',
    discoveryYear: 2125,
    description: 'Naturally occurring wormhole connecting distant sectors within Galaxy 1.',
    hazards: ['Tidal forces', 'Radiation', 'Dimensional shearing'],
    rewards: ['Rare isotopes inside', 'Ancient artifacts'],
    oneWay: false,
  },
  {
    id: 'wh-omega-rift',
    name: 'Omega Rift',
    startCoordinates: '2:200:400',
    endCoordinates: '3:1:1',
    type: 'seasonal',
    stability: 65,
    diameter: 800,
    traversable: true,
    maxShipSize: 30000,
    minShipSize: 5000,
    energyCost: 1500,
    dangerLevel: 'extreme',
    discoveryYear: 2124,
    description: 'Dangerous wormhole connecting distant galaxies - highly unstable.',
    hazards: ['Extreme tidal forces', 'High radiation', 'Dimension collapse risk', 'Ship deformation'],
    rewards: ['Gateway to Galaxy 3', 'Exotic matter samples'],
    seasonalWindow: { start: 100, end: 200 },
    oneWay: false,
  },
  {
    id: 'wh-einstein-gate',
    name: 'Einstein Gate',
    startCoordinates: '1:50:100',
    endCoordinates: '4:50:100',
    type: 'ancient',
    stability: 95,
    diameter: 1200,
    traversable: true,
    maxShipSize: 1000000,
    minShipSize: 100,
    energyCost: 200,
    dangerLevel: 'low',
    description: 'Ancient artificially-constructed wormhole of unknown origin. Highly stable.',
    hazards: ['None'],
    rewards: ['Fast transit', 'Ancient technology signals'],
    oneWay: false,
  },
  {
    id: 'wh-quantum-bridge',
    name: 'Quantum Bridge',
    startCoordinates: '2:100:50',
    endCoordinates: '5:80:120',
    type: 'unstable',
    stability: 40,
    diameter: 300,
    traversable: true,
    maxShipSize: 10000,
    minShipSize: 500,
    energyCost: 3000,
    dangerLevel: 'extreme',
    description: 'Highly unstable quantum tunnel. Predicted to collapse within 50 years.',
    hazards: ['Quantum flux', 'Reality tears', 'Temporal instability'],
    rewards: ['Rare exotic matter', 'Unique energy signatures'],
    oneWay: false,
  },
  {
    id: 'wh-magellanic-gate',
    name: 'Magellanic Gate',
    startCoordinates: '1:290:180',
    endCoordinates: '2:1:1',
    type: 'natural',
    stability: 78,
    diameter: 650,
    traversable: true,
    maxShipSize: 200000,
    minShipSize: 2000,
    energyCost: 800,
    dangerLevel: 'high',
    description: 'Natural wormhole bridging the Milky Way to the nearby Magellanic region.',
    hazards: ['Gravitational shear', 'Radiation pockets', 'Debris fields'],
    rewards: ['Access to Galaxy 2', 'Untold resources'],
    oneWay: false,
  },
  {
    id: 'wh-fold-point-alpha',
    name: 'Fold Point Alpha',
    startCoordinates: '1:10:1',
    endCoordinates: '1:255:128',
    type: 'stable',
    stability: 92,
    diameter: 400,
    traversable: true,
    maxShipSize: 100000,
    minShipSize: 100,
    energyCost: 400,
    dangerLevel: 'low',
    description: 'Reliable wormhole connecting inner core to outer rim. Heavily trafficked.',
    hazards: ['Minor spatial turbulence'],
    rewards: ['Standard transit route', 'Trade opportunities'],
    oneWay: false,
  },
  {
    id: 'wh-shadow-passage',
    name: 'Shadow Passage',
    startCoordinates: '3:50:10',
    endCoordinates: '4:200:80',
    type: 'seasonal',
    stability: 55,
    diameter: 250,
    traversable: true,
    maxShipSize: 15000,
    minShipSize: 3000,
    energyCost: 2000,
    dangerLevel: 'extreme',
    description: 'Shadowy passage only open during specific stellar alignments.',
    hazards: ['Dark matter interference', 'Navigation failure', 'Crew hallucinations'],
    rewards: ['Rare elements', 'Shadow technology'],
    seasonalWindow: { start: 50, end: 80 },
    oneWay: true,
  },
  {
    id: 'wh-void-gateway',
    name: 'Void Gateway',
    startCoordinates: '5:150:200',
    endCoordinates: '1:1:1',
    type: 'artificial',
    stability: 88,
    diameter: 900,
    traversable: true,
    maxShipSize: 500000,
    minShipSize: 500,
    energyCost: 1000,
    dangerLevel: 'high',
    description: 'Massive artificial gateway discovered in a dark void. Probably built by an ancient civilization.',
    hazards: ['Unknown technology', 'Security scans', 'Energy fluctuations'],
    rewards: ['Ancient knowledge', 'Powerful artifacts', 'Unknown technology'],
    oneWay: false,
  },
];

// ============================================================================
// COMET DATA
// ============================================================================

export interface Comet {
  id: string;
  name: string;
  currentCoordinates: string;
  type: 'short-period' | 'long-period' | 'hyperbolic' | 'extinct' | 'interstellar';
  coreSize: number; // km
  tailLength: number; // AU
  orbitalPeriod: number; // Years
  nextApproach?: string; // Turn/date
  eccentricity: number;
  inclination: number; // Degrees
  composition: string[];
  resources: {
    ice: number;
    organics: number;
    dust: number;
    rareElements?: number;
  };
  scientificValue: number;
  description: string;
  // For navigation hazards
  debrisTrail?: boolean;
  hazardLevel?: 'low' | 'medium' | 'high';
}

export const COMETS: Comet[] = [
  {
    id: 'comet-halley',
    name: "Halley's Comet",
    currentCoordinates: '1:200:15',
    type: 'short-period',
    coreSize: 15,
    tailLength: 2.5,
    orbitalPeriod: 75,
    nextApproach: 'Turn 850',
    eccentricity: 0.967,
    inclination: 162,
    composition: ['Water Ice', 'Carbon Dioxide', 'Methane', 'Dust', 'Organic Compounds'],
    resources: { ice: 80, organics: 70, dust: 60, rareElements: 20 },
    scientificValue: 80,
    description: 'Most famous comet. Regular visitor visible to the naked eye. Rich organic chemistry.',
    debrisTrail: true,
    hazardLevel: 'low',
  },
  {
    id: 'comet-hale-bopp',
    name: 'Hale-Bopp',
    currentCoordinates: '2:300:50',
    type: 'long-period',
    coreSize: 40,
    tailLength: 3.5,
    orbitalPeriod: 2533,
    nextApproach: 'Not within simulation',
    eccentricity: 0.995,
    inclination: 89,
    composition: ['Water Ice', 'Silicate Dust', 'Sodium', 'Cyanide', 'Organic Molecules'],
    resources: { ice: 90, organics: 85, dust: 75, rareElements: 40 },
    scientificValue: 90,
    description: 'One of the brightest comets ever. Exceptionally large nucleus. Long orbit.',
    debrisTrail: false,
    hazardLevel: 'low',
  },
  {
    id: 'comet-hyakutake',
    name: 'Hyakutake',
    currentCoordinates: '1:250:80',
    type: 'long-period',
    coreSize: 4.2,
    tailLength: 4.8,
    orbitalPeriod: 17000,
    nextApproach: 'Not within simulation',
    eccentricity: 0.999,
    inclination: 124,
    composition: ['Water Ice', 'Carbon Monoxide', 'Dust', 'X-ray Emitting Compounds'],
    resources: { ice: 70, organics: 60, dust: 50, rareElements: 25 },
    scientificValue: 85,
    description: 'Comet with one of the longest recorded tails. First comet detected in X-rays.',
    debrisTrail: false,
    hazardLevel: 'low',
  },
  {
    id: 'comet-leonids',
    name: '55P/Tempel-Tuttle',
    currentCoordinates: '1:150:30',
    type: 'short-period',
    coreSize: 3.6,
    tailLength: 1.8,
    orbitalPeriod: 33,
    nextApproach: 'Turn 720',
    eccentricity: 0.905,
    inclination: 162.5,
    composition: ['Dust', 'Ice', 'Rock Fragments'],
    resources: { ice: 40, organics: 30, dust: 80, rareElements: 10 },
    scientificValue: 55,
    description: 'Parent body of the Leonid meteor shower. Produces spectacular meteor storms.',
    debrisTrail: true,
    hazardLevel: 'medium',
  },
  {
    id: 'comet-oumuamua',
    name: "Oumuamua",
    currentCoordinates: '5:400:200',
    type: 'interstellar',
    coreSize: 0.4,
    tailLength: 0,
    orbitalPeriod: 0,
    nextApproach: 'Exiting system',
    eccentricity: 1.2,
    inclination: 122,
    composition: ['Unknown (cigar-shaped)', 'Reflective Surface', 'Organic Rind'],
    resources: { ice: 10, organics: 90, dust: 20, rareElements: 80 },
    scientificValue: 100,
    description: 'First detected interstellar object. Cigar-shaped with anomalous acceleration. Mystery object.',
    debrisTrail: false,
    hazardLevel: 'low',
  },
  {
    id: 'comet-borisov',
    name: "2I/Borisov",
    currentCoordinates: '4:350:180',
    type: 'interstellar',
    coreSize: 0.4,
    tailLength: 0.5,
    orbitalPeriod: 0,
    nextApproach: 'Exiting system',
    eccentricity: 1.08,
    inclination: 44,
    composition: ['Water Ice', 'Carbon Monoxide', 'Dust'],
    resources: { ice: 60, organics: 50, dust: 40, rareElements: 70 },
    scientificValue: 98,
    description: 'Second interstellar comet. Very active, with carbon monoxide rich composition.',
    debrisTrail: true,
    hazardLevel: 'low',
  },
  {
    id: 'comet-ison',
    name: 'Comet ISON (C/2012 S1)',
    currentCoordinates: '1:50:5',
    type: 'long-period',
    coreSize: 5,
    tailLength: 1.0,
    orbitalPeriod: 1000000,
    nextApproach: 'Degraded',
    eccentricity: 0.999,
    inclination: 62,
    composition: ['Water Ice', 'Carbon Dioxide', 'Silicate', 'Sodium'],
    resources: { ice: 50, organics: 40, dust: 35, rareElements: 15 },
    scientificValue: 75,
    description: 'Sun-grazing comet that partially disintegrated. Now a debris stream.',
    debrisTrail: true,
    hazardLevel: 'medium',
  },
];

// ============================================================================
// ASTEROID BELTS & CLUSTERS
// ============================================================================

export interface AsteroidCluster {
  id: string;
  name: string;
  coordinates: string;
  type: 'main-belt' | 'kuiper-belt' | 'oort-cloud' | 'trojan' | 'debris-disk' | 'ring-system';
  asteroidCount: number;
  totalMass: number; // Earth masses
  density: 'sparse' | 'moderate' | 'dense' | 'extremely-dense';
  radius: number; // AU (extent)
  compositionTypes: string[];
  primaryResources: {
    metal: number;
    crystal: number;
    deuterium: number;
    rareEarth?: number;
  };
  hazardLevel: 'low' | 'medium' | 'high' | 'extreme';
  miningPotential: number; // 0-100
  description: string;
  notableAsteroids?: string[];
}

export const ASTEROID_CLUSTERS: AsteroidCluster[] = [
  {
    id: 'belt-main-g1',
    name: 'Galaxy 1 Main Belt',
    coordinates: '1:100:0',
    type: 'main-belt',
    asteroidCount: 1000000,
    totalMass: 0.002,
    density: 'moderate',
    radius: 2.5,
    compositionTypes: ['S-type (Silicaceous)', 'C-type (Carbonaceous)', 'M-type (Metallic)'],
    primaryResources: { metal: 75, crystal: 50, deuterium: 20, rareEarth: 30 },
    hazardLevel: 'medium',
    miningPotential: 85,
    description: 'Primary asteroid belt between inner and outer planets. Rich mineral resources.',
    notableAsteroids: ['Ceres', 'Vesta', 'Pallas', 'Hygeia'],
  },
  {
    id: 'belt-kuiper-g1',
    name: 'Galaxy 1 Kuiper Belt',
    coordinates: '1:300:0',
    type: 'kuiper-belt',
    asteroidCount: 100000000,
    totalMass: 0.02,
    density: 'sparse',
    radius: 50,
    compositionTypes: ['Icy Bodies', 'Carbonaceous', 'Rock-Ice Mixtures'],
    primaryResources: { metal: 20, crystal: 60, deuterium: 80, rareEarth: 15 },
    hazardLevel: 'low',
    miningPotential: 70,
    description: 'Vast icy debris field beyond the outer planets. Rich in volatiles and deuterium.',
    notableAsteroids: ['Pluto', 'Eris', 'Makemake', 'Haumea'],
  },
  {
    id: 'belt-orion-debris',
    name: 'Orion Debris Disk',
    coordinates: '1:160:25',
    type: 'debris-disk',
    asteroidCount: 100000,
    totalMass: 0.001,
    density: 'moderate',
    radius: 1.5,
    compositionTypes: ['Protoplanetary Dust', 'Ice', 'Organic Compounds'],
    primaryResources: { metal: 30, crystal: 70, deuterium: 50, rareEarth: 25 },
    hazardLevel: 'high',
    miningPotential: 60,
    description: 'Protoplanetary debris disk in the Orion Nebula. Active planet formation zone.',
  },
  {
    id: 'belt-trojan-jupiter',
    name: 'Trojan Belt Alpha',
    coordinates: '1:108:0',
    type: 'trojan',
    asteroidCount: 500000,
    totalMass: 0.001,
    density: 'moderate',
    radius: 1.0,
    compositionTypes: ['D-type (Dark)', 'P-type', 'Carbonaceous'],
    primaryResources: { metal: 40, crystal: 55, deuterium: 35, rareEarth: 20 },
    hazardLevel: 'low',
    miningPotential: 65,
    description: 'Trojan asteroids orbiting at Jupiter-Sol Lagrange points. Dark carbon-rich bodies.',
  },
  {
    id: 'belt-vega-dust',
    name: 'Vega Dust Ring',
    coordinates: '1:150:21',
    type: 'debris-disk',
    asteroidCount: 5000,
    totalMass: 0.0001,
    density: 'sparse',
    radius: 80,
    compositionTypes: ['Fine Dust', 'Ice Grains', 'Silicates'],
    primaryResources: { metal: 10, crystal: 80, deuterium: 60, rareEarth: 40 },
    hazardLevel: 'low',
    miningPotential: 30,
    description: 'Extended debris disk around Vega. Similar to young Solar System.',
  },
  {
    id: 'belt-rigel-ring',
    name: 'Rigel Dust Ring',
    coordinates: '1:250:8',
    type: 'debris-disk',
    asteroidCount: 10000,
    totalMass: 0.0005,
    density: 'sparse',
    radius: 50,
    compositionTypes: ['Heavy Elements', 'Dust', 'Rock'],
    primaryResources: { metal: 60, crystal: 40, deuterium: 30, rareEarth: 70 },
    hazardLevel: 'high',
    miningPotential: 45,
    description: 'Metal-rich dust ring illuminated by Rigel. Heavy element concentrations.',
  },
];

// ============================================================================
// SPACE ANOMALIES
// ============================================================================

export interface SpaceAnomaly {
  id: string;
  name: string;
  coordinates: string;
  type: 'gravitational' | 'temporal' | 'radiation' | 'electromagnetic' | 'quantum' | 'dimensional' | 'energy' | 'biological';
  danger: 'low' | 'medium' | 'high' | 'extreme' | 'catastrophic';
  radius: number; // AU
  scientificValue: number; // 0-100
  effects: string[];
  description: string;
  isPermanent: boolean;
  duration?: string; // If temporary
  rewards?: string[];
}

export const SPACE_ANOMALIES: SpaceAnomaly[] = [
  {
    id: 'anom-great-attractor',
    name: 'Great Attractor Signature',
    coordinates: '6:500:300',
    type: 'gravitational',
    danger: 'extreme',
    radius: 1000,
    scientificValue: 100,
    effects: ['Massive gravitational pull', 'Galaxy cluster motion', 'Space-time distortion'],
    description: 'A massive gravitational anomaly pulling entire galactic clusters. Unexplained phenomenon.',
    isPermanent: true,
    rewards: ['Understanding of dark flow', 'Universal mapping data'],
  },
  {
    id: 'anom-temporal-rift',
    name: 'Temporal Rift Alpha',
    coordinates: '3:80:40',
    type: 'temporal',
    danger: 'extreme',
    radius: 5,
    scientificValue: 95,
    effects: ['Time dilation 10:1', 'Causality violations', 'Signal echo effects'],
    description: 'Region of space where time flows differently. Ships experience time dilation.',
    isPermanent: true,
    rewards: ['Time crystals', 'Faster travel (subjective)', 'Unique research data'],
  },
  {
    id: 'anom-electromagnetic-storm',
    name: 'Persistent EM Storm',
    coordinates: '1:200:100',
    type: 'electromagnetic',
    danger: 'high',
    radius: 8,
    scientificValue: 65,
    effects: ['Sensor blackout', 'Communication disruption', 'Shield drain'],
    description: 'Constant electromagnetic storm disrupting all sensor and communication systems.',
    isPermanent: false,
    duration: 'Recurring every 50 turns',
  },
  {
    id: 'anom-quantum-flux',
    name: 'Quantum Flux Zone',
    coordinates: '4:120:60',
    type: 'quantum',
    danger: 'high',
    radius: 3,
    scientificValue: 90,
    effects: ['Quantum entanglement disruption', 'Probability fluctuations', 'Random teleportation'],
    description: 'Area where quantum effects manifest at macroscopic scale. Unpredictable.',
    isPermanent: true,
    rewards: ['Exotic matter', 'Quantum computing advances'],
  },
  {
    id: 'anom-dim-rift',
    name: 'Dimensional Rift #7',
    coordinates: '5:80:250',
    type: 'dimensional',
    danger: 'catastrophic',
    radius: 10,
    scientificValue: 100,
    effects: ['Reality bleed', 'Alien incursion risk', 'Physics anomalies'],
    description: 'Tear in spacetime leading to another dimension. Extreme caution advised.',
    isPermanent: true,
    rewards: ['Other-dimensional technology', 'Unknown materials', 'Advanced knowledge'],
  },
  {
    id: 'anom-bio-nebula',
    name: 'Living Nebula',
    coordinates: '2:150:75',
    type: 'biological',
    danger: 'high',
    radius: 20,
    scientificValue: 95,
    effects: ['Organic growth on ships', 'Atmospheric changes', 'Unknown lifeforms'],
    description: 'Nebula containing organic compounds and possible alien microorganisms.',
    isPermanent: true,
    rewards: ['Biological samples', 'New medicines', 'Organic alloys'],
  },
  {
    id: 'anom-energy-singularity',
    name: 'Energy Singularity',
    coordinates: '3:300:200',
    type: 'energy',
    danger: 'extreme',
    radius: 2,
    scientificValue: 80,
    effects: ['Energy drain', 'System overloads', 'Pure energy emissions'],
    description: 'Spherical region of pure energy. Unknown source. Potential power source.',
    isPermanent: true,
    rewards: ['Infinite energy research', 'New power technology'],
  },
  {
    id: 'anom-gravity-knot',
    name: 'Gravity Knot',
    coordinates: '1:180:60',
    type: 'gravitational',
    danger: 'high',
    radius: 1,
    scientificValue: 75,
    effects: ['Localized gravity increase x100', 'Spacetime curvature', 'Navigation hazard'],
    description: 'Intense localized gravity field. Can slingshot ships but also trap them.',
    isPermanent: true,
    rewards: ['Gravity research data', 'Slingshot navigation'],
  },
];

// ============================================================================
// MAJOR STATIONS / SPACE HUBS
// ============================================================================

export interface SpaceStation {
  id: string;
  name: string;
  coordinates: string;
  type: 'trade-hub' | 'military' | 'research' | 'mining' | 'civilian' | 'refueling' | 'combined';
  faction: string;
  population: number;
  services: string[];
  defenses: number; // 0-100
  tradeVolume: number; // 0-100
  description: string;
  owner?: string;
  constructedYear?: number;
  specialFeatures?: string[];
}

export const SPACE_STATIONS: SpaceStation[] = [
  {
    id: 'station-proxima',
    name: 'Proxima Station',
    coordinates: '1:110:2',
    type: 'trade-hub',
    faction: 'Terran Confederacy',
    population: 85000,
    services: ['Ship Refueling', 'Trade Market', 'Repair Docks', 'Medical Bay', 'Entertainment'],
    defenses: 60,
    tradeVolume: 85,
    description: 'Major trade hub and refueling station. Gateway to nearby star systems.',
    constructedYear: 2089,
    specialFeatures: ['Zero-G recreational parks', 'Pan-galactic bazaar'],
  },
  {
    id: 'station-terra-gate',
    name: 'Terra Gate Station',
    coordinates: '1:001:1',
    type: 'combined',
    faction: 'United Sol Government',
    population: 250000,
    services: ['All services', 'Ship Construction', 'Stargate Operations', 'Naval Base'],
    defenses: 95,
    tradeVolume: 95,
    description: 'Primary stargate control station and naval base. Largest human station.',
    constructedYear: 2065,
    specialFeatures: ['Stargate network hub', 'Deep space observatory', 'Military academy'],
  },
  {
    id: 'station-vega-relay',
    name: 'Vega Relay Station',
    coordinates: '1:150:21',
    type: 'research',
    faction: 'Science Council',
    population: 12000,
    services: ['Research Labs', 'Astronomical Observatory', 'Communication Relay'],
    defenses: 30,
    tradeVolume: 40,
    description: 'Remote research station studying the Vega system and its debris disk.',
    constructedYear: 2095,
    specialFeatures: ['Adaptive optics telescope', 'Debris mapping array'],
  },
  {
    id: 'station-sirius-mining',
    name: 'Sirius Mining Platform',
    coordinates: '1:105:4',
    type: 'mining',
    faction: 'MegaCorp Industries',
    population: 45000,
    services: ['Ore Processing', 'Ship Refueling', 'Worker Habitats'],
    defenses: 50,
    tradeVolume: 75,
    description: 'Massive orbital mining platform extracting heavy metals and minerals.',
    constructedYear: 2078,
    specialFeatures: ['Zero-G refineries', 'Automated mining drones'],
  },
  {
    id: 'station-polaris-obs',
    name: 'Polaris Navigational Observatory',
    coordinates: '1:200:1',
    type: 'research',
    faction: 'Stellar Navigation Guild',
    population: 8000,
    services: ['Navigation Calibration', 'Astronomical Research', 'Training Facility'],
    defenses: 25,
    tradeVolume: 60,
    description: 'Primary navigation reference station. Calibrates all FTL drives.',
    constructedYear: 2070,
    specialFeatures: ['Interstellar navigation beacon', 'Cepheid reference array'],
  },
  {
    id: 'station-nova-gate',
    name: 'Nova Gate Hub',
    coordinates: '2:250:3',
    type: 'trade-hub',
    faction: 'Intergalactic Trade Authority',
    population: 120000,
    services: ['Trade', 'Customs', 'Ship Services', 'Banking', 'Embassy'],
    defenses: 80,
    tradeVolume: 90,
    description: 'Intergalactic trade hub. Gateway between Galaxy 1 and Galaxy 2.',
    constructedYear: 2100,
    specialFeatures: ['Intergalactic customs', 'Currency exchange', 'Diplomatic center'],
  },
  {
    id: 'station-deep-space-7',
    name: 'Deep Space 9',
    coordinates: '2:50:12',
    type: 'combined',
    faction: 'Bajoran/Stellar Federation',
    population: 50000,
    services: ['Trade', 'Defense', 'Research', 'Diplomatic'],
    defenses: 85,
    tradeVolume: 80,
    description: 'Multi-species space station at the mouth of a stable wormhole.',
    constructedYear: 2105,
    specialFeatures: ['Wormhole operations', 'Alien artifact research', 'Cultural exchange'],
  },
];

// ============================================================================
// EXPORT ALL INTERSTELLAR OBJECTS
// ============================================================================

export const ALL_NEBULAE = NEBULAE;
export const ALL_BLACK_HOLES = BLACK_HOLES;
export const ALL_WORMHOLES = WORMHOLES_DATA;
export const ALL_COMETS = COMETS;
export const ALL_ASTEROID_CLUSTERS = ASTEROID_CLUSTERS;
export const ALL_SPACE_ANOMALIES = SPACE_ANOMALIES;
export const ALL_SPACE_STATIONS = SPACE_STATIONS;

// Helper functions
export function getNebulaById(id: string): Nebula | undefined {
  return NEBULAE.find(n => n.id === id);
}

export function getBlackHoleById(id: string): BlackHole | undefined {
  return BLACK_HOLES.find(bh => bh.id === id);
}

export function getWormholeById(id: string): Wormhole | undefined {
  return WORMHOLES_DATA.find(w => w.id === id);
}

export function getWormholeByEndpoint(coord: string): Wormhole[] {
  return WORMHOLES_DATA.filter(w => w.startCoordinates === coord || w.endCoordinates === coord);
}

export function getSpaceStationById(id: string): SpaceStation | undefined {
  return SPACE_STATIONS.find(s => s.id === id);
}

export function getAnomalyById(id: string): SpaceAnomaly | undefined {
  return SPACE_ANOMALIES.find(a => a.id === id);
}

export function getObjectByCoordinates(coordStr: string): any {
  // Search all catalogs for an object at these coordinates
  const station = SPACE_STATIONS.find(s => s.coordinates === coordStr);
  if (station) return { type: 'station', data: station };
  
  const nebula = NEBULAE.find(n => n.coordinates === coordStr);
  if (nebula) return { type: 'nebula', data: nebula };
  
  const blackHole = BLACK_HOLES.find(bh => bh.coordinates === coordStr);
  if (blackHole) return { type: 'blackhole', data: blackHole };
  
  const wormhole = WORMHOLES_DATA.find(w => w.startCoordinates === coordStr || w.endCoordinates === coordStr);
  if (wormhole) return { type: 'wormhole', data: wormhole };
  
  const anomaly = SPACE_ANOMALIES.find(a => a.coordinates === coordStr);
  if (anomaly) return { type: 'anomaly', data: anomaly };
  
  const comet = COMETS.find(c => c.currentCoordinates === coordStr);
  if (comet) return { type: 'comet', data: comet };
  
  const asteroidCluster = ASTEROID_CLUSTERS.find(a => a.coordinates === coordStr);
  if (asteroidCluster) return { type: 'asteroid-cluster', data: asteroidCluster };
  
  return null;
}

export function getObjectsInCoordinates(galaxy: number, sector?: number, system?: number): any[] {
  const results: any[] = [];
  
  const coordFilter = (coord: string) => {
    const parts = coord.split(':');
    if (parts.length < 1) return false;
    if (parseInt(parts[0]) !== galaxy) return false;
    if (sector !== undefined && (parts.length < 2 || parseInt(parts[1]) !== sector)) return false;
    if (system !== undefined && (parts.length < 3 || parseInt(parts[2]) !== system)) return false;
    return true;
  };
  
  SPACE_STATIONS.filter(s => coordFilter(s.coordinates)).forEach(s => 
    results.push({ type: 'station', data: s }));
  NEBULAE.filter(n => coordFilter(n.coordinates)).forEach(n => 
    results.push({ type: 'nebula', data: n }));
  BLACK_HOLES.filter(bh => coordFilter(bh.coordinates)).forEach(bh => 
    results.push({ type: 'blackhole', data: bh }));
  SPACE_ANOMALIES.filter(a => coordFilter(a.coordinates)).forEach(a => 
    results.push({ type: 'anomaly', data: a }));
  
  return results;
}