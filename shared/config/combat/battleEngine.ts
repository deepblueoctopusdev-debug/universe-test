import { GearItem, GearRarity, GearStatBlock, RARITY_MULTIPLIER, calculateItemPower } from "../gearSystem";
import { RaidBoss, RaidDifficulty, BossElement, RAID_DIFFICULTY_CONFIG } from "../raidConfig";

// ============================================================
// COMBAT BATTLE ENGINE - Complete Game Engine System
// ============================================================

// --- Element System ---
export type CombatElement = "physical" | "energy" | "void" | "psionic" | "biological" | "mechanical";

export const ELEMENT_ADVANTAGE: Record<CombatElement, CombatElement[]> = {
  physical: ["mechanical"],
  energy: ["physical", "biological"],
  void: ["energy", "psionic"],
  psionic: ["void", "mechanical"],
  biological: ["psionic", "mechanical"],
  mechanical: ["biological", "void"],
};

export const ELEMENT_DISADVANTAGE: Record<CombatElement, CombatElement[]> = {
  physical: ["energy"],
  energy: ["void"],
  void: ["biological"],
  psionic: ["biological"],
  biological: ["energy"],
  mechanical: ["physical", "psionic"],
};

export const ELEMENT_MULTIPLIER = 1.25;
export const ELEMENT_DISADVANTAGE_MULTIPLIER = 0.75;

// --- Unit Types ---
export type UnitCategory = "infantry" | "cavalry" | "siege" | "ranger" | "berserker" | "support";

export interface UnitType {
  id: string;
  name: string;
  category: UnitCategory;
  baseAttack: number;
  baseDefense: number;
  baseHealth: number;
  baseSpeed: number;
  baseCritChance: number;
  baseCritDamage: number;
  baseDodge: number;
  baseBlock: number;
  attackType: CombatElement;
  defenseType: CombatElement;
  cost: { metal: number; crystal: number; deuterium: number };
  trainingTimeSec: number;
  tier: 1 | 2 | 3 | 4 | 5;
  description: string;
  strongAgainst: UnitCategory[];
  weakAgainst: UnitCategory[];
}

