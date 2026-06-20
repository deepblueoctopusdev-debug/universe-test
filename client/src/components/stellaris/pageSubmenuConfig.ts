export interface SubmenuItem {
  key: string;
  label: string;
  href: string;
}

export interface SubmenuSection {
  title: string;
  items: SubmenuItem[];
}

export interface PageSubmenuConfig {
  label: string;
  sections: SubmenuSection[];
}

const PAGE_SUBMENUS: Record<string, PageSubmenuConfig> = {
  "/empire-view": {
    label: "Empire",
    sections: [
      {
        title: "Overview",
        items: [
          { key: "empire-view", label: "Empire View", href: "/empire-view" },
          { key: "empire-planets", label: "Empire Planets", href: "/empire-planets" },
          { key: "empire-command", label: "Command Center", href: "/empire-command-center" },
          { key: "empire-progression", label: "Progression", href: "/empire-progression" },
        ],
      },
      {
        title: "Production",
        items: [
          { key: "resources", label: "Resources", href: "/resources" },
          { key: "power-grid", label: "Power Grid", href: "/power-grid" },
          { key: "facilities", label: "Facilities", href: "/facilities" },
          { key: "stations", label: "Stations", href: "/stations" },
        ],
      },
    ],
  },
  "/empire-planets": {
    label: "Empire",
    sections: [
      {
        title: "Overview",
        items: [
          { key: "empire-view", label: "Empire View", href: "/empire-view" },
          { key: "empire-planets", label: "Empire Planets", href: "/empire-planets" },
          { key: "empire-command", label: "Command Center", href: "/empire-command-center" },
          { key: "empire-progression", label: "Progression", href: "/empire-progression" },
        ],
      },
      {
        title: "Production",
        items: [
          { key: "resources", label: "Resources", href: "/resources" },
          { key: "power-grid", label: "Power Grid", href: "/power-grid" },
          { key: "facilities", label: "Facilities", href: "/facilities" },
          { key: "stations", label: "Stations", href: "/stations" },
        ],
      },
    ],
  },
  "/empire-command-center": {
    label: "Empire",
    sections: [
      {
        title: "Overview",
        items: [
          { key: "empire-view", label: "Empire View", href: "/empire-view" },
          { key: "empire-planets", label: "Empire Planets", href: "/empire-planets" },
          { key: "empire-command", label: "Command Center", href: "/empire-command-center" },
          { key: "empire-progression", label: "Progression", href: "/empire-progression" },
        ],
      },
      {
        title: "Production",
        items: [
          { key: "resources", label: "Resources", href: "/resources" },
          { key: "power-grid", label: "Power Grid", href: "/power-grid" },
          { key: "facilities", label: "Facilities", href: "/facilities" },
          { key: "stations", label: "Stations", href: "/stations" },
        ],
      },
    ],
  },
  "/empire-progression": {
    label: "Empire",
    sections: [
      {
        title: "Overview",
        items: [
          { key: "empire-view", label: "Empire View", href: "/empire-view" },
          { key: "empire-planets", label: "Empire Planets", href: "/empire-planets" },
          { key: "empire-command", label: "Command Center", href: "/empire-command-center" },
          { key: "empire-progression", label: "Progression", href: "/empire-progression" },
        ],
      },
      {
        title: "Production",
        items: [
          { key: "resources", label: "Resources", href: "/resources" },
          { key: "power-grid", label: "Power Grid", href: "/power-grid" },
          { key: "facilities", label: "Facilities", href: "/facilities" },
          { key: "stations", label: "Stations", href: "/stations" },
        ],
      },
    ],
  },
  "/resources": {
    label: "Empire",
    sections: [
      {
        title: "Overview",
        items: [
          { key: "empire-view", label: "Empire View", href: "/empire-view" },
          { key: "empire-planets", label: "Empire Planets", href: "/empire-planets" },
          { key: "empire-command", label: "Command Center", href: "/empire-command-center" },
          { key: "empire-progression", label: "Progression", href: "/empire-progression" },
        ],
      },
      {
        title: "Production",
        items: [
          { key: "resources", label: "Resources", href: "/resources" },
          { key: "power-grid", label: "Power Grid", href: "/power-grid" },
          { key: "facilities", label: "Facilities", href: "/facilities" },
          { key: "stations", label: "Stations", href: "/stations" },
        ],
      },
    ],
  },
  "/power-grid": {
    label: "Empire",
    sections: [
      {
        title: "Overview",
        items: [
          { key: "empire-view", label: "Empire View", href: "/empire-view" },
          { key: "empire-planets", label: "Empire Planets", href: "/empire-planets" },
          { key: "empire-command", label: "Command Center", href: "/empire-command-center" },
          { key: "empire-progression", label: "Progression", href: "/empire-progression" },
        ],
      },
      {
        title: "Production",
        items: [
          { key: "resources", label: "Resources", href: "/resources" },
          { key: "power-grid", label: "Power Grid", href: "/power-grid" },
          { key: "facilities", label: "Facilities", href: "/facilities" },
          { key: "stations", label: "Stations", href: "/stations" },
        ],
      },
    ],
  },
  "/facilities": {
    label: "Empire",
    sections: [
      {
        title: "Overview",
        items: [
          { key: "empire-view", label: "Empire View", href: "/empire-view" },
          { key: "empire-planets", label: "Empire Planets", href: "/empire-planets" },
          { key: "empire-command", label: "Command Center", href: "/empire-command-center" },
          { key: "empire-progression", label: "Progression", href: "/empire-progression" },
        ],
      },
      {
        title: "Production",
        items: [
          { key: "resources", label: "Resources", href: "/resources" },
          { key: "power-grid", label: "Power Grid", href: "/power-grid" },
          { key: "facilities", label: "Facilities", href: "/facilities" },
          { key: "stations", label: "Stations", href: "/stations" },
        ],
      },
    ],
  },
  "/stations": {
    label: "Empire",
    sections: [
      {
        title: "Overview",
        items: [
          { key: "empire-view", label: "Empire View", href: "/empire-view" },
          { key: "empire-planets", label: "Empire Planets", href: "/empire-planets" },
          { key: "empire-command", label: "Command Center", href: "/empire-command-center" },
          { key: "empire-progression", label: "Progression", href: "/empire-progression" },
        ],
      },
      {
        title: "Production",
        items: [
          { key: "resources", label: "Resources", href: "/resources" },
          { key: "power-grid", label: "Power Grid", href: "/power-grid" },
          { key: "facilities", label: "Facilities", href: "/facilities" },
          { key: "stations", label: "Stations", href: "/stations" },
        ],
      },
    ],
  },

  // Fleet Management submenu
  "/fleet": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  "/shipyard": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  "/fitting": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  "/combat": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  "/battle-logs": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  "/orbital-defense": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  "/army": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  "/army-management": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  "/training-center": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },
  "/ground-combat": {
    label: "Fleet Management",
    sections: [
      {
        title: "Fleets",
        items: [
          { key: "fleet", label: "Fleet Command", href: "/fleet" },
          { key: "shipyard", label: "Shipyard", href: "/shipyard" },
          { key: "fitting", label: "Fitting", href: "/fitting" },
        ],
      },
      {
        title: "Combat",
        items: [
          { key: "combat", label: "Combat Center", href: "/combat" },
          { key: "battle-logs", label: "Battle Logs", href: "/battle-logs" },
          { key: "orbital-defense", label: "Orbital Defense", href: "/orbital-defense" },
        ],
      },
      {
        title: "Ground Forces",
        items: [
          { key: "army", label: "Army", href: "/army" },
          { key: "army-mgmt", label: "Army Management", href: "/army-management" },
          { key: "training", label: "Training Center", href: "/training-center" },
          { key: "ground-combat", label: "Ground Combat", href: "/ground-combat" },
        ],
      },
    ],
  },

  // Research submenu
  "/research": {
    label: "Technology",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },
  "/research-lab": {
    label: "Technology",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },
  "/research-analytics": {
    label: "Technology",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },
  "/skills": {
    label: "Technology",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },
  "/technology-tree": {
    label: "Technology",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },
  "/tech-tree": {
    label: "Technology",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },
  "/blueprints": {
    label: "Technology",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },
  "/artifacts": {
    label: "Technology",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },
  "/knowledge-library": {
    label: "Technology",
    sections: [
      {
        title: "Research",
        items: [
          { key: "research-hub", label: "Research Hub", href: "/research" },
          { key: "research-lab", label: "Research Lab", href: "/research-lab" },
          { key: "research-analytics", label: "Analytics", href: "/research-analytics" },
          { key: "skills", label: "Skills Training", href: "/skills" },
        ],
      },
      {
        title: "Technology",
        items: [
          { key: "tech-tree", label: "Technology Tree", href: "/technology-tree" },
          { key: "tech-tree-alt", label: "Tech Tree", href: "/tech-tree" },
          { key: "blueprints", label: "Blueprints", href: "/blueprints" },
          { key: "artifacts", label: "Artifacts", href: "/artifacts" },
          { key: "knowledge", label: "Knowledge Library", href: "/knowledge-library" },
        ],
      },
    ],
  },

  // Expansion submenu
  "/exploration": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  "/expeditions": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  "/warp-network": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  "/interstellar": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  "/galaxy": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  "/galaxy-maps": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  "/universe": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  "/celestial-browser": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  "/megastructures": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },
  "/biome-codex": {
    label: "Expansion Planner",
    sections: [
      {
        title: "Exploration",
        items: [
          { key: "exploration", label: "Exploration", href: "/exploration" },
          { key: "expeditions", label: "Expeditions", href: "/expeditions" },
          { key: "warp-network", label: "Warp Network", href: "/warp-network" },
          { key: "interstellar", label: "Interstellar", href: "/interstellar" },
        ],
      },
      {
        title: "Maps",
        items: [
          { key: "galaxy-map", label: "Galaxy Map", href: "/galaxy" },
          { key: "galaxy-map-center", label: "Map Center", href: "/galaxy-maps" },
          { key: "universe", label: "Universe View", href: "/universe" },
          { key: "celestial-browser", label: "Celestial Browser", href: "/celestial-browser" },
        ],
      },
      {
        title: "Construction",
        items: [
          { key: "megastructures", label: "Megastructures", href: "/megastructures" },
          { key: "biome-codex", label: "Biome Codex", href: "/biome-codex" },
        ],
      },
    ],
  },

  // Government submenu
  "/government": {
    label: "Government",
    sections: [
      {
        title: "Government",
        items: [
          { key: "government", label: "Government", href: "/government" },
          { key: "factions", label: "Factions", href: "/factions" },
          { key: "alliance", label: "Alliance", href: "/alliance" },
        ],
      },
      {
        title: "Civilization",
        items: [
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
      {
        title: "Communications",
        items: [
          { key: "messages", label: "Messages", href: "/messages" },
          { key: "friends", label: "Friends List", href: "/friends" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },
  "/factions": {
    label: "Government",
    sections: [
      {
        title: "Government",
        items: [
          { key: "government", label: "Government", href: "/government" },
          { key: "factions", label: "Factions", href: "/factions" },
          { key: "alliance", label: "Alliance", href: "/alliance" },
        ],
      },
      {
        title: "Civilization",
        items: [
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
      {
        title: "Communications",
        items: [
          { key: "messages", label: "Messages", href: "/messages" },
          { key: "friends", label: "Friends List", href: "/friends" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },
  "/alliance": {
    label: "Government",
    sections: [
      {
        title: "Government",
        items: [
          { key: "government", label: "Government", href: "/government" },
          { key: "factions", label: "Factions", href: "/factions" },
          { key: "alliance", label: "Alliance", href: "/alliance" },
        ],
      },
      {
        title: "Civilization",
        items: [
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
      {
        title: "Communications",
        items: [
          { key: "messages", label: "Messages", href: "/messages" },
          { key: "friends", label: "Friends List", href: "/friends" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },
  "/civilization-management": {
    label: "Government",
    sections: [
      {
        title: "Government",
        items: [
          { key: "government", label: "Government", href: "/government" },
          { key: "factions", label: "Factions", href: "/factions" },
          { key: "alliance", label: "Alliance", href: "/alliance" },
        ],
      },
      {
        title: "Civilization",
        items: [
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
      {
        title: "Communications",
        items: [
          { key: "messages", label: "Messages", href: "/messages" },
          { key: "friends", label: "Friends List", href: "/friends" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },
  "/civilization-systems": {
    label: "Government",
    sections: [
      {
        title: "Government",
        items: [
          { key: "government", label: "Government", href: "/government" },
          { key: "factions", label: "Factions", href: "/factions" },
          { key: "alliance", label: "Alliance", href: "/alliance" },
        ],
      },
      {
        title: "Civilization",
        items: [
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
      {
        title: "Communications",
        items: [
          { key: "messages", label: "Messages", href: "/messages" },
          { key: "friends", label: "Friends List", href: "/friends" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },
  "/messages": {
    label: "Government",
    sections: [
      {
        title: "Government",
        items: [
          { key: "government", label: "Government", href: "/government" },
          { key: "factions", label: "Factions", href: "/factions" },
          { key: "alliance", label: "Alliance", href: "/alliance" },
        ],
      },
      {
        title: "Civilization",
        items: [
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
      {
        title: "Communications",
        items: [
          { key: "messages", label: "Messages", href: "/messages" },
          { key: "friends", label: "Friends List", href: "/friends" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },
  "/friends": {
    label: "Government",
    sections: [
      {
        title: "Government",
        items: [
          { key: "government", label: "Government", href: "/government" },
          { key: "factions", label: "Factions", href: "/factions" },
          { key: "alliance", label: "Alliance", href: "/alliance" },
        ],
      },
      {
        title: "Civilization",
        items: [
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
      {
        title: "Communications",
        items: [
          { key: "messages", label: "Messages", href: "/messages" },
          { key: "friends", label: "Friends List", href: "/friends" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },
  "/forums": {
    label: "Government",
    sections: [
      {
        title: "Government",
        items: [
          { key: "government", label: "Government", href: "/government" },
          { key: "factions", label: "Factions", href: "/factions" },
          { key: "alliance", label: "Alliance", href: "/alliance" },
        ],
      },
      {
        title: "Civilization",
        items: [
          { key: "civ-mgmt", label: "Civilization Mgmt", href: "/civilization-management" },
          { key: "civ-systems", label: "Civ Systems", href: "/civilization-systems" },
        ],
      },
      {
        title: "Communications",
        items: [
          { key: "messages", label: "Messages", href: "/messages" },
          { key: "friends", label: "Friends List", href: "/friends" },
          { key: "forums", label: "Forums", href: "/forums" },
        ],
      },
    ],
  },

  // Society submenu
  "/guilds": {
    label: "Society",
    sections: [
      {
        title: "Progression",
        items: [
          { key: "season-pass", label: "Season Pass", href: "/season-pass" },
          { key: "battle-pass", label: "Battle Pass", href: "/battle-pass" },
          { key: "commander", label: "Commander", href: "/commander" },
        ],
      },
      {
        title: "Social",
        items: [
          { key: "guilds", label: "Guilds", href: "/guilds" },
          { key: "raids", label: "Raids", href: "/raids" },
          { key: "raid-bosses", label: "Raid Bosses", href: "/raid-bosses" },
          { key: "raid-finder", label: "Raid Finder", href: "/raid-finder" },
        ],
      },
    ],
  },
  "/raids": {
    label: "Society",
    sections: [
      {
        title: "Progression",
        items: [
          { key: "season-pass", label: "Season Pass", href: "/season-pass" },
          { key: "battle-pass", label: "Battle Pass", href: "/battle-pass" },
          { key: "commander", label: "Commander", href: "/commander" },
        ],
      },
      {
        title: "Social",
        items: [
          { key: "guilds", label: "Guilds", href: "/guilds" },
          { key: "raids", label: "Raids", href: "/raids" },
          { key: "raid-bosses", label: "Raid Bosses", href: "/raid-bosses" },
          { key: "raid-finder", label: "Raid Finder", href: "/raid-finder" },
        ],
      },
    ],
  },
  "/raid-bosses": {
    label: "Society",
    sections: [
      {
        title: "Progression",
        items: [
          { key: "season-pass", label: "Season Pass", href: "/season-pass" },
          { key: "battle-pass", label: "Battle Pass", href: "/battle-pass" },
          { key: "commander", label: "Commander", href: "/commander" },
        ],
      },
      {
        title: "Social",
        items: [
          { key: "guilds", label: "Guilds", href: "/guilds" },
          { key: "raids", label: "Raids", href: "/raids" },
          { key: "raid-bosses", label: "Raid Bosses", href: "/raid-bosses" },
          { key: "raid-finder", label: "Raid Finder", href: "/raid-finder" },
        ],
      },
    ],
  },
  "/raid-finder": {
    label: "Society",
    sections: [
      {
        title: "Progression",
        items: [
          { key: "season-pass", label: "Season Pass", href: "/season-pass" },
          { key: "battle-pass", label: "Battle Pass", href: "/battle-pass" },
          { key: "commander", label: "Commander", href: "/commander" },
        ],
      },
      {
        title: "Social",
        items: [
          { key: "guilds", label: "Guilds", href: "/guilds" },
          { key: "raids", label: "Raids", href: "/raids" },
          { key: "raid-bosses", label: "Raid Bosses", href: "/raid-bosses" },
          { key: "raid-finder", label: "Raid Finder", href: "/raid-finder" },
        ],
      },
    ],
  },
  "/season-pass": {
    label: "Society",
    sections: [
      {
        title: "Progression",
        items: [
          { key: "season-pass", label: "Season Pass", href: "/season-pass" },
          { key: "battle-pass", label: "Battle Pass", href: "/battle-pass" },
          { key: "commander", label: "Commander", href: "/commander" },
        ],
      },
      {
        title: "Social",
        items: [
          { key: "guilds", label: "Guilds", href: "/guilds" },
          { key: "raids", label: "Raids", href: "/raids" },
          { key: "raid-bosses", label: "Raid Bosses", href: "/raid-bosses" },
          { key: "raid-finder", label: "Raid Finder", href: "/raid-finder" },
        ],
      },
    ],
  },
  "/battle-pass": {
    label: "Society",
    sections: [
      {
        title: "Progression",
        items: [
          { key: "season-pass", label: "Season Pass", href: "/season-pass" },
          { key: "battle-pass", label: "Battle Pass", href: "/battle-pass" },
          { key: "commander", label: "Commander", href: "/commander" },
        ],
      },
      {
        title: "Social",
        items: [
          { key: "guilds", label: "Guilds", href: "/guilds" },
          { key: "raids", label: "Raids", href: "/raids" },
          { key: "raid-bosses", label: "Raid Bosses", href: "/raid-bosses" },
          { key: "raid-finder", label: "Raid Finder", href: "/raid-finder" },
        ],
      },
    ],
  },
  "/commander": {
    label: "Society",
    sections: [
      {
        title: "Progression",
        items: [
          { key: "season-pass", label: "Season Pass", href: "/season-pass" },
          { key: "battle-pass", label: "Battle Pass", href: "/battle-pass" },
          { key: "commander", label: "Commander", href: "/commander" },
        ],
      },
      {
        title: "Social",
        items: [
          { key: "guilds", label: "Guilds", href: "/guilds" },
          { key: "raids", label: "Raids", href: "/raids" },
          { key: "raid-bosses", label: "Raid Bosses", href: "/raid-bosses" },
          { key: "raid-finder", label: "Raid Finder", href: "/raid-finder" },
        ],
      },
    ],
  },

  // Situation Log submenu
  "/universe-events": {
    label: "Situation Log",
    sections: [
      {
        title: "Events",
        items: [
          { key: "events", label: "Universe Events", href: "/universe-events" },
          { key: "story", label: "Story Mode", href: "/story-mode" },
        ],
      },
      {
        title: "Achievements",
        items: [
          { key: "relics", label: "Relics", href: "/relics" },
          { key: "achievements", label: "Achievements", href: "/achievements" },
          { key: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
        ],
      },
    ],
  },
  "/story-mode": {
    label: "Situation Log",
    sections: [
      {
        title: "Events",
        items: [
          { key: "events", label: "Universe Events", href: "/universe-events" },
          { key: "story", label: "Story Mode", href: "/story-mode" },
        ],
      },
      {
        title: "Achievements",
        items: [
          { key: "relics", label: "Relics", href: "/relics" },
          { key: "achievements", label: "Achievements", href: "/achievements" },
          { key: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
        ],
      },
    ],
  },
  "/relics": {
    label: "Situation Log",
    sections: [
      {
        title: "Events",
        items: [
          { key: "events", label: "Universe Events", href: "/universe-events" },
          { key: "story", label: "Story Mode", href: "/story-mode" },
        ],
      },
      {
        title: "Achievements",
        items: [
          { key: "relics", label: "Relics", href: "/relics" },
          { key: "achievements", label: "Achievements", href: "/achievements" },
          { key: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
        ],
      },
    ],
  },
  "/achievements": {
    label: "Situation Log",
    sections: [
      {
        title: "Events",
        items: [
          { key: "events", label: "Universe Events", href: "/universe-events" },
          { key: "story", label: "Story Mode", href: "/story-mode" },
        ],
      },
      {
        title: "Achievements",
        items: [
          { key: "relics", label: "Relics", href: "/relics" },
          { key: "achievements", label: "Achievements", href: "/achievements" },
          { key: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
        ],
      },
    ],
  },
  "/leaderboard": {
    label: "Situation Log",
    sections: [
      {
        title: "Events",
        items: [
          { key: "events", label: "Universe Events", href: "/universe-events" },
          { key: "story", label: "Story Mode", href: "/story-mode" },
        ],
      },
      {
        title: "Achievements",
        items: [
          { key: "relics", label: "Relics", href: "/relics" },
          { key: "achievements", label: "Achievements", href: "/achievements" },
          { key: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
        ],
      },
    ],
  },

  // Market submenu
  "/market": {
    label: "Market",
    sections: [
      {
        title: "Commerce",
        items: [
          { key: "market-trade", label: "Market", href: "/market" },
          { key: "merchants", label: "Merchants", href: "/merchants" },
          { key: "storefront", label: "Storefront", href: "/storefront" },
        ],
      },
    ],
  },
  "/merchants": {
    label: "Market",
    sections: [
      {
        title: "Commerce",
        items: [
          { key: "market-trade", label: "Market", href: "/market" },
          { key: "merchants", label: "Merchants", href: "/merchants" },
          { key: "storefront", label: "Storefront", href: "/storefront" },
        ],
      },
    ],
  },
  "/storefront": {
    label: "Market",
    sections: [
      {
        title: "Commerce",
        items: [
          { key: "market-trade", label: "Market", href: "/market" },
          { key: "merchants", label: "Merchants", href: "/merchants" },
          { key: "storefront", label: "Storefront", href: "/storefront" },
        ],
      },
    ],
  },

  // Colonies submenu
  "/colonies": {
    label: "Colonies",
    sections: [
      {
        title: "Colonies",
        items: [
          { key: "colonies", label: "Colonies", href: "/colonies" },
          { key: "planet-command", label: "Planet Command", href: "/planet-command" },
          { key: "colony-mgmt", label: "Colony Management", href: "/colony-management" },
          { key: "resource-refinery", label: "Resource Refinery", href: "/resource-refinery" },
        ],
      },
      {
        title: "Defense",
        items: [
          { key: "planetary-defense", label: "Planetary Defense", href: "/planetary-defense" },
          { key: "planet-occupation", label: "Planetary Occupation", href: "/planet-occupation" },
        ],
      },
    ],
  },
  "/planet-command": {
    label: "Colonies",
    sections: [
      {
        title: "Colonies",
        items: [
          { key: "colonies", label: "Colonies", href: "/colonies" },
          { key: "planet-command", label: "Planet Command", href: "/planet-command" },
          { key: "colony-mgmt", label: "Colony Management", href: "/colony-management" },
          { key: "resource-refinery", label: "Resource Refinery", href: "/resource-refinery" },
        ],
      },
      {
        title: "Defense",
        items: [
          { key: "planetary-defense", label: "Planetary Defense", href: "/planetary-defense" },
          { key: "planet-occupation", label: "Planetary Occupation", href: "/planet-occupation" },
        ],
      },
    ],
  },
  "/colony-management": {
    label: "Colonies",
    sections: [
      {
        title: "Colonies",
        items: [
          { key: "colonies", label: "Colonies", href: "/colonies" },
          { key: "planet-command", label: "Planet Command", href: "/planet-command" },
          { key: "colony-mgmt", label: "Colony Management", href: "/colony-management" },
          { key: "resource-refinery", label: "Resource Refinery", href: "/resource-refinery" },
        ],
      },
      {
        title: "Defense",
        items: [
          { key: "planetary-defense", label: "Planetary Defense", href: "/planetary-defense" },
          { key: "planet-occupation", label: "Planetary Occupation", href: "/planet-occupation" },
        ],
      },
    ],
  },
  "/resource-refinery": {
    label: "Colonies",
    sections: [
      {
        title: "Colonies",
        items: [
          { key: "colonies", label: "Colonies", href: "/colonies" },
          { key: "planet-command", label: "Planet Command", href: "/planet-command" },
          { key: "colony-mgmt", label: "Colony Management", href: "/colony-management" },
          { key: "resource-refinery", label: "Resource Refinery", href: "/resource-refinery" },
        ],
      },
      {
        title: "Defense",
        items: [
          { key: "planetary-defense", label: "Planetary Defense", href: "/planetary-defense" },
          { key: "planet-occupation", label: "Planetary Occupation", href: "/planet-occupation" },
        ],
      },
    ],
  },
  "/planetary-defense": {
    label: "Colonies",
    sections: [
      {
        title: "Colonies",
        items: [
          { key: "colonies", label: "Colonies", href: "/colonies" },
          { key: "planet-command", label: "Planet Command", href: "/planet-command" },
          { key: "colony-mgmt", label: "Colony Management", href: "/colony-management" },
          { key: "resource-refinery", label: "Resource Refinery", href: "/resource-refinery" },
        ],
      },
      {
        title: "Defense",
        items: [
          { key: "planetary-defense", label: "Planetary Defense", href: "/planetary-defense" },
          { key: "planet-occupation", label: "Planetary Occupation", href: "/planet-occupation" },
        ],
      },
    ],
  },
  "/planet-occupation": {
    label: "Colonies",
    sections: [
      {
        title: "Colonies",
        items: [
          { key: "colonies", label: "Colonies", href: "/colonies" },
          { key: "planet-command", label: "Planet Command", href: "/planet-command" },
          { key: "colony-mgmt", label: "Colony Management", href: "/colony-management" },
          { key: "resource-refinery", label: "Resource Refinery", href: "/resource-refinery" },
        ],
      },
      {
        title: "Defense",
        items: [
          { key: "planetary-defense", label: "Planetary Defense", href: "/planetary-defense" },
          { key: "planet-occupation", label: "Planetary Occupation", href: "/planet-occupation" },
        ],
      },
    ],
  },
};

export function getPageSubmenu(pathname: string): PageSubmenuConfig | null {
  return PAGE_SUBMENUS[pathname] ?? null;
}

export default PAGE_SUBMENUS;
