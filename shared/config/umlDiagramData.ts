export interface UmlClass {
  name: string;
  stereotype?: string;
  isAbstract?: boolean;
  isSingleton?: boolean;
  properties: { name: string; type: string; visibility: "+" | "-" | "#" | "~" }[];
  methods: { name: string; returnType: string; visibility: "+" | "#" | "~"; params?: string }[];
  sourceFile?: string;
}

export interface UmlRelationship {
  from: string;
  to: string;
  type: "extends" | "implements" | "composition" | "aggregation" | "dependency" | "association";
  label?: string;
  multiplicity?: string;
}

export interface UmlDiagram {
  id: string;
  title: string;
  description: string;
  category: "class" | "sequence" | "architecture" | "er" | "dataflow";
  classes: UmlClass[];
  relationships: UmlRelationship[];
  notes?: string;
}

export const UML_DIAGRAMS: UmlDiagram[] = [
  {
    id: "server-engines",
    title: "Server Engines",
    description: "Core game engine and combat engine class diagrams",
    category: "class",
    classes: [
      {
        name: "GameEngine",
        sourceFile: "server/gameEngine.ts",
        properties: [
          { name: "resourceService", type: "ResourceService", visibility: "-" },
          { name: "fleetService", type: "FleetService", visibility: "-" },
          { name: "technologyService", type: "TechnologyService", visibility: "-" },
        ],
        methods: [
          { name: "update", returnType: "void", visibility: "+" },
          { name: "getResources", returnType: "ResourceState", visibility: "+" },
          { name: "getFleet", returnType: "Fleet", visibility: "+" },
          { name: "getTechnologyTree", returnType: "TechTree", visibility: "+" },
          { name: "calculateProduction", returnType: "ProductionOutput", visibility: "~", params: "buildings, research" },
          { name: "processResourceTick", returnType: "ResourceTickResult", visibility: "~", params: "userId" },
          { name: "processCoreGameTick", returnType: "GameTickResult", visibility: "~", params: "userId" },
        ],
      },
      {
        name: "CombatEngine",
        sourceFile: "server/combatEngine.ts",
        properties: [
          { name: "UNIT_STATS", type: "Record<UnitType, UnitStats>", visibility: "-" },
          { name: "RESEARCH_BONUSES", type: "Record<Tech, number>", visibility: "-" },
          { name: "BATTLE_CONFIG", type: "BattleSettings", visibility: "-" },
        ],
        methods: [
          { name: "getUnitStats", returnType: "Stats", visibility: "+", params: "type, research, bonus" },
          { name: "calculateDamage", returnType: "number", visibility: "+", params: "atk, def, crit" },
          { name: "simulateCombatRound", returnType: "Log", visibility: "+", params: "atk, def, round" },
          { name: "simulateBattle", returnType: "BattleResult", visibility: "+", params: "atk, def" },
          { name: "calculateVictoryResources", returnType: "Resources", visibility: "+", params: "def, winner" },
        ],
      },
    ],
    relationships: [
      { from: "GameEngine", to: "ResourceService", type: "composition" },
      { from: "GameEngine", to: "FleetService", type: "composition" },
      { from: "GameEngine", to: "TechnologyService", type: "composition" },
    ],
  },
  {
    id: "storage-logger",
    title: "Storage & Logger",
    description: "Database storage layer and logging system",
    category: "class",
    classes: [
      {
        name: "IStorage",
        stereotype: "interface",
        sourceFile: "server/storage.ts",
        properties: [
          { name: "db", type: "DrizzleDB", visibility: "-" },
          { name: "pool", type: "Pool", visibility: "-" },
        ],
        methods: [
          { name: "getPlayerState", returnType: "PlayerState | undefined", visibility: "+", params: "userId" },
          { name: "upsertPlayerState", returnType: "void", visibility: "+", params: "state" },
          { name: "createUser", returnType: "User", visibility: "+", params: "userData" },
          { name: "getUser", returnType: "User | undefined", visibility: "+", params: "id" },
          { name: "getMarketOrders", returnType: "MarketOrder[]", visibility: "+", params: "filters?" },
          { name: "createBattle", returnType: "Battle", visibility: "+", params: "data" },
          { name: "getAlliance", returnType: "Alliance | undefined", visibility: "+", params: "id" },
        ],
      },
      {
        name: "Logger",
        stereotype: "singleton",
        sourceFile: "server/logger.ts",
        properties: [
          { name: "logs", type: "LogEntry[]", visibility: "-" },
          { name: "maxLogs", type: "1000", visibility: "-" },
        ],
        methods: [
          { name: "debug", returnType: "void", visibility: "+", params: "cat, msg, data?" },
          { name: "info", returnType: "void", visibility: "+", params: "cat, msg, data?" },
          { name: "warn", returnType: "void", visibility: "+", params: "cat, msg, data?" },
          { name: "error", returnType: "void", visibility: "+", params: "cat, msg, data?, err?" },
          { name: "getLogs", returnType: "LogEntry[]", visibility: "+", params: "level?, cat?, limit?" },
        ],
      },
      {
        name: "DebugService",
        stereotype: "singleton",
        sourceFile: "server/services/debugService.ts",
        properties: [
          { name: "logs", type: "DebugEntry[]", visibility: "-" },
          { name: "maxLogs", type: "10000", visibility: "-" },
          { name: "logDirectory", type: "'./logs/debug'", visibility: "-" },
          { name: "enableFileLogging", type: "boolean", visibility: "-" },
        ],
        methods: [
          { name: "getInstance", returnType: "DebugService", visibility: "+" },
          { name: "log", returnType: "void", visibility: "+", params: "level, source, msg, data?, ..." },
          { name: "getLogs", returnType: "DebugEntry[]", visibility: "+", params: "filters?" },
          { name: "clearLogs", returnType: "void", visibility: "+" },
          { name: "exportLogs", returnType: "string", visibility: "+" },
        ],
      },
    ],
    relationships: [
      { from: "IStorage", to: "DrizzleDB", type: "dependency" },
      { from: "IStorage", to: "Pool", type: "dependency" },
      { from: "DebugService", to: "Logger", type: "dependency" },
    ],
  },
  {
    id: "services-singletons",
    title: "Service Singletons",
    description: "All service layer singletons in the server",
    category: "class",
    classes: [
      {
        name: "AchievementService",
        stereotype: "singleton",
        sourceFile: "server/services/achievementService.ts",
        properties: [{ name: "instance", type: "AchievementService", visibility: "-" }],
        methods: [
          { name: "getInstance", returnType: "AchievementService", visibility: "+" },
          { name: "getAchievements", returnType: "Achievement[]", visibility: "+" },
          { name: "unlockAchievement", returnType: "void", visibility: "+", params: "userId, achievementId" },
        ],
      },
      {
        name: "ArmySystemService",
        stereotype: "singleton",
        sourceFile: "server/services/armySystemService.ts",
        properties: [{ name: "instance", type: "ArmySystemService", visibility: "-" }],
        methods: [
          { name: "getInstance", returnType: "ArmySystemService", visibility: "+" },
          { name: "getArmyUnits", returnType: "ArmyUnit[]", visibility: "+" },
          { name: "trainUnit", returnType: "void", visibility: "+", params: "userId, unitType, qty" },
          { name: "disbandUnit", returnType: "void", visibility: "+", params: "userId, unitId" },
        ],
      },
      {
        name: "GovernmentProgressionService",
        stereotype: "singleton",
        sourceFile: "server/services/governmentProgressionService.ts",
        properties: [{ name: "instance", type: "GovernmentProgressionService", visibility: "-" }],
        methods: [
          { name: "getInstance", returnType: "GovernmentProgressionService", visibility: "+" },
          { name: "getProgressionTree", returnType: "ProgressionNode[]", visibility: "+" },
          { name: "unlockNode", returnType: "void", visibility: "+", params: "userId, nodeId" },
        ],
      },
      {
        name: "MegastructureService",
        stereotype: "singleton",
        sourceFile: "server/services/megastructureService.ts",
        properties: [{ name: "instance", type: "MegastructureService", visibility: "-" }],
        methods: [
          { name: "getInstance", returnType: "MegastructureService", visibility: "+" },
          { name: "getMegastructures", returnType: "Megastructure[]", visibility: "+" },
          { name: "upgradeStructure", returnType: "void", visibility: "+", params: "userId, structId" },
        ],
      },
      {
        name: "ResearchLabService",
        stereotype: "singleton",
        sourceFile: "server/services/researchLabService.ts",
        properties: [{ name: "instance", type: "ResearchLabService", visibility: "-" }],
        methods: [
          { name: "getInstance", returnType: "ResearchLabService", visibility: "+" },
          { name: "getLabs", returnType: "ResearchLab[]", visibility: "+" },
          { name: "startResearch", returnType: "void", visibility: "+", params: "userId, techId" },
        ],
      },
      {
        name: "TurnSystemService",
        stereotype: "singleton",
        sourceFile: "server/services/turnSystemService.ts",
        properties: [{ name: "instance", type: "TurnSystemService", visibility: "-" }],
        methods: [
          { name: "getInstance", returnType: "TurnSystemService", visibility: "+" },
          { name: "processTurns", returnType: "TurnResult", visibility: "+" },
          { name: "generateTurns", returnType: "void", visibility: "+" },
        ],
      },
      {
        name: "UniverseSeedService",
        stereotype: "singleton",
        sourceFile: "server/services/universeSeedService.ts",
        properties: [{ name: "instance", type: "UniverseSeedService", visibility: "-" }],
        methods: [
          { name: "getInstance", returnType: "UniverseSeedService", visibility: "+" },
          { name: "generateSeed", returnType: "string", visibility: "+" },
          { name: "getUniverseConfig", returnType: "UniverseConfig", visibility: "+" },
        ],
      },
      {
        name: "IssueService",
        stereotype: "singleton",
        sourceFile: "server/services/issueService.ts",
        properties: [
          { name: "issues", type: "Map<string, Issue>", visibility: "-" },
          { name: "issueIndex", type: "Map<string, string>", visibility: "-" },
        ],
        methods: [
          { name: "getInstance", returnType: "IssueService", visibility: "+" },
          { name: "reportIssue", returnType: "Issue", visibility: "+" },
          { name: "resolveIssue", returnType: "Issue | undefined", visibility: "+", params: "id, by, notes" },
          { name: "getIssueReport", returnType: "IssueReport", visibility: "+", params: "period" },
        ],
      },
    ],
    relationships: [],
  },
  {
    id: "client-context",
    title: "Client Game Context",
    description: "React Context state management and client-side modules",
    category: "class",
    classes: [
      {
        name: "GameProvider",
        stereotype: "React Context",
        sourceFile: "client/src/lib/gameContext.tsx",
        properties: [
          { name: "resources", type: "Resources", visibility: "-" },
          { name: "buildings", type: "Buildings", visibility: "-" },
          { name: "units", type: "Record<string, number>", visibility: "-" },
          { name: "commander", type: "CommanderState", visibility: "-" },
          { name: "government", type: "GovernmentState", visibility: "-" },
          { name: "alliance", type: "Alliance | null", visibility: "-" },
          { name: "research", type: "Record<string, number>", visibility: "-" },
          { name: "empireLevel", type: "number", visibility: "-" },
          { name: "tier", type: "number", visibility: "-" },
          { name: "prestigeLevel", type: "number", visibility: "-" },
        ],
        methods: [
          { name: "updateResources", returnType: "void", visibility: "+", params: "resources" },
          { name: "addNotification", returnType: "void", visibility: "+", params: "message" },
          { name: "buildBuilding", returnType: "void", visibility: "+", params: "type" },
          { name: "buildShip", returnType: "void", visibility: "+", params: "type, qty" },
          { name: "researchTech", returnType: "void", visibility: "+", params: "techId" },
          { name: "simulateBattle", returnType: "Report", visibility: "+", params: "attacker, defender" },
        ],
      },
      {
        name: "ShipFittingModules",
        stereotype: "module",
        sourceFile: "client/src/lib/shipFittingModules.ts",
        properties: [
          { name: "SHIP_FITTING_MODULES", type: "{ [key: string]: ShipModule }", visibility: "+" },
        ],
        methods: [
          { name: "getModule", returnType: "ShipModule | undefined", visibility: "+", params: "id" },
          { name: "getModulesByCategory", returnType: "ShipModule[]", visibility: "+", params: "category" },
          { name: "validateFitting", returnType: "boolean", visibility: "+", params: "modules, ship" },
        ],
      },
      {
        name: "InterplanetaryPowerGrid",
        stereotype: "module",
        sourceFile: "client/src/lib/interplanetaryPowerGrid.ts",
        properties: [
          { name: "ENERGY_SOURCES", type: "EnergySource[]", visibility: "+" },
          { name: "TRANSMISSION_SYSTEMS", type: "TransmissionSystem[]", visibility: "+" },
          { name: "GRID_NODES", type: "GridNode[]", visibility: "+" },
          { name: "POWER_TECHNOLOGIES", type: "PowerTechnology[]", visibility: "+" },
        ],
        methods: [
          { name: "calculateGridSummary", returnType: "GridSummary", visibility: "+", params: "nodes, eff" },
        ],
      },
      {
        name: "OrbitalDefenseSystem",
        stereotype: "module",
        sourceFile: "client/src/lib/orbitalDefenseSystem.ts",
        properties: [],
        methods: [
          { name: "getPlatformClass", returnType: "OrbitalPlatformClass", visibility: "+", params: "id" },
          { name: "getModule", returnType: "OrbitalModule", visibility: "+", params: "id" },
          { name: "simulateOrbitalBattle", returnType: "OrbitalBattleReport", visibility: "+", params: "attacker, defender" },
        ],
      },
    ],
    relationships: [
      { from: "GameProvider", to: "ShipFittingModules", type: "dependency" },
      { from: "GameProvider", to: "InterplanetaryPowerGrid", type: "dependency" },
      { from: "GameProvider", to: "OrbitalDefenseSystem", type: "dependency" },
    ],
  },
  {
    id: "architecture-layers",
    title: "5-Layer Architecture",
    description: "The complete 5-layer framework architecture of Stellar Dominion",
    category: "architecture",
    classes: [
      {
        name: "Layer 1: Presentation",
        stereotype: "React Pages",
        properties: [{ name: "93 page components", type: "React.FC", visibility: "+" }],
        methods: [
          { name: "render", returnType: "JSX.Element", visibility: "+" },
        ],
      },
      {
        name: "Layer 2: Client Logic",
        stereotype: "React Context + Libs",
        properties: [
          { name: "GameProvider", type: "React.Context", visibility: "+" },
          { name: "shipFittingModules", type: "Module[]", visibility: "+" },
          { name: "powerGrid", type: "GridSystem", visibility: "+" },
        ],
        methods: [
          { name: "apiRequest", returnType: "Promise<Response>", visibility: "+" },
          { name: "useQuery", returnType: "QueryResult", visibility: "+" },
        ],
      },
      {
        name: "Layer 3: API Transport",
        stereotype: "Routes + Middleware",
        properties: [
          { name: "express", type: "Express", visibility: "+" },
          { name: "routes", type: "60+ route files", visibility: "+" },
        ],
        methods: [
          { name: "isAuthenticated", returnType: "Middleware", visibility: "+" },
          { name: "registerRoutes", returnType: "void", visibility: "+", params: "app" },
        ],
      },
      {
        name: "Layer 4: Server Logic",
        stereotype: "Services + Engines",
        properties: [
          { name: "GameEngine", type: "GameEngine", visibility: "+" },
          { name: "CombatEngine", type: "CombatEngine", visibility: "+" },
          { name: "29 services", type: "Service[]", visibility: "+" },
        ],
        methods: [
          { name: "processGameTick", returnType: "TickResult", visibility: "+" },
          { name: "simulateBattle", returnType: "BattleResult", visibility: "+" },
        ],
      },
      {
        name: "Layer 5: Data",
        stereotype: "Schema + Storage",
        properties: [
          { name: "drizzle", type: "DrizzleORM", visibility: "+" },
          { name: "schema", type: "72 tables", visibility: "+" },
          { name: "storage", type: "IStorage", visibility: "+" },
        ],
        methods: [
          { name: "query", returnType: "Result", visibility: "+" },
          { name: "insert", returnType: "Result", visibility: "+" },
          { name: "update", returnType: "Result", visibility: "+" },
          { name: "delete", returnType: "Result", visibility: "+" },
        ],
      },
    ],
    relationships: [
      { from: "Layer 1: Presentation", to: "Layer 2: Client Logic", type: "dependency" },
      { from: "Layer 2: Client Logic", to: "Layer 3: API Transport", type: "dependency" },
      { from: "Layer 3: API Transport", to: "Layer 4: Server Logic", type: "dependency" },
      { from: "Layer 4: Server Logic", to: "Layer 5: Data", type: "dependency" },
    ],
  },
  {
    id: "data-flow",
    title: "Request Lifecycle",
    description: "Data flow from client browser through server to database and back",
    category: "dataflow",
    classes: [
      {
        name: "Client Browser",
        properties: [{ name: "fetch()", type: "HTTP Request", visibility: "+" }],
        methods: [{ name: "apiRequest", returnType: "Promise", visibility: "+", params: "method, url, data?" }],
      },
      {
        name: "Vite Dev Proxy",
        properties: [{ name: "proxy", type: "/api/* -> Express", visibility: "+" }],
        methods: [{ name: "intercept", returnType: "Response", visibility: "+" }],
      },
      {
        name: "Express Server",
        properties: [{ name: "middleware", type: "session, auth", visibility: "-" }],
        methods: [
          { name: "handleRequest", returnType: "Response", visibility: "+" },
          { name: "sessionMiddleware", returnType: "Middleware", visibility: "+" },
        ],
      },
      {
        name: "Route Handler",
        properties: [{ name: "path", type: "string", visibility: "-" }],
        methods: [{ name: "process", returnType: "Response", visibility: "+", params: "req, res" }],
      },
      {
        name: "Service Layer",
        properties: [],
        methods: [{ name: "execute", returnType: "Result", visibility: "+", params: "operation" }],
      },
      {
        name: "Storage/ORM",
        properties: [{ name: "drizzle", type: "DrizzleORM", visibility: "-" }],
        methods: [{ name: "query", returnType: "Result", visibility: "+", params: "sql" }],
      },
      {
        name: "PostgreSQL",
        properties: [{ name: "pool", type: "ConnectionPool", visibility: "-" }],
        methods: [{ name: "execute", returnType: "Row[]", visibility: "+", params: "query" }],
      },
    ],
    relationships: [
      { from: "Client Browser", to: "Vite Dev Proxy", type: "dependency" },
      { from: "Vite Dev Proxy", to: "Express Server", type: "dependency" },
      { from: "Express Server", to: "Route Handler", type: "association" },
      { from: "Route Handler", to: "Service Layer", type: "dependency" },
      { from: "Service Layer", to: "Storage/ORM", type: "dependency" },
      { from: "Storage/ORM", to: "PostgreSQL", type: "dependency" },
    ],
  },
  {
    id: "database-er",
    title: "Database ERD (Core)",
    description: "Entity relationships for the core database tables",
    category: "er",
    classes: [
      {
        name: "users",
        stereotype: "table",
        properties: [
          { name: "id", type: "UUID (PK)", visibility: "+" },
          { name: "username", type: "VARCHAR(UQ)", visibility: "+" },
          { name: "passwordHash", type: "VARCHAR", visibility: "+" },
          { name: "email", type: "VARCHAR(UQ)", visibility: "+" },
        ],
        methods: [],
      },
      {
        name: "sessions",
        stereotype: "table",
        properties: [
          { name: "sid", type: "VARCHAR (PK)", visibility: "+" },
          { name: "sess", type: "JSONB", visibility: "+" },
          { name: "expire", type: "TIMESTAMP", visibility: "+" },
        ],
        methods: [],
      },
      {
        name: "playerStates",
        stereotype: "table",
        properties: [
          { name: "userId", type: "UUID (FK)", visibility: "+" },
          { name: "resources", type: "JSONB", visibility: "+" },
          { name: "buildings", type: "JSONB", visibility: "+" },
          { name: "units", type: "JSONB", visibility: "+" },
          { name: "research", type: "JSONB", visibility: "+" },
          { name: "commander", type: "JSONB", visibility: "+" },
          { name: "government", type: "JSONB", visibility: "+" },
          { name: "cronJobs", type: "JSONB", visibility: "+" },
        ],
        methods: [],
      },
      {
        name: "playerProfiles",
        stereotype: "table",
        properties: [
          { name: "userId", type: "UUID (FK, UQ)", visibility: "+" },
          { name: "uid", type: "VARCHAR(UQ)", visibility: "+" },
          { name: "displayName", type: "VARCHAR", visibility: "+" },
          { name: "level", type: "INTEGER", visibility: "+" },
          { name: "attributes", type: "JSONB", visibility: "+" },
        ],
        methods: [],
      },
      {
        name: "battles",
        stereotype: "table",
        properties: [
          { name: "id", type: "UUID (PK)", visibility: "+" },
          { name: "attackerId", type: "UUID (FK)", visibility: "+" },
          { name: "defenderId", type: "UUID (FK)", visibility: "+" },
          { name: "type", type: "VARCHAR", visibility: "+" },
          { name: "status", type: "VARCHAR", visibility: "+" },
          { name: "fleet", type: "JSONB", visibility: "+" },
          { name: "loot", type: "JSONB", visibility: "+" },
        ],
        methods: [],
      },
      {
        name: "alliances",
        stereotype: "table",
        properties: [
          { name: "id", type: "UUID (PK)", visibility: "+" },
          { name: "name", type: "VARCHAR", visibility: "+" },
          { name: "tag", type: "VARCHAR", visibility: "+" },
          { name: "resources", type: "JSONB", visibility: "+" },
        ],
        methods: [],
      },
      {
        name: "marketOrders",
        stereotype: "table",
        properties: [
          { name: "id", type: "UUID (PK)", visibility: "+" },
          { name: "type", type: "VARCHAR", visibility: "+" },
          { name: "resource", type: "VARCHAR", visibility: "+" },
          { name: "amount", type: "INTEGER", visibility: "+" },
          { name: "price", type: "INTEGER", visibility: "+" },
          { name: "status", type: "VARCHAR", visibility: "+" },
        ],
        methods: [],
      },
    ],
    relationships: [
      { from: "users", to: "sessions", type: "association", label: "1..*", multiplicity: "1" },
      { from: "users", to: "playerStates", type: "association", label: "1:1", multiplicity: "1" },
      { from: "users", to: "playerProfiles", type: "association", label: "1:1", multiplicity: "1" },
      { from: "users", to: "battles", type: "association", label: "attacker", multiplicity: "*" },
      { from: "users", to: "alliances", type: "aggregation", label: "member", multiplicity: "*" },
      { from: "users", to: "marketOrders", type: "association", label: "creator", multiplicity: "*" },
    ],
  },
  {
    id: "sequence-auth",
    title: "Authentication Flow",
    description: "Sequence of events during user authentication",
    category: "sequence",
    classes: [
      {
        name: "Client",
        properties: [],
        methods: [
          { name: "POST /api/auth/login", returnType: "Response", visibility: "+" },
          { name: "GET /api/game-state", returnType: "Response", visibility: "+" },
        ],
      },
      {
        name: "Express Server",
        properties: [],
        methods: [
          { name: "resolveUser", returnType: "User", visibility: "+" },
          { name: "verifyPassword", returnType: "boolean", visibility: "+" },
          { name: "session.create", returnType: "Session", visibility: "+" },
          { name: "sessionMiddleware", returnType: "Middleware", visibility: "+" },
        ],
      },
      {
        name: "Database",
        properties: [],
        methods: [
          { name: "db.select", returnType: "Row[]", visibility: "+" },
          { name: "db.update", returnType: "Result", visibility: "+" },
        ],
      },
      {
        name: "SessionStore",
        properties: [],
        methods: [
          { name: "set", returnType: "void", visibility: "+" },
          { name: "get", returnType: "Session", visibility: "+" },
        ],
      },
    ],
    relationships: [
      { from: "Client", to: "Express Server", type: "dependency", label: "1. Login Request" },
      { from: "Express Server", to: "Database", type: "dependency", label: "2. Query User" },
      { from: "Database", to: "Express Server", type: "dependency", label: "3. Return User" },
      { from: "Express Server", to: "SessionStore", type: "dependency", label: "4. Store Session" },
      { from: "Client", to: "Express Server", type: "dependency", label: "5. Authenticated Request" },
    ],
  },
  {
    id: "sequence-combat",
    title: "Combat Simulation",
    description: "Sequence diagram for the combat simulation process",
    category: "sequence",
    classes: [
      {
        name: "Client",
        properties: [],
        methods: [
          { name: "POST /api/combat/simulate", returnType: "BattleResult", visibility: "+" },
        ],
      },
      {
        name: "Combat Route",
        properties: [],
        methods: [
          { name: "handleRequest", returnType: "Response", visibility: "+" },
        ],
      },
      {
        name: "CombatEngine",
        properties: [],
        methods: [
          { name: "simulateBattle", returnType: "BattleResult", visibility: "+" },
          { name: "simulateCombatRound", returnType: "RoundLog", visibility: "+" },
          { name: "getUnitStats", returnType: "Stats", visibility: "+" },
          { name: "calculateDamage", returnType: "number", visibility: "+" },
        ],
      },
      {
        name: "Storage",
        properties: [],
        methods: [
          { name: "getPlayerState", returnType: "PlayerState", visibility: "+" },
          { name: "createBattle", returnType: "Battle", visibility: "+" },
        ],
      },
    ],
    relationships: [
      { from: "Client", to: "Combat Route", type: "dependency", label: "1. Simulate Request" },
      { from: "Combat Route", to: "CombatEngine", type: "dependency", label: "2. simulateBattle()" },
      { from: "CombatEngine", to: "CombatEngine", type: "dependency", label: "3. Loop: simulateRound()" },
      { from: "Combat Route", to: "Storage", type: "dependency", label: "4. Persist Result" },
    ],
  },
  {
    id: "sequence-research",
    title: "Research Flow",
    description: "Sequence diagram for the technology research process",
    category: "sequence",
    classes: [
      {
        name: "Client",
        properties: [],
        methods: [
          { name: "POST /api/research/start", returnType: "Response", visibility: "+" },
          { name: "POST /api/research/check", returnType: "Response", visibility: "+" },
        ],
      },
      {
        name: "Research Route",
        properties: [],
        methods: [
          { name: "validatePrerequisites", returnType: "boolean", visibility: "+" },
          { name: "calculateCost", returnType: "ResourceCost", visibility: "+" },
        ],
      },
      {
        name: "ResearchLabService",
        properties: [],
        methods: [
          { name: "startResearch", returnType: "void", visibility: "+" },
          { name: "checkCompletion", returnType: "Tech | null", visibility: "+" },
          { name: "applyBonus", returnType: "void", visibility: "+" },
        ],
      },
      {
        name: "Database",
        properties: [],
        methods: [
          { name: "getPlayerState", returnType: "PlayerState", visibility: "+" },
          { name: "updatePlayerState", returnType: "void", visibility: "+" },
        ],
      },
    ],
    relationships: [
      { from: "Client", to: "Research Route", type: "dependency", label: "1. Start Research" },
      { from: "Research Route", to: "ResearchLabService", type: "dependency", label: "2. startResearch()" },
      { from: "Research Route", to: "Database", type: "dependency", label: "3. Deduct Resources" },
      { from: "Client", to: "Research Route", type: "dependency", label: "4. Check Progress" },
      { from: "Research Route", to: "ResearchLabService", type: "dependency", label: "5. checkCompletion()" },
    ],
  },
];

export const UML_CATEGORIES = [
  { id: "class", label: "Class Diagrams", description: "UML class diagrams showing types, properties, and methods" },
  { id: "sequence", label: "Sequence Diagrams", description: "Interaction flows between components over time" },
  { id: "architecture", label: "Architecture", description: "High-level system architecture and layer diagrams" },
  { id: "er", label: "Entity Relationship", description: "Database table relationships and schemas" },
  { id: "dataflow", label: "Data Flow", description: "Request lifecycle and data movement through the system" },
] as const;