export const UNIT_TYPES: Record<string, UnitType> = {
  // === INFANTRY (Tier 1-2) ===
  recruit: { id: "recruit", name: "Recruit", category: "infantry", baseAttack: 10, baseDefense: 8, baseHealth: 50, baseSpeed: 10, baseCritChance: 5, baseCritDamage: 50, baseDodge: 2, baseBlock: 5, attackType: "physical", defenseType: "physical", cost: { metal: 50, crystal: 20, deuterium: 10 }, trainingTimeSec: 60, tier: 1, description: "Basic infantry soldier.", strongAgainst: ["ranger"], weakAgainst: ["cavalry", "siege"] },
  soldier: { id: "soldier", name: "Soldier", category: "infantry", baseAttack: 18, baseDefense: 14, baseHealth: 90, baseSpeed: 12, baseCritChance: 7, baseCritDamage: 55, baseDodge: 3, baseBlock: 8, attackType: "physical", defenseType: "physical", cost: { metal: 100, crystal: 40, deuterium: 20 }, trainingTimeSec: 120, tier: 1, description: "Trained combat soldier.", strongAgainst: ["ranger"], weakAgainst: ["cavalry", "siege"] },
  veteran: { id: "veteran", name: "Veteran", category: "infantry", baseAttack: 28, baseDefense: 22, baseHealth: 150, baseSpeed: 14, baseCritChance: 9, baseCritDamage: 60, baseDodge: 4, baseBlock: 12, attackType: "physical", defenseType: "physical", cost: { metal: 200, crystal: 80, deuterium: 40 }, trainingTimeSec: 300, tier: 2, description: "Battle-hardened veteran.", strongAgainst: ["ranger"], weakAgainst: ["cavalry", "siege"] },
  elite: { id: "elite", name: "Elite Infantry", category: "infantry", baseAttack: 40, baseDefense: 35, baseHealth: 250, baseSpeed: 16, baseCritChance: 11, baseCritDamage: 65, baseDodge: 5, baseBlock: 16, attackType: "physical", defenseType: "physical", cost: { metal: 400, crystal: 160, deuterium: 80 }, trainingTimeSec: 600, tier: 2, description: "Elite shock trooper.", strongAgainst: ["ranger"], weakAgainst: ["cavalry", "siege"] },

  // === CAVALRY (Tier 1-3) ===
  scout_cav: { id: "scout_cav", name: "Scout Cavalry", category: "cavalry", baseAttack: 15, baseDefense: 6, baseHealth: 40, baseSpeed: 25, baseCritChance: 10, baseCritDamage: 60, baseDodge: 12, baseBlock: 2, attackType: "physical", defenseType: "physical", cost: { metal: 80, crystal: 30, deuterium: 15 }, trainingTimeSec: 90, tier: 1, description: "Fast reconnaissance cavalry.", strongAgainst: ["ranger", "siege"], weakAgainst: ["infantry", "berserker"] },
  lancer: { id: "lancer", name: "Lancer", category: "cavalry", baseAttack: 30, baseDefense: 12, baseHealth: 80, baseSpeed: 22, baseCritChance: 12, baseCritDamage: 65, baseDodge: 10, baseBlock: 3, attackType: "physical", defenseType: "physical", cost: { metal: 180, crystal: 60, deuterium: 30 }, trainingTimeSec: 240, tier: 2, description: "Mounted lancer shock trooper.", strongAgainst: ["ranger", "siege"], weakAgainst: ["infantry", "berserker"] },
  knight: { id: "knight", name: "Knight", category: "cavalry", baseAttack: 50, baseDefense: 25, baseHealth: 180, baseSpeed: 20, baseCritChance: 14, baseCritDamage: 70, baseDodge: 8, baseBlock: 6, attackType: "physical", defenseType: "physical", cost: { metal: 400, crystal: 150, deuterium: 75 }, trainingTimeSec: 600, tier: 3, description: "Heavy cavalry knight.", strongAgainst: ["ranger", "siege"], weakAgainst: ["infantry", "berserker"] },

  // === BERSERKER (Tier 2-4) ===
  berserker: { id: "berserker", name: "Berserker", category: "berserker", baseAttack: 35, baseDefense: 5, baseHealth: 60, baseSpeed: 18, baseCritChance: 15, baseCritDamage: 80, baseDodge: 6, baseBlock: 0, attackType: "physical", defenseType: "physical", cost: { metal: 150, crystal: 50, deuterium: 25 }, trainingTimeSec: 180, tier: 2, description: "Frenzied melee attacker.", strongAgainst: ["cavalry", "infantry"], weakAgainst: ["ranger", "siege"] },
  warlord: { id: "warlord", name: "Warlord", category: "berserker", baseAttack: 60, baseDefense: 8, baseHealth: 120, baseSpeed: 16, baseCritChance: 18, baseCritDamage: 90, baseDodge: 7, baseBlock: 0, attackType: "physical", defenseType: "physical", cost: { metal: 350, crystal: 120, deuterium: 60 }, trainingTimeSec: 480, tier: 3, description: "Devastating berserker warlord.", strongAgainst: ["cavalry", "infantry"], weakAgainst: ["ranger", "siege"] },
  titan: { id: "titan", name: "Titan", category: "berserker", baseAttack: 90, baseDefense: 12, baseHealth: 200, baseSpeed: 14, baseCritChance: 20, baseCritDamage: 100, baseDodge: 8, baseBlock: 0, attackType: "physical", defenseType: "physical", cost: { metal: 700, crystal: 250, deuterium: 125 }, trainingTimeSec: 900, tier: 4, description: "Colossal berserker titan.", strongAgainst: ["cavalry", "infantry"], weakAgainst: ["ranger", "siege"] },

  // === SIEGE (Tier 1-3) ===
  catapult: { id: "catapult", name: "Catapult", category: "siege", baseAttack: 25, baseDefense: 3, baseHealth: 30, baseSpeed: 5, baseCritChance: 8, baseCritDamage: 70, baseDodge: 0, baseBlock: 0, attackType: "energy", defenseType: "mechanical", cost: { metal: 120, crystal: 50, deuterium: 20 }, trainingTimeSec: 120, tier: 1, description: "Basic siege weapon.", strongAgainst: ["infantry", "berserker"], weakAgainst: ["cavalry", "ranger"] },
  trebuchet: { id: "trebuchet", name: "Trebuchet", category: "siege", baseAttack: 45, baseDefense: 5, baseHealth: 50, baseSpeed: 4, baseCritChance: 10, baseCritDamage: 80, baseDodge: 0, baseBlock: 0, attackType: "energy", defenseType: "mechanical", cost: { metal: 250, crystal: 100, deuterium: 40 }, trainingTimeSec: 300, tier: 2, description: "Heavy siege catapult.", strongAgainst: ["infantry", "berserker"], weakAgainst: ["cavalry", "ranger"] },
  artillery: { id: "artillery", name: "Artillery", category: "siege", baseAttack: 80, baseDefense: 8, baseHealth: 80, baseSpeed: 3, baseCritChance: 12, baseCritDamage: 90, baseDodge: 0, baseBlock: 0, attackType: "energy", defenseType: "mechanical", cost: { metal: 500, crystal: 200, deuterium: 80 }, trainingTimeSec: 600, tier: 3, description: "Long-range artillery platform.", strongAgainst: ["infantry", "berserker"], weakAgainst: ["cavalry", "ranger"] },

  // === RANGER (Tier 1-3) ===
  archer: { id: "archer", name: "Archer", category: "ranger", baseAttack: 20, baseDefense: 4, baseHealth: 35, baseSpeed: 15, baseCritChance: 12, baseCritDamage: 60, baseDodge: 10, baseBlock: 0, attackType: "physical", defenseType: "physical", cost: { metal: 70, crystal: 30, deuterium: 10 }, trainingTimeSec: 80, tier: 1, description: "Ranged archer unit.", strongAgainst: ["cavalry", "berserker"], weakAgainst: ["infantry", "siege"] },
  crossbowman: { id: "crossbowman", name: "Crossbowman", category: "ranger", baseAttack: 35, baseDefense: 6, baseHealth: 55, baseSpeed: 13, baseCritChance: 14, baseCritDamage: 65, baseDodge: 8, baseBlock: 0, attackType: "physical", defenseType: "physical", cost: { metal: 150, crystal: 60, deuterium: 25 }, trainingTimeSec: 180, tier: 2, description: "Heavy crossbow specialist.", strongAgainst: ["cavalry", "berserker"], weakAgainst: ["infantry", "siege"] },
  sniper: { id: "sniper", name: "Sniper", category: "ranger", baseAttack: 55, baseDefense: 8, baseHealth: 70, baseSpeed: 12, baseCritChance: 20, baseCritDamage: 80, baseDodge: 12, baseBlock: 0, attackType: "physical", defenseType: "physical", cost: { metal: 300, crystal: 120, deuterium: 50 }, trainingTimeSec: 420, tier: 3, description: "Long-range sniper unit.", strongAgainst: ["cavalry", "berserker"], weakAgainst: ["infantry", "siege"] },

  // === SUPPORT (Tier 1-3) ===
  medic: { id: "medic", name: "Medic", category: "support", baseAttack: 5, baseDefense: 4, baseHealth: 40, baseSpeed: 10, baseCritChance: 3, baseCritDamage: 50, baseDodge: 5, baseBlock: 3, attackType: "biological", defenseType: "biological", cost: { metal: 80, crystal: 60, deuterium: 15 }, trainingTimeSec: 120, tier: 1, description: "Field medic that heals allies.", strongAgainst: [], weakAgainst: ["berserker", "cavalry"] },
  engineer: { id: "engineer", name: "Engineer", category: "support", baseAttack: 8, baseDefense: 6, baseHealth: 50, baseSpeed: 8, baseCritChance: 4, baseCritDamage: 50, baseDodge: 3, baseBlock: 5, attackType: "mechanical", defenseType: "mechanical", cost: { metal: 120, crystal: 80, deuterium: 20 }, trainingTimeSec: 180, tier: 2, description: "Combat engineer with repair drones.", strongAgainst: [], weakAgainst: ["berserker", "cavalry"] },
  psi_ops: { id: "psi_ops", name: "Psi Operative", category: "support", baseAttack: 12, baseDefense: 5, baseHealth: 45, baseSpeed: 14, baseCritChance: 8, baseCritDamage: 60, baseDodge: 10, baseBlock: 2, attackType: "psionic", defenseType: "psionic", cost: { metal: 100, crystal: 120, deuterium: 30 }, trainingTimeSec: 240, tier: 3, description: "Psionic warfare specialist.", strongAgainst: ["berserker"], weakAgainst: ["infantry"] },
};

