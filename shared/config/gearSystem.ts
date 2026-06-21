export type GearSlot =
  | "weapon" | "armor" | "shield" | "helmet" | "boots"
  | "accessory" | "relic" | "pet" | "consumable";

export type GearRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export type GearTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type GearCategory =
  | "weapon" | "armor" | "shield" | "helmet" | "boots"
  | "accessory" | "relic" | "pet" | "consumable" | "formation";

export type WeaponClass = "kinetic" | "plasma" | "ion" | "rail" | "particle" | "gravity";
export type ArmorClass = "plate" | "composite" | "nano" | "reactive" | "aegis";
export type ShieldClass = "energy" | "phase" | "gravity" | "quantum";
export type HelmetClass = "tactical" | "neural" | "crown" | "visor";
export type BootClass = "sprint" | "phase" | "graviton" | "stealth";
export type AccessoryClass = "power" | "adrenaline" | "quantum" | "tech";
export type RelicClass = "ancient" | "stellar" | "void";
export type PetClass = "beast" | "mech" | "ethereal";
export type ConsumableClass = "combat" | "tactical" | "utility";
export type FormationClass = "offensive" | "defensive" | "support";

export type WeaponSubClass = "assault" | "recon" | "berserker" | "tactician" | "sentinel" | "vanguard"
  | "sharpshooter" | "breaker" | "warlock" | "adept" | "juggernaut" | "enforcer";
export type ArmorSubClass = "fortified" | "guardian" | "phantom" | "ghost" | "regenerative" | "adaptive"
  | "bulwark" | "titan" | "protector" | "warden";
export type ShieldSubClass = "deflector" | "reflector" | "phasewall" | "void" | "nullfield" | "warp"
  | "entangle" | "flux";
export type HelmetSubClass = "marksman" | "spotter" | "psionic" | "cerebral" | "commander" | "overlord"
  | "hunter" | "predator";
export type BootSubClass = "striker" | "charger" | "phasewalker" | "voidrunner" | "float" | "drifter"
  | "shadow" | "phantom";
export type AccessorySubClass = "cell" | "catalyst" | "booster" | "overdrive" | "amulet" | "relic"
  | "core" | "matrix";
export type RelicSubClass = "core" | "fragment" | "compass" | "nexus" | "shard" | "echo";
export type PetSubClass = "hawk" | "wolf" | "drone" | "turret" | "wisp" | "shade";
export type ConsumableSubClass = "stim" | "grenade" | "smoke" | "decoy" | "scanner" | "beacon";
export type FormationSubClass = "wedge" | "arrow" | "phalanx" | "shield_wall" | "rally" | "heal";

export interface GearStatBlock {
  attack: number;
  defense: number;
  health: number;
  speed: number;
  critChance: number;
  critDamage: number;
  dodge: number;
  block: number;
  moraleBonus: number;
  experienceBonus: number;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  slot: GearSlot;
  category: GearCategory;
  gearClass: string;
  gearSubClass: string;
  rarity: GearRarity;
  tier: GearTier;
  level: number;
  maxLevel: number;
  stats: Partial<GearStatBlock>;
  setBonus?: string;
  setId?: string;
  source: "craft" | "drop" | "quest" | "shop" | "raid" | "event";
  requiredLevel: number;
  upgradeCost: { metal: number; crystal: number; deuterium: number; gold: number };
}

export interface GearSet {
  id: string;
  name: string;
  description: string;
  pieces: number;
  twoPieceBonus: Partial<GearStatBlock>;
  fourPieceBonus: Partial<GearStatBlock>;
  sixPieceBonus: Partial<GearStatBlock>;
}

export interface ArmyGearItem {
  id: string;
  name: string;
  description: string;
  slot: "weapon" | "armor" | "accessory" | "formation";
  rarity: GearRarity;
  tier: GearTier;
  level: number;
  maxLevel: number;
  stats: Partial<GearStatBlock>;
  unitTypes: string[];
  source: "craft" | "drop" | "quest" | "shop";
  requiredLevel: number;
  upgradeCost: { metal: number; crystal: number; deuterium: number };
}

export const RARITY_MULTIPLIER: Record<GearRarity, number> = {
  common: 1.0,
  uncommon: 1.2,
  rare: 1.5,
  epic: 2.0,
  legendary: 3.0,
  mythic: 5.0,
};

export const TIER_MULTIPLIER: Record<GearTier, number> = {
  1: 1.0, 2: 1.3, 3: 1.6, 4: 2.0, 5: 2.5,
  6: 3.0, 7: 3.6, 8: 4.3, 9: 5.0, 10: 6.0,
};

export function calculateItemPower(item: { rarity: GearRarity; tier: GearTier; level: number; stats: Partial<GearStatBlock> }): number {
  const rarityMult = RARITY_MULTIPLIER[item.rarity];
  const tierMult = TIER_MULTIPLIER[item.tier];
  const levelMult = 1 + (item.level - 1) * 0.1;
  const statTotal = Object.values(item.stats).reduce((sum, v) => sum + (v || 0), 0);
  return Math.round(statTotal * rarityMult * tierMult * levelMult);
}

export function calculateUpgradeCost(
  baseCost: { metal: number; crystal: number; deuterium: number; gold: number },
  currentLevel: number,
  rarity: GearRarity
): { metal: number; crystal: number; deuterium: number; gold: number } {
  const rarityMult = RARITY_MULTIPLIER[rarity];
  const levelMult = 1 + (currentLevel - 1) * 0.25;
  return {
    metal: Math.round(baseCost.metal * levelMult * rarityMult),
    crystal: Math.round(baseCost.crystal * levelMult * rarityMult),
    deuterium: Math.round(baseCost.deuterium * levelMult * rarityMult),
    gold: Math.round(baseCost.gold * levelMult * rarityMult),
  };
}

export function calculateItemStatAtLevel(
  baseStat: number,
  level: number,
  rarity: GearRarity,
  tier: GearTier
): number {
  const rarityMult = RARITY_MULTIPLIER[rarity];
  const tierMult = TIER_MULTIPLIER[tier];
  const levelGrowth = 1 + (level - 1) * 0.08;
  return Math.round(baseStat * rarityMult * tierMult * levelGrowth);
}