// --- Ability System ---
export type AbilityTarget = "self" | "single_enemy" | "all_enemies" | "single_ally" | "all_allies";

export interface CombatAbility {
  id: string;
  name: string;
  description: string;
  element: CombatElement;
  target: AbilityTarget;
  basePower: number;
  cooldown: number;
  currentCooldown: number;
  manaCost: number;
  effects: CombatEffect[];
  comboWith?: string[];
  comboBonus?: number;
}

export interface CombatEffect {
  type: "damage" | "heal" | "buff" | "debuff" | "dot" | "hot" | "stun" | "silence" | "dispel" | "taunt";
  stat?: keyof GearStatBlock;
  value: number;
  duration: number;
  chance: number;
}

// --- Buff/Debuff System ---
export interface CombatBuff {
  id: string;
  name: string;
  type: "buff" | "debuff";
  stat: keyof GearStatBlock | "damage" | "healing";
  value: number;
  duration: number;
  stacks: number;
  maxStacks: number;
  source: string;
}

// --- Formation System ---
export type FormationType = "balanced" | "aggressive" | "defensive" | "flanking" | "pincer" | "circle" | "wedge";

export interface Formation {
  id: FormationType;
  name: string;
  description: string;
  attackMultiplier: number;
  defenseMultiplier: number;
  speedMultiplier: number;
  critChanceBonus: number;
  dodgeBonus: number;
  blockBonus: number;
  moraleBonus: number;
  requiredMinUnits: number;
}