export function getMaxLevel(rarity: GearRarity): number {
  const maxLevels: Record<GearRarity, number> = {
    common: 10, uncommon: 15, rare: 20, epic: 25, legendary: 30, mythic: 40,
  };
  return maxLevels[rarity];
}

export const COMMANDER_GEAR_SLOTS: { id: GearSlot; label: string; icon: string }[] = [
  { id: "weapon", label: "Weapon", icon: "Sword" },
  { id: "armor", label: "Armor", icon: "Shield" },
  { id: "shield", label: "Shield", icon: "ShieldCheck" },
  { id: "helmet", label: "Helmet", icon: "Crown" },
  { id: "boots", label: "Boots", icon: "Footprints" },
  { id: "accessory", label: "Accessory", icon: "Gem" },
  { id: "relic", label: "Relic", icon: "Sparkles" },
  { id: "pet", label: "Companion", icon: "Heart" },
];

export const ARMY_GEAR_SLOTS: { id: ArmyGearItem["slot"]; label: string }[] = [
  { id: "weapon", label: "Unit Weapon" },
  { id: "armor", label: "Unit Armor" },
  { id: "accessory", label: "Unit Accessory" },
  { id: "formation", label: "Formation Badge" },
];

export const GEAR_SETS: GearSet[] = [
  {
    id: "vanguard", name: "Vanguard Set", description: "Frontline combat gear with offense bonuses.",
    pieces: 6,
    twoPieceBonus: { attack: 15, critChance: 3 },
    fourPieceBonus: { attack: 30, critDamage: 10, speed: 5 },
    sixPieceBonus: { attack: 50, critChance: 8, critDamage: 20, speed: 10 },
  },
  {
    id: "bastion", name: "Bastion Set", description: "Defensive gear with survivability bonuses.",
    pieces: 6,
    twoPieceBonus: { defense: 20, block: 5 },
    fourPieceBonus: { defense: 40, health: 100, block: 10 },
    sixPieceBonus: { defense: 70, health: 200, block: 20, dodge: 5 },
  },
  {
    id: "shadow", name: "Shadow Set", description: "Evasion and speed focused gear.",
    pieces: 6,
    twoPieceBonus: { speed: 10, dodge: 5 },
    fourPieceBonus: { speed: 20, dodge: 12, critChance: 5 },
    sixPieceBonus: { speed: 35, dodge: 20, critChance: 10, critDamage: 15 },
  },
  {
    id: "commander", name: "Commander's Set", description: "Leadership gear with morale and experience bonuses.",
    pieces: 6,
    twoPieceBonus: { moraleBonus: 10, experienceBonus: 5 },
    fourPieceBonus: { moraleBonus: 20, experienceBonus: 12, attack: 10, defense: 10 },
    sixPieceBonus: { moraleBonus: 35, experienceBonus: 20, attack: 25, defense: 25, health: 100 },
  },
  {
    id: "warlord", name: "Warlord Set", description: "Balanced PvP gear with strong all-around stats.",
    pieces: 6,
    twoPieceBonus: { attack: 10, defense: 10 },
    fourPieceBonus: { attack: 20, defense: 20, health: 80, critChance: 4 },
    sixPieceBonus: { attack: 35, defense: 35, health: 160, critChance: 8, speed: 8 },
  },
];