export const FORMATIONS: Record<FormationType, Formation> = {
  balanced: { id: "balanced", name: "Balanced", description: "Standard formation with equal offense and defense.", attackMultiplier: 1.0, defenseMultiplier: 1.0, speedMultiplier: 1.0, critChanceBonus: 0, dodgeBonus: 0, blockBonus: 0, moraleBonus: 0, requiredMinUnits: 1 },
  aggressive: { id: "aggressive", name: "Aggressive", description: "All-out attack formation.", attackMultiplier: 1.4, defenseMultiplier: 0.7, speedMultiplier: 1.1, critChanceBonus: 5, dodgeBonus: -3, blockBonus: -2, moraleBonus: 10, requiredMinUnits: 3 },
  defensive: { id: "defensive", name: "Defensive", description: "Fortified defensive position.", attackMultiplier: 0.7, defenseMultiplier: 1.5, speedMultiplier: 0.9, critChanceBonus: -2, dodgeBonus: 3, blockBonus: 8, moraleBonus: 5, requiredMinUnits: 3 },
  flanking: { id: "flanking", name: "Flanking", description: "Side attack for critical damage.", attackMultiplier: 1.2, defenseMultiplier: 0.8, speedMultiplier: 1.2, critChanceBonus: 8, dodgeBonus: 5, blockBonus: -5, moraleBonus: 8, requiredMinUnits: 5 },
  pincer: { id: "pincer", name: "Pincer", description: "Surround the enemy for devastating damage.", attackMultiplier: 1.8, defenseMultiplier: 0.6, speedMultiplier: 0.8, critChanceBonus: 10, dodgeBonus: -5, blockBonus: -3, moraleBonus: 15, requiredMinUnits: 8 },
  circle: { id: "circle", name: "Circle", description: "Encircle the enemy for sustained damage.", attackMultiplier: 1.1, defenseMultiplier: 1.1, speedMultiplier: 1.0, critChanceBonus: 3, dodgeBonus: 3, blockBonus: 3, moraleBonus: 5, requiredMinUnits: 6 },
  wedge: { id: "wedge", name: "Wedge", description: "Piercing formation that breaks enemy lines.", attackMultiplier: 1.6, defenseMultiplier: 0.8, speedMultiplier: 1.3, critChanceBonus: 6, dodgeBonus: 2, blockBonus: -2, moraleBonus: 12, requiredMinUnits: 5 },
};

// --- Battle State ---
export interface BattleUnit {
  id: string;
  typeId: string;
  name: string;
  category: UnitCategory;
  element: CombatElement;
  currentHealth: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  critChance: number;
  critDamage: number;
  dodge: number;
  block: number;
  morale: number;
  buffs: CombatBuff[];
  debuffs: CombatBuff[];
  abilities: CombatAbility[];
  gearStats: Partial<GearStatBlock>;
  isAlive: boolean;
  team: "attacker" | "defender";
}

export interface BattleState {
  id: string;
  turn: number;
  maxTurns: number;
  attackerUnits: BattleUnit[];
  defenderUnits: BattleUnit[];
  attackerFormation: FormationType;
  defenderFormation: FormationType;
  log: BattleLogEntry[];
  status: "pending" | "active" | "completed";
  winner: "attacker" | "defender" | "draw" | null;
  rewards: BattleRewards;
  startTime: number;
  endTime?: number;
}

export interface BattleLogEntry {
  turn: number;
  phase: "action" | "effect" | "status" | "result";
  source?: string;
  target?: string;
  message: string;
  damage?: number;
  healing?: number;
  critical?: boolean;
  element?: CombatElement;
}

export interface BattleRewards {
  experience: number;
  metal: number;
  crystal: number;
  deuterium: number;
  gold: number;
  loot: string[];
  ratingChange: number;
}

// --- Combat Gear Integration ---
export function getGearCombatStats(gear: GearItem | null): Partial<GearStatBlock> {
  if (!gear) return {};
  return {
    attack: Math.round((gear.stats.attack || 0) * RARITY_MULTIPLIER[gear.rarity]),
    defense: Math.round((gear.stats.defense || 0) * RARITY_MULTIPLIER[gear.rarity]),
    health: Math.round((gear.stats.health || 0) * RARITY_MULTIPLIER[gear.rarity]),
    speed: Math.round((gear.stats.speed || 0) * RARITY_MULTIPLIER[gear.rarity]),
    critChance: gear.stats.critChance || 0,
    critDamage: gear.stats.critDamage || 0,
    dodge: gear.stats.dodge || 0,
    block: gear.stats.block || 0,
    moraleBonus: gear.stats.moraleBonus || 0,
    experienceBonus: gear.stats.experienceBonus || 0,
  };
}

export function calculateGearScore(gear: GearItem | null): number {
  if (!gear) return 0;
  return calculateItemPower(gear);
}

export function calculateTotalGearScore(equipped: Record<string, GearItem | null>): number {
  return Object.values(equipped).reduce((sum, item) => sum + calculateGearScore(item), 0);
}

// --- Element Advantage Calculation ---
export function getElementMultiplier(attackerElement: CombatElement, defenderElement: CombatElement): number {
  if (ELEMENT_ADVANTAGE[attackerElement]?.includes(defenderElement)) {
    return ELEMENT_MULTIPLIER;
  }
  if (ELEMENT_DISADVANTAGE[attackerElement]?.includes(defenderElement)) {
    return ELEMENT_DISADVANTAGE_MULTIPLIER;
  }
  return 1.0;
}

// --- Unit Creation ---
export function createBattleUnit(
  typeId: string,
  team: "attacker" | "defender",
  gearStats: Partial<GearStatBlock> = {},
  level: number = 1
): BattleUnit | null {
  const unitType = UNIT_TYPES[typeId];
  if (!unitType) return null;

  const levelMult = 1 + (level - 1) * 0.05;

  return {
    id: `${team}-${typeId}-${Math.random().toString(36).slice(2, 8)}`,
    typeId,
    name: unitType.name,
    category: unitType.category,
    element: unitType.attackType,
    currentHealth: Math.round((unitType.baseHealth + (gearStats.health || 0)) * levelMult),
    maxHealth: Math.round((unitType.baseHealth + (gearStats.health || 0)) * levelMult),
    attack: Math.round((unitType.baseAttack + (gearStats.attack || 0)) * levelMult),
    defense: Math.round((unitType.baseDefense + (gearStats.defense || 0)) * levelMult),
    speed: Math.round((unitType.baseSpeed + (gearStats.speed || 0)) * levelMult),
    critChance: Math.min(95, unitType.baseCritChance + (gearStats.critChance || 0)),
    critDamage: unitType.baseCritDamage + (gearStats.critDamage || 0),
    dodge: Math.min(80, unitType.baseDodge + (gearStats.dodge || 0)),
    block: Math.min(80, unitType.baseBlock + (gearStats.block || 0)),
    morale: 100 + (gearStats.moraleBonus || 0),
    buffs: [],
    debuffs: [],
    abilities: [],
    gearStats,
    isAlive: true,
    team,
  };
}