export const COMMANDER_GEAR_CATALOG: GearItem[] = [
  // === WEAPONS: Kinetic Class (Assault / Recon) ===
  { id: "cg-weapon-k-1", name: "Pulse Carbine", description: "Standard kinetic pulse rifle.", slot: "weapon", category: "weapon", gearClass: "kinetic", gearSubClass: "assault", rarity: "common", tier: 1, level: 1, maxLevel: 10, stats: { attack: 8 }, source: "craft", requiredLevel: 1, upgradeCost: { metal: 200, crystal: 100, deuterium: 50, gold: 50 } },
  { id: "cg-weapon-k-2", name: "Sniper Rifle", description: "Long-range kinetic precision weapon.", slot: "weapon", category: "weapon", gearClass: "kinetic", gearSubClass: "recon", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { attack: 15, critChance: 3 }, source: "craft", requiredLevel: 5, upgradeCost: { metal: 400, crystal: 200, deuterium: 100, gold: 100 } },

  // === WEAPONS: Plasma Class (Berserker / Tactician) ===
  { id: "cg-weapon-p-1", name: "Plasma Blade", description: "Superheated plasma edge weapon.", slot: "weapon", category: "weapon", gearClass: "plasma", gearSubClass: "berserker", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { attack: 14, critDamage: 5 }, source: "craft", requiredLevel: 5, upgradeCost: { metal: 350, crystal: 250, deuterium: 120, gold: 80 } },
  { id: "cg-weapon-p-2", name: "Plasma Cannon", description: "Short-range plasma devastation.", slot: "weapon", category: "weapon", gearClass: "plasma", gearSubClass: "tactician", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 25, critChance: 4, critDamage: 8 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 800, crystal: 400, deuterium: 200, gold: 200 } },

  // === WEAPONS: Ion Class (Sentinel / Vanguard) ===
  { id: "cg-weapon-i-1", name: "Ion Pistols", description: "Twin ion discharge sidearms.", slot: "weapon", category: "weapon", gearClass: "ion", gearSubClass: "sentinel", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 22, speed: 5, critChance: 3 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 600, crystal: 500, deuterium: 250, gold: 150 } },
  { id: "cg-weapon-i-2", name: "Ion Greatsword", description: "Massive ion-infused two-hander.", slot: "weapon", category: "weapon", gearClass: "ion", gearSubClass: "vanguard", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 40, critChance: 6, critDamage: 15 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 1600, crystal: 800, deuterium: 400, gold: 400 } },

  // === WEAPONS: Rail Class (Sharpshooter / Breaker) ===
  { id: "cg-weapon-r-1", name: "Rail Carbine", description: "Magnetic rail accelerated carbine.", slot: "weapon", category: "weapon", gearClass: "rail", gearSubClass: "sharpshooter", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 38, critChance: 8, critDamage: 12 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 1400, crystal: 900, deuterium: 500, gold: 350 } },
  { id: "cg-weapon-r-2", name: "Rail Hammer", description: "Magnetic rail hammer for siege.", slot: "weapon", category: "weapon", gearClass: "rail", gearSubClass: "breaker", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { attack: 60, critDamage: 20, block: 5 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 3000, crystal: 1500, deuterium: 800, gold: 700 } },

  // === WEAPONS: Particle Class (Warlock / Adept) ===
  { id: "cg-weapon-pt-1", name: "Particle Staff", description: "Focused particle beam staff.", slot: "weapon", category: "weapon", gearClass: "particle", gearSubClass: "warlock", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { attack: 55, critChance: 10, critDamage: 22 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 2800, crystal: 1600, deuterium: 750, gold: 650 } },
  { id: "cg-weapon-pt-2", name: "Particle Gauntlets", description: "Twin particle fist weapons.", slot: "weapon", category: "weapon", gearClass: "particle", gearSubClass: "adept", rarity: "mythic", tier: 9, level: 1, maxLevel: 40, stats: { attack: 80, critChance: 12, critDamage: 30, speed: 8 }, source: "event", requiredLevel: 40, upgradeCost: { metal: 5000, crystal: 2500, deuterium: 1200, gold: 1000 } },

  // === WEAPONS: Gravity Class (Juggernaut / Enforcer) ===
  { id: "cg-weapon-g-1", name: "Gravity Maul", description: "Gravity-warped heavy mace.", slot: "weapon", category: "weapon", gearClass: "gravity", gearSubClass: "juggernaut", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 42, block: 8, health: 50 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 1500, crystal: 800, deuterium: 450, gold: 400 } },
  { id: "cg-weapon-g-2", name: "Void Reaper", description: "Forged in a dying star's core.", slot: "weapon", category: "weapon", gearClass: "gravity", gearSubClass: "enforcer", rarity: "mythic", tier: 10, level: 1, maxLevel: 40, stats: { attack: 100, critChance: 15, critDamage: 35, speed: 10 }, source: "event", requiredLevel: 40, upgradeCost: { metal: 6400, crystal: 3200, deuterium: 1600, gold: 1600 } },

  // === ARMOR: Plate Class (Fortified / Guardian) ===
  { id: "cg-armor-pl-1", name: "Steel Plate", description: "Basic plate armor vest.", slot: "armor", category: "armor", gearClass: "plate", gearSubClass: "fortified", rarity: "common", tier: 1, level: 1, maxLevel: 10, stats: { defense: 5, health: 20 }, source: "craft", requiredLevel: 1, upgradeCost: { metal: 150, crystal: 80, deuterium: 30, gold: 40 } },
  { id: "cg-armor-pl-2", name: "Titanium Guard", description: "Reinforced titanium plate.", slot: "armor", category: "armor", gearClass: "plate", gearSubClass: "guardian", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { defense: 12, health: 50, block: 3 }, source: "craft", requiredLevel: 5, upgradeCost: { metal: 300, crystal: 160, deuterium: 80, gold: 80 } },

  // === ARMOR: Composite Class (Phantom / Ghost) ===
  { id: "cg-armor-c-1", name: "Composite Vest", description: "Hardened composite armor.", slot: "armor", category: "armor", gearClass: "composite", gearSubClass: "phantom", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { defense: 20, health: 80, dodge: 4 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 600, crystal: 320, deuterium: 160, gold: 160 } },
  { id: "cg-armor-c-2", name: "Ghost Suit", description: "Lightweight composite stealth armor.", slot: "armor", category: "armor", gearClass: "composite", gearSubClass: "ghost", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { defense: 15, health: 60, dodge: 8, speed: 5 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 500, crystal: 400, deuterium: 180, gold: 140 } },

  // === ARMOR: Nano Class (Regenerative / Adaptive) ===
  { id: "cg-armor-n-1", name: "Nano Mesh Suit", description: "Self-repairing nanofiber suit.", slot: "armor", category: "armor", gearClass: "nano", gearSubClass: "regenerative", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { defense: 35, health: 160, block: 8, dodge: 5 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 1200, crystal: 640, deuterium: 320, gold: 320 } },
  { id: "cg-armor-n-2", name: "Adaptive Shell", description: "Nanites that adapt to incoming damage.", slot: "armor", category: "armor", gearClass: "nano", gearSubClass: "adaptive", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { defense: 55, health: 250, block: 12, dodge: 8 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 2400, crystal: 1280, deuterium: 640, gold: 640 } },

  // === ARMOR: Reactive Class (Bulwark / Titan) ===
  { id: "cg-armor-r-1", name: "Reactive Plating", description: "Explosive reactive armor.", slot: "armor", category: "armor", gearClass: "reactive", gearSubClass: "bulwark", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { defense: 60, health: 300, block: 15, dodge: 10 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 2800, crystal: 1400, deuterium: 700, gold: 700 } },
  { id: "cg-armor-r-2", name: "Titan Plate", description: "Megastructure-grade titanium armor.", slot: "armor", category: "armor", gearClass: "reactive", gearSubClass: "titan", rarity: "mythic", tier: 9, level: 1, maxLevel: 40, stats: { defense: 85, health: 450, block: 20, dodge: 12 }, source: "raid", requiredLevel: 40, upgradeCost: { metal: 5000, crystal: 2500, deuterium: 1200, gold: 1200 } },

  // === ARMOR: Aegis Class (Protector / Warden) ===
  { id: "cg-armor-a-1", name: "Aegis Breastplate", description: "Energy-augmented armor.", slot: "armor", category: "armor", gearClass: "aegis", gearSubClass: "protector", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { defense: 38, health: 180, block: 10, dodge: 6 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 1300, crystal: 700, deuterium: 350, gold: 350 } },
  { id: "cg-armor-a-2", name: "Warden's Mantle", description: "Commander-grade protective mantle.", slot: "armor", category: "armor", gearClass: "aegis", gearSubClass: "warden", rarity: "mythic", tier: 10, level: 1, maxLevel: 40, stats: { defense: 95, health: 500, block: 25, dodge: 15, moraleBonus: 10 }, source: "event", requiredLevel: 40, upgradeCost: { metal: 6000, crystal: 3000, deuterium: 1500, gold: 1500 } },

  // === SHIELDS: Energy Class (Deflector / Reflector) ===
  { id: "cg-shield-e-1", name: "Energy Buckler", description: "Small energy shield generator.", slot: "shield", category: "shield", gearClass: "energy", gearSubClass: "deflector", rarity: "common", tier: 1, level: 1, maxLevel: 10, stats: { defense: 3, block: 5 }, source: "craft", requiredLevel: 1, upgradeCost: { metal: 100, crystal: 150, deuterium: 40, gold: 30 } },
  { id: "cg-shield-e-2", name: "Reflector Array", description: "Energy reflection shield system.", slot: "shield", category: "shield", gearClass: "energy", gearSubClass: "reflector", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { defense: 8, block: 10, health: 30 }, source: "craft", requiredLevel: 5, upgradeCost: { metal: 200, crystal: 300, deuterium: 80, gold: 60 } },

  // === SHIELDS: Phase Class (Phasewall / Void) ===
  { id: "cg-shield-ph-1", name: "Phasewall Shield", description: "Dimensional phase barrier.", slot: "shield", category: "shield", gearClass: "phase", gearSubClass: "phasewall", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { defense: 15, block: 18, health: 70, dodge: 2 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 400, crystal: 600, deuterium: 160, gold: 120 } },
  { id: "cg-shield-ph-2", name: "Void Shield", description: "Null-energy void barrier.", slot: "shield", category: "shield", gearClass: "phase", gearSubClass: "void", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { defense: 28, block: 25, health: 120, dodge: 6 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 800, crystal: 1200, deuterium: 400, gold: 300 } },

  // === SHIELDS: Gravity Class (Nullfield / Warp) ===
  { id: "cg-shield-g-1", name: "Nullfield Generator", description: "Gravity nullification barrier.", slot: "shield", category: "shield", gearClass: "gravity", gearSubClass: "nullfield", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { defense: 30, block: 22, health: 100, dodge: 8 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 900, crystal: 1100, deuterium: 380, gold: 320 } },
  { id: "cg-shield-g-2", name: "Warp Barrier", description: "Warp-space dimensional shield.", slot: "shield", category: "shield", gearClass: "gravity", gearSubClass: "warp", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { defense: 45, block: 30, health: 180, dodge: 10 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 1800, crystal: 2400, deuterium: 800, gold: 600 } },

  // === SHIELDS: Quantum Class (Entangle / Flux) ===
  { id: "cg-shield-q-1", name: "Entangle Barrier", description: "Quantum-entangled defense grid.", slot: "shield", category: "shield", gearClass: "quantum", gearSubClass: "entangle", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { defense: 48, block: 28, health: 200, dodge: 12 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 2000, crystal: 2000, deuterium: 900, gold: 700 } },
  { id: "cg-shield-q-2", name: "Flux Aegis", description: "Probability-manipulating quantum shield.", slot: "shield", category: "shield", gearClass: "quantum", gearSubClass: "flux", rarity: "mythic", tier: 10, level: 1, maxLevel: 40, stats: { defense: 70, block: 35, health: 350, dodge: 18 }, source: "event", requiredLevel: 40, upgradeCost: { metal: 4000, crystal: 4000, deuterium: 1600, gold: 1200 } },

  // === HELMETS: Tactical Class (Marksman / Spotter) ===
  { id: "cg-helmet-t-1", name: "Tactical Visor", description: "Standard targeting visor.", slot: "helmet", category: "helmet", gearClass: "tactical", gearSubClass: "marksman", rarity: "common", tier: 1, level: 1, maxLevel: 10, stats: { critChance: 2, speed: 2 }, source: "craft", requiredLevel: 1, upgradeCost: { metal: 100, crystal: 120, deuterium: 30, gold: 40 } },
  { id: "cg-helmet-t-2", name: "Spotter Helm", description: "Reconnaissance targeting helmet.", slot: "helmet", category: "helmet", gearClass: "tactical", gearSubClass: "spotter", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { critChance: 5, speed: 5, experienceBonus: 3 }, source: "craft", requiredLevel: 5, upgradeCost: { metal: 200, crystal: 240, deuterium: 60, gold: 80 } },

  // === HELMETS: Neural Class (Psionic / Cerebral) ===
  { id: "cg-helmet-n-1", name: "Psionic Crown", description: "Psionic amplification headgear.", slot: "helmet", category: "helmet", gearClass: "neural", gearSubClass: "psionic", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { critChance: 8, speed: 8, experienceBonus: 6 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 350, crystal: 500, deuterium: 150, gold: 150 } },
  { id: "cg-helmet-n-2", name: "Cerebral Interface", description: "Direct brain-machine interface.", slot: "helmet", category: "helmet", gearClass: "neural", gearSubClass: "cerebral", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { critChance: 10, speed: 10, experienceBonus: 10, moraleBonus: 5 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 700, crystal: 900, deuterium: 300, gold: 250 } },

  // === HELMETS: Crown Class (Commander / Overlord) ===
  { id: "cg-helmet-cr-1", name: "Crown of Command", description: "Leadership amplifier crown.", slot: "helmet", category: "helmet", gearClass: "crown", gearSubClass: "commander", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { critChance: 8, speed: 8, experienceBonus: 6, moraleBonus: 5 }, source: "quest", requiredLevel: 10, upgradeCost: { metal: 400, crystal: 480, deuterium: 120, gold: 160 } },
  { id: "cg-helmet-cr-2", name: "Overlord Helm", description: "Supreme command authority helm.", slot: "helmet", category: "helmet", gearClass: "crown", gearSubClass: "overlord", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { critChance: 14, speed: 14, experienceBonus: 15, moraleBonus: 12 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 1600, crystal: 2000, deuterium: 600, gold: 500 } },

  // === HELMETS: Visor Class (Hunter / Predator) ===
  { id: "cg-helmet-v-1", name: "Hunter Visor", description: "Predator tracking headgear.", slot: "helmet", category: "helmet", gearClass: "visor", gearSubClass: "hunter", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { critChance: 12, critDamage: 10, speed: 6 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 800, crystal: 800, deuterium: 350, gold: 300 } },
  { id: "cg-helmet-v-2", name: "Predator Crown", description: "Apex predator sensory crown.", slot: "helmet", category: "helmet", gearClass: "visor", gearSubClass: "predator", rarity: "mythic", tier: 9, level: 1, maxLevel: 40, stats: { critChance: 18, critDamage: 20, speed: 12, dodge: 8 }, source: "event", requiredLevel: 40, upgradeCost: { metal: 3000, crystal: 3000, deuterium: 1200, gold: 1000 } },

  // === BOOTS: Sprint Class (Striker / Charger) ===
  { id: "cg-boots-s-1", name: "Combat Boots", description: "Standard military boots.", slot: "boots", category: "boots", gearClass: "sprint", gearSubClass: "striker", rarity: "common", tier: 1, level: 1, maxLevel: 10, stats: { speed: 5, dodge: 2 }, source: "craft", requiredLevel: 1, upgradeCost: { metal: 80, crystal: 60, deuterium: 20, gold: 30 } },
  { id: "cg-boots-s-2", name: "Charger Greaves", description: "Charge-boosting leg armor.", slot: "boots", category: "boots", gearClass: "sprint", gearSubClass: "charger", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { speed: 10, dodge: 5, attack: 3 }, source: "craft", requiredLevel: 5, upgradeCost: { metal: 160, crystal: 120, deuterium: 40, gold: 60 } },

  // === BOOTS: Phase Class (Phasewalker / Voidrunner) ===
  { id: "cg-boots-ph-1", name: "Phase Walkers", description: "Phase-shifting movement boots.", slot: "boots", category: "boots", gearClass: "phase", gearSubClass: "phasewalker", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { speed: 18, dodge: 10, attack: 6, defense: 4 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 320, crystal: 240, deuterium: 80, gold: 120 } },
  { id: "cg-boots-ph-2", name: "Voidrunner Treads", description: "Void-touched sprinting boots.", slot: "boots", category: "boots", gearClass: "phase", gearSubClass: "voidrunner", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { speed: 28, dodge: 15, attack: 10, critChance: 4 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 640, crystal: 480, deuterium: 160, gold: 200 } },

  // === BOOTS: Graviton Class (Float / Drifter) ===
  { id: "cg-boots-g-1", name: "Graviton Striders", description: "Gravity-defying combat boots.", slot: "boots", category: "boots", gearClass: "graviton", gearSubClass: "float", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { speed: 25, dodge: 12, defense: 8 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 700, crystal: 500, deuterium: 180, gold: 220 } },
  { id: "cg-boots-g-2", name: "Drift Walker", description: "Zero-gravity maneuvering boots.", slot: "boots", category: "boots", gearClass: "graviton", gearSubClass: "drifter", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { speed: 35, dodge: 18, defense: 12, health: 50 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 1400, crystal: 1000, deuterium: 400, gold: 400 } },

  // === BOOTS: Stealth Class (Shadow / Phantom) ===
  { id: "cg-boots-st-1", name: "Shadow Treads", description: "Sound-dampening stealth boots.", slot: "boots", category: "boots", gearClass: "stealth", gearSubClass: "shadow", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { speed: 32, dodge: 22, critChance: 8 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 1500, crystal: 1200, deuterium: 500, gold: 450 } },
  { id: "cg-boots-st-2", name: "Phantom Stride", description: "Phase-walking assassin boots.", slot: "boots", category: "boots", gearClass: "stealth", gearSubClass: "phantom", rarity: "mythic", tier: 10, level: 1, maxLevel: 40, stats: { speed: 45, dodge: 28, critChance: 12, critDamage: 15 }, source: "event", requiredLevel: 40, upgradeCost: { metal: 3000, crystal: 2400, deuterium: 1000, gold: 800 } },

  // === ACCESSORIES: Power Class (Cell / Catalyst) ===
  { id: "cg-acc-pw-1", name: "Power Cell", description: "Basic energy storage unit.", slot: "accessory", category: "accessory", gearClass: "power", gearSubClass: "cell", rarity: "common", tier: 1, level: 1, maxLevel: 10, stats: { attack: 3, defense: 3 }, source: "craft", requiredLevel: 1, upgradeCost: { metal: 60, crystal: 80, deuterium: 20, gold: 20 } },
  { id: "cg-acc-pw-2", name: "Energy Catalyst", description: "Amplifies all energy systems.", slot: "accessory", category: "accessory", gearClass: "power", gearSubClass: "catalyst", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { attack: 6, defense: 5, health: 20 }, source: "craft", requiredLevel: 5, upgradeCost: { metal: 120, crystal: 160, deuterium: 40, gold: 40 } },

  // === ACCESSORIES: Adrenaline Class (Booster / Overdrive) ===
  { id: "cg-acc-ad-1", name: "Adrenaline Booster", description: "Combat performance enhancer.", slot: "accessory", category: "accessory", gearClass: "adrenaline", gearSubClass: "booster", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { attack: 6, speed: 5, critChance: 3 }, source: "craft", requiredLevel: 5, upgradeCost: { metal: 120, crystal: 160, deuterium: 40, gold: 40 } },
  { id: "cg-acc-ad-2", name: "Overdrive Module", description: "Pushes combat systems beyond limits.", slot: "accessory", category: "accessory", gearClass: "adrenaline", gearSubClass: "overdrive", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 12, speed: 8, critChance: 6, critDamage: 5 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 250, crystal: 300, deuterium: 100, gold: 100 } },

  // === ACCESSORIES: Quantum Class (Amulet / Relic) ===
  { id: "cg-acc-qt-1", name: "Quantum Amulet", description: "Phase-entangled energy amulet.", slot: "accessory", category: "accessory", gearClass: "quantum", gearSubClass: "amulet", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 10, defense: 10, health: 50, critChance: 5 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 240, crystal: 320, deuterium: 80, gold: 80 } },
  { id: "cg-acc-qt-2", name: "Quantum Relic", description: "Quantum-entangled power source.", slot: "accessory", category: "accessory", gearClass: "quantum", gearSubClass: "relic", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 18, defense: 18, health: 100, critChance: 8, speed: 5 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 500, crystal: 600, deuterium: 200, gold: 180 } },

  // === ACCESSORIES: Tech Class (Core / Matrix) ===
  { id: "cg-acc-tc-1", name: "Tech Core", description: "Central processing tech unit.", slot: "accessory", category: "accessory", gearClass: "tech", gearSubClass: "core", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 15, defense: 15, experienceBonus: 8 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 600, crystal: 700, deuterium: 250, gold: 200 } },
  { id: "cg-acc-tc-2", name: "Neural Matrix", description: "Neural network processing matrix.", slot: "accessory", category: "accessory", gearClass: "tech", gearSubClass: "matrix", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { attack: 22, defense: 22, experienceBonus: 12, moraleBonus: 8, speed: 5 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 1200, crystal: 1400, deuterium: 500, gold: 400 } },

  // === RELICS: Ancient Class (Core / Fragment) ===
  { id: "cg-relic-an-1", name: "Ancient Data Core", description: "Fragment of an ancient civilization.", slot: "relic", category: "relic", gearClass: "ancient", gearSubClass: "core", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { experienceBonus: 10, moraleBonus: 5 }, source: "quest", requiredLevel: 10, upgradeCost: { metal: 200, crystal: 400, deuterium: 100, gold: 100 } },
  { id: "cg-relic-an-2", name: "Ancient Fragment", description: "Shard of a forgotten technology.", slot: "relic", category: "relic", gearClass: "ancient", gearSubClass: "fragment", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 10, defense: 10, experienceBonus: 15, moraleBonus: 8 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 400, crystal: 800, deuterium: 200, gold: 200 } },

  // === RELICS: Stellar Class (Compass / Nexus) ===
  { id: "cg-relic-st-1", name: "Stellar Compass", description: "Navigation relic from a fallen empire.", slot: "relic", category: "relic", gearClass: "stellar", gearSubClass: "compass", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { speed: 12, experienceBonus: 15, dodge: 8 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 500, crystal: 800, deuterium: 200, gold: 200 } },
  { id: "cg-relic-st-2", name: "Stellar Nexus", description: "Star-bridge navigation nexus.", slot: "relic", category: "relic", gearClass: "stellar", gearSubClass: "nexus", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { speed: 18, experienceBonus: 20, dodge: 12, attack: 8, defense: 8 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 1000, crystal: 1600, deuterium: 500, gold: 400 } },

  // === RELICS: Void Class (Shard / Echo) ===
  { id: "cg-relic-v-1", name: "Void Shard", description: "Crystallized void energy fragment.", slot: "relic", category: "relic", gearClass: "void", gearSubClass: "shard", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { attack: 15, defense: 15, critChance: 10, experienceBonus: 12 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 1200, crystal: 1200, deuterium: 600, gold: 500 } },
  { id: "cg-relic-v-2", name: "Void Echo", description: "Resonating echo from the void.", slot: "relic", category: "relic", gearClass: "void", gearSubClass: "echo", rarity: "mythic", tier: 10, level: 1, maxLevel: 40, stats: { attack: 25, defense: 25, critChance: 15, critDamage: 15, experienceBonus: 20 }, source: "event", requiredLevel: 40, upgradeCost: { metal: 3000, crystal: 3000, deuterium: 1200, gold: 1000 } },

  // === PETS: Beast Class (Hawk / Wolf) ===
  { id: "cg-pet-b-1", name: "War Hawk", description: "Loyal avian companion.", slot: "pet", category: "pet", gearClass: "beast", gearSubClass: "hawk", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { speed: 5, critChance: 3, dodge: 3 }, source: "quest", requiredLevel: 5, upgradeCost: { metal: 150, crystal: 100, deuterium: 50, gold: 50 } },
  { id: "cg-pet-b-2", name: "Battle Wolf", description: "Fierce combat companion.", slot: "pet", category: "pet", gearClass: "beast", gearSubClass: "wolf", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 8, speed: 8, critChance: 5, health: 30 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 300, crystal: 200, deuterium: 100, gold: 100 } },

  // === PETS: Mech Class (Drone / Turret) ===
  { id: "cg-pet-m-1", name: "Combat Drone", description: "Autonomous combat drone.", slot: "pet", category: "pet", gearClass: "mech", gearSubClass: "drone", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 10, defense: 5, speed: 5 }, source: "drop", requiredLevel: 10, upgradeCost: { metal: 400, crystal: 300, deuterium: 120, gold: 100 } },
  { id: "cg-pet-m-2", name: "Auto Turret", description: "Automated defense turret.", slot: "pet", category: "pet", gearClass: "mech", gearSubClass: "turret", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 18, defense: 12, block: 8 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 800, crystal: 600, deuterium: 250, gold: 200 } },

  // === PETS: Ethereal Class (Wisp / Shade) ===
  { id: "cg-pet-e-1", name: "Spirit Wisp", description: "Ethereal energy companion.", slot: "pet", category: "pet", gearClass: "ethereal", gearSubClass: "wisp", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { experienceBonus: 10, moraleBonus: 8, dodge: 5 }, source: "raid", requiredLevel: 20, upgradeCost: { metal: 600, crystal: 800, deuterium: 300, gold: 250 } },
  { id: "cg-pet-e-2", name: "Void Shade", description: "Shadowy void entity companion.", slot: "pet", category: "pet", gearClass: "ethereal", gearSubClass: "shade", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { attack: 12, defense: 12, dodge: 15, critChance: 8, experienceBonus: 12 }, source: "raid", requiredLevel: 30, upgradeCost: { metal: 1200, crystal: 1200, deuterium: 500, gold: 400 } },
];

export const ARMY_GEAR_CATALOG: ArmyGearItem[] = [
  // === ARMY WEAPONS: Infantry Class ===
  { id: "ag-wp-inf-1", name: "Standard Rifle", description: "Basic infantry rifle.", slot: "weapon", rarity: "common", tier: 1, level: 1, maxLevel: 10, stats: { attack: 5 }, unitTypes: ["infantry", "ranger"], source: "craft", requiredLevel: 1, upgradeCost: { metal: 100, crystal: 50, deuterium: 20 } },
  { id: "ag-wp-inf-2", name: "Assault Rifle", description: "Fully automatic combat rifle.", slot: "weapon", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { attack: 12, critChance: 2 }, unitTypes: ["infantry"], source: "craft", requiredLevel: 5, upgradeCost: { metal: 200, crystal: 100, deuterium: 40 } },

  // === ARMY WEAPONS: Cavalry Class ===
  { id: "ag-wp-cav-1", name: "Lance Array", description: "Mounted lance weapon system.", slot: "weapon", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { attack: 14, speed: 3 }, unitTypes: ["cavalry"], source: "craft", requiredLevel: 5, upgradeCost: { metal: 220, crystal: 110, deuterium: 45 } },
  { id: "ag-wp-cav-2", name: "Plasma Lance", description: "Close-range plasma weapon.", slot: "weapon", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 20, critChance: 5, critDamage: 10 }, unitTypes: ["cavalry", "berserker"], source: "drop", requiredLevel: 10, upgradeCost: { metal: 400, crystal: 200, deuterium: 100 } },

  // === ARMY WEAPONS: Siege Class ===
  { id: "ag-wp-sie-1", name: "Heavy Cannon", description: "Siege-grade artillery piece.", slot: "weapon", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { attack: 12, critChance: 3 }, unitTypes: ["siege", "cavalry"], source: "craft", requiredLevel: 5, upgradeCost: { metal: 200, crystal: 100, deuterium: 50 } },
  { id: "ag-wp-sie-2", name: "Orbital Strike Array", description: "Satellite-linked weapon system.", slot: "weapon", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 35, critChance: 8, critDamage: 20 }, unitTypes: ["siege", "support"], source: "raid", requiredLevel: 20, upgradeCost: { metal: 800, crystal: 400, deuterium: 200 } },

  // === ARMY WEAPONS: Berserker Class ===
  { id: "ag-wp-ber-1", name: "War Axe", description: "Brutal two-handed combat axe.", slot: "weapon", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 22, critDamage: 8, health: -5 }, unitTypes: ["berserker"], source: "drop", requiredLevel: 10, upgradeCost: { metal: 350, crystal: 180, deuterium: 90 } },
  { id: "ag-wp-ber-2", name: "Void Cleaver", description: "Void-infused execution blade.", slot: "weapon", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { attack: 50, critChance: 10, critDamage: 25 }, unitTypes: ["berserker"], source: "raid", requiredLevel: 30, upgradeCost: { metal: 1500, crystal: 800, deuterium: 400 } },

  // === ARMY WEAPONS: Ranger Class ===
  { id: "ag-wp-rng-1", name: "Marksman Bow", description: "Precision long-range bow.", slot: "weapon", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 18, critChance: 8, speed: 5 }, unitTypes: ["ranger"], source: "drop", requiredLevel: 10, upgradeCost: { metal: 300, crystal: 250, deuterium: 80 } },
  { id: "ag-wp-rng-2", name: "Rail Sniper", description: "Magnetic rail sniper system.", slot: "weapon", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 30, critChance: 12, critDamage: 15 }, unitTypes: ["ranger"], source: "raid", requiredLevel: 20, upgradeCost: { metal: 700, crystal: 500, deuterium: 200 } },

  // === ARMY WEAPONS: Support Class ===
  { id: "ag-wp-sup-1", name: "Repair Beam", description: "Automated repair beam emitter.", slot: "weapon", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { health: 15, moraleBonus: 5 }, unitTypes: ["support"], source: "drop", requiredLevel: 10, upgradeCost: { metal: 250, crystal: 300, deuterium: 100 } },
  { id: "ag-wp-sup-2", name: "Nano Swarm Emitter", description: "Healing nanite swarm projector.", slot: "weapon", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { health: 30, moraleBonus: 10, defense: 5 }, unitTypes: ["support"], source: "raid", requiredLevel: 20, upgradeCost: { metal: 600, crystal: 700, deuterium: 250 } },

  // === ARMY ARMOR: Light Class ===
  { id: "ag-ar-lt-1", name: "Kevlar Vest", description: "Standard ballistic protection.", slot: "armor", rarity: "common", tier: 1, level: 1, maxLevel: 10, stats: { defense: 4, health: 15 }, unitTypes: ["infantry", "ranger"], source: "craft", requiredLevel: 1, upgradeCost: { metal: 80, crystal: 40, deuterium: 15 } },
  { id: "ag-ar-lt-2", name: "Combat Mesh", description: "Lightweight combat mesh vest.", slot: "armor", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { defense: 8, health: 30, speed: 3 }, unitTypes: ["ranger", "support"], source: "craft", requiredLevel: 5, upgradeCost: { metal: 160, crystal: 80, deuterium: 30 } },

  // === ARMY ARMOR: Medium Class ===
  { id: "ag-ar-md-1", name: "Reactive Plating", description: "Explosive reactive armor plating.", slot: "armor", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { defense: 10, health: 40, block: 3 }, unitTypes: ["cavalry", "berserker"], source: "craft", requiredLevel: 5, upgradeCost: { metal: 160, crystal: 80, deuterium: 30 } },
  { id: "ag-ar-md-2", name: "Nano Armor", description: "Self-healing nanofiber armor.", slot: "armor", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { defense: 18, health: 80, block: 6, dodge: 3 }, unitTypes: ["infantry", "cavalry", "berserker"], source: "drop", requiredLevel: 10, upgradeCost: { metal: 320, crystal: 160, deuterium: 60 } },

  // === ARMY ARMOR: Heavy Class ===
  { id: "ag-ar-hv-1", name: "Siege Plate", description: "Heavy siege-grade armor.", slot: "armor", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { defense: 22, health: 100, block: 8 }, unitTypes: ["siege", "berserker"], source: "drop", requiredLevel: 10, upgradeCost: { metal: 400, crystal: 200, deuterium: 80 } },
  { id: "ag-ar-hv-2", name: "Titan Frame", description: "Megastructure-grade heavy armor.", slot: "armor", rarity: "legendary", tier: 7, level: 1, maxLevel: 30, stats: { defense: 40, health: 200, block: 15, dodge: 5 }, unitTypes: ["siege", "berserker"], source: "raid", requiredLevel: 30, upgradeCost: { metal: 1000, crystal: 500, deuterium: 250 } },

  // === ARMY ACCESSORIES: Combat Class ===
  { id: "ag-ac-cb-1", name: "Med Kit", description: "Basic medical supplies.", slot: "accessory", rarity: "common", tier: 1, level: 1, maxLevel: 10, stats: { health: 10, moraleBonus: 3 }, unitTypes: ["support", "infantry"], source: "craft", requiredLevel: 1, upgradeCost: { metal: 50, crystal: 60, deuterium: 10 } },
  { id: "ag-ac-cb-2", name: "Combat Stim", description: "Performance-enhancing combat drugs.", slot: "accessory", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { attack: 5, speed: 5 }, unitTypes: ["infantry", "cavalry"], source: "craft", requiredLevel: 5, upgradeCost: { metal: 100, crystal: 120, deuterium: 20 } },

  // === ARMY ACCESSORIES: Tech Class ===
  { id: "ag-ac-tc-1", name: "Targeting Scope", description: "Advanced targeting system.", slot: "accessory", rarity: "uncommon", tier: 2, level: 1, maxLevel: 15, stats: { critChance: 5, attack: 4 }, unitTypes: ["ranger", "siege"], source: "craft", requiredLevel: 5, upgradeCost: { metal: 100, crystal: 120, deuterium: 20 } },
  { id: "ag-ac-tc-2", name: "Sensor Array", description: "Multi-spectrum sensor array.", slot: "accessory", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { dodge: 6, critChance: 4, speed: 4 }, unitTypes: ["ranger", "support"], source: "drop", requiredLevel: 10, upgradeCost: { metal: 200, crystal: 250, deuterium: 80 } },

  // === ARMY ACCESSORIES: Shield Class ===
  { id: "ag-ac-sh-1", name: "Energy Buckler", description: "Personal energy shield.", slot: "accessory", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { defense: 8, block: 6, health: 20 }, unitTypes: ["infantry", "cavalry"], source: "drop", requiredLevel: 10, upgradeCost: { metal: 250, crystal: 300, deuterium: 100 } },
  { id: "ag-ac-sh-2", name: "Phase Shield", description: "Dimensional phase barrier.", slot: "accessory", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { defense: 15, block: 12, health: 50, dodge: 5 }, unitTypes: ["infantry", "cavalry", "berserker"], source: "raid", requiredLevel: 20, upgradeCost: { metal: 500, crystal: 600, deuterium: 200 } },

  // === ARMY FORMATIONS: Offensive Class ===
  { id: "ag-fm-of-1", name: "Wedge Formation Badge", description: "Aggressive formation bonus.", slot: "formation", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { attack: 15, speed: 8, critChance: 4 }, unitTypes: ["infantry", "cavalry"], source: "quest", requiredLevel: 10, upgradeCost: { metal: 200, crystal: 200, deuterium: 80 } },
  { id: "ag-fm-of-2", name: "Arrow Formation Badge", description: "Fast-strike arrow formation.", slot: "formation", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { attack: 25, speed: 15, critChance: 8 }, unitTypes: ["cavalry", "ranger"], source: "raid", requiredLevel: 20, upgradeCost: { metal: 500, crystal: 500, deuterium: 200 } },

  // === ARMY FORMATIONS: Defensive Class ===
  { id: "ag-fm-df-1", name: "Phalanx Formation Badge", description: "Defensive formation bonus.", slot: "formation", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { defense: 15, health: 60, block: 8 }, unitTypes: ["infantry", "berserker"], source: "quest", requiredLevel: 10, upgradeCost: { metal: 200, crystal: 200, deuterium: 80 } },
  { id: "ag-fm-df-2", name: "Shield Wall Badge", description: "Impenetrable shield wall.", slot: "formation", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { defense: 25, health: 120, block: 15 }, unitTypes: ["infantry", "siege"], source: "raid", requiredLevel: 20, upgradeCost: { metal: 500, crystal: 500, deuterium: 200 } },

  // === ARMY FORMATIONS: Support Class ===
  { id: "ag-fm-sp-1", name: "Rally Badge", description: "Morale-boosting rally formation.", slot: "formation", rarity: "rare", tier: 3, level: 1, maxLevel: 20, stats: { moraleBonus: 15, health: 40, defense: 5 }, unitTypes: ["support", "infantry"], source: "quest", requiredLevel: 10, upgradeCost: { metal: 200, crystal: 200, deuterium: 80 } },
  { id: "ag-fm-sp-2", name: "Heal Formation Badge", description: "Restoration-focused formation.", slot: "formation", rarity: "epic", tier: 5, level: 1, maxLevel: 25, stats: { health: 80, moraleBonus: 20, dodge: 5 }, unitTypes: ["support"], source: "raid", requiredLevel: 20, upgradeCost: { metal: 500, crystal: 500, deuterium: 200 } },
];