// --- Battle Simulation ---
export function simulateBattle(
  attackerUnits: BattleUnit[],
  defenderUnits: BattleUnit[],
  attackerFormation: FormationType = "balanced",
  defenderFormation: FormationType = "balanced",
  maxTurns: number = 30
): BattleState {
  const battleId = `battle-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const state: BattleState = {
    id: battleId,
    turn: 0,
    maxTurns,
    attackerUnits: JSON.parse(JSON.stringify(attackerUnits)),
    defenderUnits: JSON.parse(JSON.stringify(defenderUnits)),
    attackerFormation,
    defenderFormation,
    log: [],
    status: "active",
    winner: null,
    rewards: { experience: 0, metal: 0, crystal: 0, deuterium: 0, gold: 0, loot: [], ratingChange: 0 },
    startTime: Date.now(),
  };

  const atkForm = FORMATIONS[attackerFormation];
  const defForm = FORMATIONS[defenderFormation];

  while (state.turn < maxTurns && state.status === "active") {
    state.turn++;

    // Process buffs/debuffs
    processBuffs(state);

    // Sort units by speed (highest first)
    const allUnits = [...state.attackerUnits, ...state.defenderUnits]
      .filter(u => u.isAlive)
      .sort((a, b) => (b.speed * (1 + b.morale / 200)) - (a.speed * (1 + a.morale / 200)));

    for (const unit of allUnits) {
      if (!unit.isAlive || unit.currentHealth <= 0) continue;

      // Find target
      const enemies = unit.team === "attacker" ? state.defenderUnits : state.attackerUnits;
      const targets = enemies.filter(e => e.isAlive);
      if (targets.length === 0) break;

      // Select target (lowest HP first for focused fire)
      const target = targets.sort((a, b) => (a.currentHealth / a.maxHealth) - (b.currentHealth / b.maxHealth))[0];

      // Calculate attack with formation
      const form = unit.team === "attacker" ? atkForm : defForm;
      const defFormApplied = unit.team === "attacker" ? defForm : atkForm;

      const effectiveAttack = unit.attack * form.attackMultiplier;
      const effectiveDefense = target.defense * defFormApplied.defenseMultiplier;

      // Dodge check
      const dodgeChance = Math.min(80, target.dodge + defFormApplied.dodgeBonus);
      if (Math.random() * 100 < dodgeChance) {
        state.log.push({
          turn: state.turn,
          phase: "action",
          source: unit.id,
          target: target.id,
          message: `${unit.name} attacks ${target.name} but misses! (${dodgeChance.toFixed(1)}% dodge)`,
        });
        continue;
      }

      // Block check
      const blockChance = Math.min(80, target.block + defFormApplied.blockBonus);
      const isBlocked = Math.random() * 100 < blockChance;

      // Critical hit check
      const critChance = Math.min(95, unit.critChance + form.critChanceBonus);
      const isCritical = Math.random() * 100 < critChance;

      // Damage calculation
      let baseDamage = Math.max(1, effectiveAttack - effectiveDefense * 0.5);
      const variance = 1 + (Math.random() - 0.5) * 0.3;
      baseDamage *= variance;

      // Element advantage
      const elementMult = getElementMultiplier(unit.element, target.element);
      baseDamage *= elementMult;

      // Critical multiplier
      if (isCritical) {
        baseDamage *= 1 + (unit.critDamage / 100);
      }

      // Block reduction
      if (isBlocked) {
        baseDamage *= 0.3;
      }

      // Apply damage
      const finalDamage = Math.ceil(Math.max(1, baseDamage));
      target.currentHealth -= finalDamage;

      // Apply morale effect
      if (isCritical) {
        unit.morale = Math.min(200, unit.morale + 5);
        target.morale = Math.max(0, target.morale - 8);
      } else {
        unit.morale = Math.min(200, unit.morale + 1);
        target.morale = Math.max(0, target.morale - 2);
      }

      // Check if target died
      if (target.currentHealth <= 0) {
        target.currentHealth = 0;
        target.isAlive = false;
        state.log.push({
          turn: state.turn,
          phase: "result",
          source: unit.id,
          target: target.id,
          message: `${unit.name} ${isCritical ? "CRITICALLY " : ""}destroys ${target.name}! ${isBlocked ? "(Blocked but fatal)" : ""} [${finalDamage} dmg | ${elementMult > 1 ? "ELEMENT ADVANTAGE" : elementMult < 1 ? "ELEMENT DISADVANTAGE" : ""}]`,
          damage: finalDamage,
          critical: isCritical,
          element: unit.element,
        });
      } else {
        state.log.push({
          turn: state.turn,
          phase: "action",
          source: unit.id,
          target: target.id,
          message: `${unit.name} ${isCritical ? "CRITICALLY " : ""}hits ${target.name} for ${finalDamage} damage${isBlocked ? " (blocked)" : ""}. [${target.currentHealth}/${target.maxHealth} HP]${elementMult !== 1 ? ` [Element: x${elementMult}]` : ""}`,
          damage: finalDamage,
          critical: isCritical,
          element: unit.element,
        });
      }

      // Support units heal allies
      if (unit.category === "support" && unit.element === "biological") {
        const allies = unit.team === "attacker" ? state.attackerUnits : state.defenderUnits;
        const woundedAllies = allies.filter(a => a.isAlive && a.currentHealth < a.maxHealth);
        if (woundedAllies.length > 0) {
          const healTarget = woundedAllies.sort((a, b) => (a.currentHealth / a.maxHealth) - (b.currentHealth / b.maxHealth))[0];
          const healAmount = Math.ceil(unit.attack * 0.5 * (1 + unit.morale / 200));
          healTarget.currentHealth = Math.min(healTarget.maxHealth, healTarget.currentHealth + healAmount);
          state.log.push({
            turn: state.turn,
            phase: "effect",
            source: unit.id,
            target: healTarget.id,
            message: `${unit.name} heals ${healTarget.name} for ${healAmount} HP. [${healTarget.currentHealth}/${healTarget.maxHealth}]`,
            healing: healAmount,
          });
        }
      }
    }

    // Check victory conditions
    const attackerAlive = state.attackerUnits.filter(u => u.isAlive).length;
    const defenderAlive = state.defenderUnits.filter(u => u.isAlive).length;

    if (defenderAlive === 0) {
      state.winner = "attacker";
      state.status = "completed";
      state.log.push({ turn: state.turn, phase: "result", message: "VICTORY! All defenders eliminated!" });
    } else if (attackerAlive === 0) {
      state.winner = "defender";
      state.status = "completed";
      state.log.push({ turn: state.turn, phase: "result", message: "DEFEAT! All attackers eliminated!" });
    }
  }

  // Max turns reached
  if (state.status === "active") {
    state.status = "completed";
    if (!state.winner) {
      const atkHP = state.attackerUnits.filter(u => u.isAlive).reduce((s, u) => s + u.currentHealth, 0);
      const defHP = state.defenderUnits.filter(u => u.isAlive).reduce((s, u) => s + u.currentHealth, 0);
      state.winner = atkHP > defHP ? "attacker" : defHP > atkHP ? "defender" : "draw";
      state.log.push({ turn: state.turn, phase: "result", message: `Max turns reached. Winner: ${state.winner} (HP remaining: ATK=${atkHP} vs DEF=${defHP})` });
    }
  }

  state.endTime = Date.now();
  return state;
}

// --- Buff Processing ---
function processBuffs(state: BattleState): void {
  const allUnits = [...state.attackerUnits, ...state.defenderUnits];
  for (const unit of allUnits) {
    if (!unit.isAlive) continue;

    // Process DoT
    unit.debuffs = unit.debuffs.filter(debuff => {
      if (debuff.type === "dot" && debuff.stacks > 0) {
        const dotDamage = debuff.value * debuff.stacks;
        unit.currentHealth -= dotDamage;
        state.log.push({
          turn: state.turn,
          phase: "effect",
          target: unit.id,
          message: `${unit.name} takes ${dotDamage} DoT damage from ${debuff.name}.`,
          damage: dotDamage,
        });
        if (unit.currentHealth <= 0) {
          unit.currentHealth = 0;
          unit.isAlive = false;
        }
      }
      debuff.duration--;
      return debuff.duration > 0;
    });

    // Process HoT
    unit.buffs = unit.buffs.filter(buff => {
      if (buff.type === "hot" && buff.stacks > 0) {
        const hotHeal = buff.value * buff.stacks;
        unit.currentHealth = Math.min(unit.maxHealth, unit.currentHealth + hotHeal);
        state.log.push({
          turn: state.turn,
          phase: "effect",
          target: unit.id,
          message: `${unit.name} heals ${hotHeal} from ${buff.name}.`,
          healing: hotHeal,
        });
      }
      buff.duration--;
      return buff.duration > 0;
    });
  }
}

// --- Unit Category Matchup Table ---
export const CATEGORY_MATCHUP: Record<UnitCategory, { strong: UnitCategory[]; weak: UnitCategory[] }> = {
  infantry: { strong: ["ranger"], weak: ["cavalry", "siege"] },
  cavalry: { strong: ["ranger", "siege"], weak: ["infantry", "berserker"] },
  berserker: { strong: ["cavalry", "infantry"], weak: ["ranger", "siege"] },
  siege: { strong: ["infantry", "berserker"], weak: ["cavalry", "ranger"] },
  ranger: { strong: ["cavalry", "berserker"], weak: ["infantry", "siege"] },
  support: { strong: [], weak: ["berserker", "cavalry"] },
};

export function getCategoryMultiplier(attacker: UnitCategory, defender: UnitCategory): number {
  if (CATEGORY_MATCHUP[attacker].strong.includes(defender)) return 1.3;
  if (CATEGORY_MATCHUP[attacker].weak.includes(defender)) return 0.7;
  return 1.0;
}

// --- Battle Summary ---
export function getBattleSummary(state: BattleState): {
  attackerLost: number;
  defenderLost: number;
  totalDamageDealt: number;
  totalHealingDone: number;
  criticalHits: number;
  elementAdvantageHits: number;
  turns: number;
  duration: number;
  winner: string;
} {
  const attackerLost = state.attackerUnits.filter(u => !u.isAlive).length;
  const defenderLost = state.defenderUnits.filter(u => !u.isAlive).length;
  let totalDamageDealt = 0;
  let totalHealingDone = 0;
  let criticalHits = 0;
  let elementAdvantageHits = 0;

  for (const entry of state.log) {
    if (entry.damage) totalDamageDealt += entry.damage;
    if (entry.healing) totalHealingDone += entry.healing;
    if (entry.critical) criticalHits++;
    if (entry.element && entry.element !== "physical") elementAdvantageHits++;
  }

  return {
    attackerLost,
    defenderLost,
    totalDamageDealt,
    totalHealingDone,
    criticalHits,
    elementAdvantageHits,
    turns: state.turn,
    duration: (state.endTime || Date.now()) - state.startTime,
    winner: state.winner || "draw",
  };
}

// --- Raid Boss Battle ---
export function createRaidBattle(
  boss: RaidBoss,
  playerUnits: string[],
  playerFormation: FormationType = "balanced"
): BattleState {
  const bossStats = RAID_DIFFICULTY_CONFIG[boss.difficulty];

  // Create boss as a single powerful unit
  const bossUnit: BattleUnit = {
    id: `boss-${boss.id}`,
    typeId: boss.id,
    name: boss.name,
    category: "berserker",
    element: boss.element as CombatElement,
    currentHealth: boss.health,
    maxHealth: boss.health,
    attack: boss.attack,
    defense: boss.defense,
    speed: boss.speed,
    critChance: 10 + (boss.level / 5),
    critDamage: 80 + (boss.level / 2),
    dodge: 5 + (boss.level / 10),
    block: 10 + (boss.level / 8),
    morale: 100,
    buffs: [],
    debuffs: [],
    abilities: [],
    gearStats: {},
    isAlive: true,
    team: "defender",
  };

  // Create player units
  const playerBattleUnits = playerUnits
    .map(typeId => createBattleUnit(typeId, "attacker"))
    .filter((u): u is BattleUnit => u !== null);

  return simulateBattle(playerBattleUnits, [bossUnit], playerFormation, "aggressive");
}

// --- Victory Reward Calculation ---
export function calculateVictoryRewards(
  boss: RaidBoss,
  playerLevel: number,
  attackerLost: number,
  totalAttackerUnits: number
): BattleRewards {
  const diffConfig = RAID_DIFFICULTY_CONFIG[boss.difficulty];
  const survivalBonus = 1 + ((totalAttackerUnits - attackerLost) / totalAttackerUnits) * 0.5;
  const levelBonus = 1 + (playerLevel / 100);

  return {
    experience: Math.round(boss.level * 100 * diffConfig.lootBonus * survivalBonus * levelBonus),
    metal: Math.round(boss.health * 0.01 * diffConfig.lootBonus * survivalBonus),
    crystal: Math.round(boss.health * 0.005 * diffConfig.lootBonus * survivalBonus),
    deuterium: Math.round(boss.health * 0.002 * diffConfig.lootBonus * survivalBonus),
    gold: Math.round(boss.level * 10 * diffConfig.lootBonus * survivalBonus),
    loot: boss.lootTable
      .filter(entry => Math.random() < entry.dropRate * diffConfig.lootBonus)
      .map(entry => entry.itemId),
    ratingChange: Math.round(boss.level * diffConfig.lootBonus * (1 - attackerLost / Math.max(1, totalAttackerUnits)) * 10),
  };
}