export const ARMY_GEAR_TOTAL = ARMY_GEAR_CATALOG.length;
export const COMMANDER_GEAR_TOTAL = COMMANDER_GEAR_CATALOG.length;
export const TOTAL_GEAR_ITEMS = COMMANDER_GEAR_TOTAL + ARMY_GEAR_TOTAL;

export function getGearBySlot(catalog: GearItem[], slot: GearSlot): GearItem[] {
  return catalog.filter(item => item.slot === slot);
}

export function getGearByRarity<T extends { rarity: GearRarity }>(items: T[], rarity: GearRarity): T[] {
  return items.filter(item => item.rarity === rarity);
}

export function getArmyGearByUnitType(catalog: ArmyGearItem[], unitType: string): ArmyGearItem[] {
  return catalog.filter(item => item.unitTypes.includes(unitType));
}

export function getTotalGearStats(equipped: Record<string, GearItem | null>): Partial<GearStatBlock> {
  const totals: Partial<GearStatBlock> = {};
  for (const item of Object.values(equipped)) {
    if (!item) continue;
    for (const [stat, value] of Object.entries(item.stats)) {
      const key = stat as keyof GearStatBlock;
      (totals as any)[key] = ((totals as any)[key] || 0) + (value || 0);
    }
  }
  return totals;
}

export function getActiveSetBonuses(equipped: Record<string, GearItem | null>): { set: GearSet; count: number; bonuses: Partial<GearStatBlock> }[] {
  const setCounts: Record<string, number> = {};
  for (const item of Object.values(equipped)) {
    if (item?.setId) {
      setCounts[item.setId] = (setCounts[item.setId] || 0) + 1;
    }
  }

  const activeSets: { set: GearSet; count: number; bonuses: Partial<GearStatBlock> }[] = [];
  for (const [setId, count] of Object.entries(setCounts)) {
    const set = GEAR_SETS.find(s => s.id === setId);
    if (!set || count < 2) continue;

    const bonuses: Partial<GearStatBlock> = {};
    if (count >= 2) Object.assign(bonuses, set.twoPieceBonus);
    if (count >= 4) Object.assign(bonuses, set.fourPieceBonus);
    if (count >= 6) Object.assign(bonuses, set.sixPieceBonus);
    activeSets.push({ set, count, bonuses });
  }
  return activeSets;
}
