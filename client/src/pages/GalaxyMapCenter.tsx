import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Map, Star, Orbit, Compass, Maximize2,
  Search, Grid3x3, Hexagon,
  Telescope, Layers, Rocket,
  Sun, Download, Info, Image as ImageIcon,
  CircleDot
} from "lucide-react";
import * as THREE from "three";
import { UNIVERSE_CONFIG, GalaxyType, StarType, PlanetType } from "@shared/config/universeConfig";

// ─── Galaxy Map Categories & Subcategories (Stellaris-scale) ────────────────

interface GalaxyMapCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  imageUrl: string;
  subcategories: GalaxyMapSubcategory[];
}

interface GalaxyMapSubcategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  mapType: "galaxy" | "system" | "universe" | "sector";
  galaxyType?: GalaxyType;
  starCount?: number;
  scale: "galactic" | "interstellar" | "system" | "planetary";
}

const GALAXY_MAP_CATEGORIES: GalaxyMapCategory[] = [
  {
    id: "spiral-galaxies",
    name: "Spiral Galaxies",
    description: "Classic spiral arm structures like the Milky Way — most common in the universe",
    icon: Compass,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/NGC_4414_%28NASA-med%29.jpg/1024px-NGC_4414_%28NASA-med%29.jpg",
    subcategories: [
      {
        id: "grand-design-spiral",
        name: "Grand Design Spiral",
        description: "Well-defined prominent spiral arms (M51, M101 type)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Messier_101_%28M101%29.png/800px-Messier_101_%28M101%29.png",
        mapType: "galaxy",
        galaxyType: "spiral",
        starCount: 4000,
        scale: "galactic",
      },
      {
        id: "flocculent-spiral",
        name: "Flocculent Spiral",
        description: "Patchy, discontinuous arms (NGC 2841 type)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/NGC_2841_-_NOAO.jpg/800px-NGC_2841_-_NOAO.jpg",
        mapType: "galaxy",
        galaxyType: "spiral",
        starCount: 3000,
        scale: "galactic",
      },
      {
        id: "barred-spiral",
        name: "Barred Spiral",
        description: "Central bar-shaped structure with arms (Milky Way type)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/1024px-ESO-VLT-Laser-phot-33a-07.jpg",
        mapType: "galaxy",
        galaxyType: "spiral",
        starCount: 5000,
        scale: "galactic",
      },
    ],
  },
  {
    id: "elliptical-galaxies",
    name: "Elliptical Galaxies",
    description: "Smooth, featureless collections of older stars — range from dwarf to giant",
    icon: CircleDot,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/MESSIER_059%2C_AN_ELLIPTICAL_GALAXY_IN_THE_GALAXY_CLUSTER_VIRGO%2C_IMAGE_FROM_HUBBLE_SPACE_TELESCOPE.jpg/800px-MESSIER_059%2C_AN_ELLIPTICAL_GALAXY_IN_THE_GALAXY_CLUSTER_VIRGO%2C_IMAGE_FROM_HUBBLE_SPACE_TELESCOPE.jpg",
    subcategories: [
      {
        id: "dwarf-elliptical",
        name: "Dwarf Elliptical",
        description: "Small, low-luminosity ellipticals (Satellite galaxies)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/NGC_185.jpg/800px-NGC_185.jpg",
        mapType: "galaxy",
        galaxyType: "elliptical",
        starCount: 500,
        scale: "galactic",
      },
      {
        id: "giant-elliptical",
        name: "Giant Elliptical",
        description: "Massive ellipticals containing trillions of stars (M87 type)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/M87_jet.jpg/800px-M87_jet.jpg",
        mapType: "galaxy",
        galaxyType: "elliptical",
        starCount: 8000,
        scale: "galactic",
      },
      {
        id: "cD-galaxy",
        name: "cD Galaxy (Supergiant)",
        description: "Dominant galaxies at cluster centers (NGC 4874 type)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/NGC_4874_HST.jpg/800px-NGC_4874_HST.jpg",
        mapType: "galaxy",
        galaxyType: "elliptical",
        starCount: 10000,
        scale: "galactic",
      },
    ],
  },
  {
    id: "irregular-galaxies",
    name: "Irregular Galaxies",
    description: "No defined shape — often disturbed by gravitational interactions",
    icon: Hexagon,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Magellanic_Clouds_%28captured_by_the_Hubble_Space_Telescope%29.jpg/800px-The_Magellanic_Clouds_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
    subcategories: [
      {
        id: "magellanic-irregular",
        name: "Magellanic Irregular",
        description: "Small irregulars with some structure (LMC/SMC type)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/LMC_-_NOAO.jpg/800px-LMC_-_NOAO.jpg",
        mapType: "galaxy",
        galaxyType: "irregular",
        starCount: 1500,
        scale: "galactic",
      },
      {
        id: "interacting-irregular",
        name: "Interacting Galaxy",
        description: "Galaxies in collision/merger (Antennae type)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Antennae_Galaxies_by_HST.jpg/800px-Antennae_Galaxies_by_HST.jpg",
        mapType: "galaxy",
        galaxyType: "irregular",
        starCount: 2000,
        scale: "galactic",
      },
    ],
  },
  {
    id: "ring-galaxies",
    name: "Ring Galaxies",
    description: "Rare galaxies with ring-like structure of stars and gas",
    icon: Orbit,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/NGC_4650A-VLT-1999.jpg/800px-NGC_4650A-VLT-1999.jpg",
    subcategories: [
      {
        id: "cartwheel-galaxy",
        name: "Cartwheel Galaxy",
        description: "Collision-formed ring (Cartwheel Galaxy type)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Cartwheel_Galaxy_2022_%28captured_by_the_Hubble_Space_Telescope%29.jpg/800px-Cartwheel_Galaxy_2022_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
        mapType: "galaxy",
        galaxyType: "ring",
        starCount: 2500,
        scale: "galactic",
      },
      {
        id: "polar-ring-galaxy",
        name: "Polar Ring Galaxy",
        description: "Ring orbiting perpendicular to disc (NGC 4650A type)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/NGC_4650A-VLT-1999.jpg/800px-NGC_4650A-VLT-1999.jpg",
        mapType: "galaxy",
        galaxyType: "ring",
        starCount: 1800,
        scale: "galactic",
      },
    ],
  },
  {
    id: "star-systems",
    name: "Star Systems",
    description: "Individual star systems with planets, asteroids, and orbital mechanics",
    icon: Sun,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solar_sys8.jpg/1024px-Solar_sys8.jpg",
    subcategories: [
      {
        id: "sol-type",
        name: "Sol-Type System",
        description: "G-type main sequence with inner rocky + outer gas giants",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solar_sys8.jpg/1024px-Solar_sys8.jpg",
        mapType: "system",
        starCount: 1,
        scale: "system",
      },
      {
        id: "binary-star",
        name: "Binary Star System",
        description: "Two orbiting stars with complex habitable zones",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Alpha_Centauri.jpg/800px-Alpha_Centauri.jpg",
        mapType: "system",
        starCount: 2,
        scale: "system",
      },
      {
        id: "triple-star",
        name: "Triple/Multiple Star",
        description: "Three or more gravitationally bound stars",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Alnitak%2C_Saiph%2C_Mintaka_HB_2012.jpg/800px-Alnitak%2C_Saiph%2C_Mintaka_HB_2012.jpg",
        mapType: "system",
        starCount: 3,
        scale: "system",
      },
      {
        id: "neutron-star-system",
        name: "Neutron Star System",
        description: "Pulsar/millisecond pulsar with accretion disk",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Neutron_star_collision_renders.jpg/800px-Neutron_star_collision_renders.jpg",
        mapType: "system",
        starCount: 1,
        scale: "system",
      },
      {
        id: "black-hole-system",
        name: "Black Hole System",
        description: "Stellar/massive black hole with accretion and jets",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/800px-Black_hole_-_Messier_87_crop_max_res.jpg",
        mapType: "system",
        starCount: 1,
        scale: "system",
      },
    ],
  },
  {
    id: "nebulae",
    name: "Nebulae",
    description: "Interstellar clouds of dust, hydrogen, helium — birthplaces and graves of stars",
    icon: Layers,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Eagle_nebula_pillars.jpg/800px-Eagle_nebula_pillars.jpg",
    subcategories: [
      {
        id: "emission-nebula",
        name: "Emission Nebula",
        description: "Ionized gas glowing with characteristic colors (Orion Nebula)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/800px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
        mapType: "sector",
        starCount: 100,
        scale: "interstellar",
      },
      {
        id: "planetary-nebula",
        name: "Planetary Nebula",
        description: "Shell of ionized gas expelled by dying stars (Ring Nebula)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ring_Nebula_%28M57%29_-_James_Webb_Space_Telescope.jpg/800px-Ring_Nebula_%28M57%29_-_James_Webb_Space_Telescope.jpg",
        mapType: "sector",
        starCount: 50,
        scale: "interstellar",
      },
      {
        id: "supernova-remnant",
        name: "Supernova Remnant",
        description: "Expanding shell of material from stellar explosions (Crab Nebula)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/800px-Crab_Nebula.jpg",
        mapType: "sector",
        starCount: 200,
        scale: "interstellar",
      },
      {
        id: "dark-nebula",
        name: "Dark Molecular Cloud",
        description: "Dense dust clouds blocking background stars (Horsehead)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Barnard_68.jpg/800px-Barnard_68.jpg",
        mapType: "sector",
        starCount: 30,
        scale: "interstellar",
      },
    ],
  },
  {
    id: "deep-field",
    name: "Deep Field & Universe Scale",
    description: "Large-scale structure of the universe — galaxy clusters, filaments, voids",
    icon: Telescope,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hubble_ultra_deep_field.jpg/800px-Hubble_ultra_deep_field.jpg",
    subcategories: [
      {
        id: "galaxy-cluster",
        name: "Galaxy Cluster",
        description: "Gravitationally bound groups of hundreds of galaxies (Coma Cluster)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/NASA-HS201427a-HubbleUltraDeepField2014-20140603.jpg/800px-NASA-HS201427a-HubbleUltraDeepField2014-20140603.jpg",
        mapType: "universe",
        starCount: 50000,
        scale: "galactic",
      },
      {
        id: "cosmic-web",
        name: "Cosmic Web Filament",
        description: "Large-scale filamentary structure of dark matter and galaxies",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Illustration_of_the_cosmic_web.jpg/800px-Illustration_of_the_cosmic_web.jpg",
        mapType: "universe",
        starCount: 100000,
        scale: "galactic",
      },
      {
        id: "deep-field-view",
        name: "Deep Field View",
        description: "Hubble/JWST deep field — thousands of galaxies in one frame",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/HUDF-JD2.jpg/800px-HUDF-JD2.jpg",
        mapType: "universe",
        starCount: 200000,
        scale: "galactic",
      },
    ],
  },
];

// ─── Real Universe Scale Constants (based on Stellaris) ─────────────────────

const UNIVERSE_SCALES = {
  tiny: { name: "Tiny", systems: 400, galaxies: 1, description: "Small cluster — quick matches" },
  small: { name: "Small", systems: 800, galaxies: 4, description: "Local group scale" },
  medium: { name: "Medium", systems: 1600, galaxies: 16, description: "Standard Stellaris scale" },
  large: { name: "Large", systems: 3200, galaxies: 64, description: "Massive — 64 galaxies" },
  huge: { name: "Huge", systems: 6400, galaxies: 256, description: "Full Stellaris scope" },
  grand: { name: "Grand Admiral", systems: 12800, galaxies: 1024, description: "Maximum universe" },
} as const;

// ─── Three.js Galaxy 3D View ────────────────────────────────────────────────

function Galaxy3DView({
  galaxyType,
  starCount,
  className,
}: {
  galaxyType: GalaxyType;
  starCount: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    camera.position.set(0, 200, 400);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Generate stars based on galaxy type
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const starColors = {
      O: new THREE.Color(0x9bb0ff),
      B: new THREE.Color(0xaabfff),
      A: new THREE.Color(0xcad7ff),
      F: new THREE.Color(0xf8f7ff),
      G: new THREE.Color(0xfff4ea),
      K: new THREE.Color(0xffd2a1),
      M: new THREE.Color(0xffcc6f),
    };

    for (let i = 0; i < starCount; i++) {
      let x: number, y: number, z: number;

      switch (galaxyType) {
        case "spiral": {
          const arm = Math.floor(Math.random() * 4);
          const angle = (arm * Math.PI) / 2 + Math.random() * Math.PI * 6;
          const radius = Math.random() * 300;
          const armOffset = Math.random() * 30 - 15;
          x = Math.cos(angle) * radius + armOffset;
          z = Math.sin(angle) * radius + armOffset;
          y = (Math.random() - 0.5) * 20 * (1 - radius / 400);
          break;
        }
        case "elliptical": {
          const e = 0.6 + Math.random() * 0.4;
          const r = Math.random() * 250;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          x = r * Math.sin(phi) * Math.cos(theta) * e;
          y = r * Math.sin(phi) * Math.sin(theta) * 0.4;
          z = r * Math.cos(phi) * e;
          break;
        }
        case "ring": {
          const ringAngle = Math.random() * Math.PI * 2;
          const ringRadius = 150 + Math.random() * 50;
          const ringWidth = Math.random() * 20 - 10;
          x = Math.cos(ringAngle) * (ringRadius + ringWidth);
          z = Math.sin(ringAngle) * (ringRadius + ringWidth);
          y = (Math.random() - 0.5) * 15;
          break;
        }
        default: {
          x = (Math.random() - 0.5) * 400;
          y = (Math.random() - 0.5) * 100;
          z = (Math.random() - 0.5) * 400;
          break;
        }
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const type = (["O", "B", "A", "F", "G", "K", "M"] as StarType[])[
        Math.floor(Math.random() * 7)
      ];
      const color = starColors[type];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.5 + Math.random() * 2;
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    starsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Ambient glow
    const glowGeometry = new THREE.SphereGeometry(20, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: galaxyType === "elliptical" ? 0xffd700 : 0x4488ff,
      transparent: true,
      opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / width) * 2 - 1;
      mouseY = (e.clientY / height) * 2 - 1;
    };
    container.addEventListener("mousemove", onMouseMove);

    let rotation = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      rotation += 0.002;
      stars.rotation.y = rotation;
      glow.rotation.y = rotation;

      camera.position.x = Math.sin(mouseX * 0.5) * 400;
      camera.position.y = 200 + mouseY * 100;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [galaxyType, starCount]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full rounded-lg overflow-hidden", className)}
    />
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Map Card Component ─────────────────────────────────────────────────────

function MapCard({
  subcategory,
  onSelect,
}: {
  subcategory: GalaxyMapSubcategory;
  onSelect: () => void;
}) {
  return (
    <Card
      className="group cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-200 overflow-hidden"
      onClick={onSelect}
    >
      <div className="relative h-40 bg-slate-900 overflow-hidden">
        <img
          src={subcategory.imageUrl}
          alt={subcategory.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
                <rect fill="#0f172a" width="400" height="200"/>
                <circle cx="200" cy="100" r="60" fill="#1e3a5f" opacity="0.5"/>
                <circle cx="200" cy="100" r="3" fill="#ffd700"/>
                ${Array.from({length: 30}, () => `<circle cx="${Math.random()*400}" cy="${Math.random()*200}" r="${Math.random()*2}" fill="white" opacity="${Math.random()}"/>`).join("")}
              </svg>`
            )}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <Badge variant="secondary" className="text-[9px] bg-white/20 text-white backdrop-blur-sm">
            {subcategory.scale.toUpperCase()}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <h4 className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors">
          {subcategory.name}
        </h4>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{subcategory.description}</p>
        {subcategory.starCount && (
          <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
            <Star className="w-3 h-3" />
            <span>{subcategory.starCount.toLocaleString()} stars</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Category Sidebar ───────────────────────────────────────────────────────

function CategorySidebar({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: GalaxyMapCategory[];
  activeCategory: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="w-56 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
      <div className="p-3 border-b border-slate-200">
        <h3 className="font-orbitron text-xs font-bold text-slate-900 tracking-wider uppercase">
          Map Categories
        </h3>
      </div>
      <div className="py-1">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors text-[12px]",
            activeCategory === null
              ? "bg-primary/5 text-primary font-semibold"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Grid3x3 className="w-4 h-4 shrink-0" />
          <span>All Categories</span>
        </button>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors text-[12px]",
                activeCategory === cat.id
                  ? "bg-primary/5 text-primary font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="truncate">{cat.name}</div>
                <div className="text-[9px] text-slate-400 truncate">{cat.subcategories.length} maps</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Map Detail Panel ───────────────────────────────────────────────────────

function MapDetailPanel({
  subcategory,
  onClose,
}: {
  subcategory: GalaxyMapSubcategory;
  onClose: () => void;
}) {
  const [show3D, setShow3D] = useState(false);
  const [selectedScale, setSelectedScale] = useState<keyof typeof UNIVERSE_SCALES>("medium");

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <div
        className="w-full max-w-[1100px] mx-4 bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="font-orbitron text-lg font-bold text-slate-900">{subcategory.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{subcategory.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShow3D(!show3D)}>
              {show3D ? <ImageIcon className="w-4 h-4 mr-1" /> : <Maximize2 className="w-4 h-4 mr-1" />}
              {show3D ? "2D Image" : "3D View"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Map visualization */}
          <div className="flex-1 bg-slate-900 relative">
            {show3D ? (
              <Galaxy3DView
                galaxyType={subcategory.galaxyType || "spiral"}
                starCount={subcategory.starCount || 2000}
                className="w-full h-full"
              />
            ) : (
              <img
                src={subcategory.imageUrl}
                alt={subcategory.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>

          {/* Right: Info panel */}
          <div className="w-72 border-l border-slate-200 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Scale selector */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Universe Scale
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.entries(UNIVERSE_SCALES) as [keyof typeof UNIVERSE_SCALES, typeof UNIVERSE_SCALES[keyof typeof UNIVERSE_SCALES]][]).map(
                    ([key, scale]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedScale(key)}
                        className={cn(
                          "px-2 py-1.5 text-[10px] rounded border transition-colors text-left",
                          selectedScale === key
                            ? "border-primary bg-primary/5 text-primary font-semibold"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        )}
                      >
                        <div className="font-semibold">{scale.name}</div>
                        <div className="text-[8px] text-slate-400">{scale.systems.toLocaleString()} systems</div>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Map info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Map Type</span>
                  <Badge variant="outline" className="text-[9px]">{subcategory.mapType}</Badge>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Scale</span>
                  <span className="font-semibold text-slate-700">{subcategory.scale}</span>
                </div>
                {subcategory.starCount && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Stars</span>
                    <span className="font-semibold text-slate-700">{subcategory.starCount.toLocaleString()}</span>
                  </div>
                )}
                {subcategory.galaxyType && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Galaxy Type</span>
                    <span className="font-semibold text-slate-700 capitalize">{subcategory.galaxyType}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Button className="w-full" size="sm">
                  <Rocket className="w-4 h-4 mr-2" />
                  Generate Map
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Configuration
                </Button>
                <Button variant="ghost" className="w-full" size="sm">
                  <Info className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </div>

              {/* Scale stats */}
              <div className="bg-slate-50 rounded-lg p-3 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Scale Statistics
                </div>
                <div className="text-[11px] text-slate-600">
                  {UNIVERSE_SCALES[selectedScale].description}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                  <div>
                    <div className="text-slate-400">Galaxies</div>
                    <div className="font-bold text-slate-700">{UNIVERSE_SCALES[selectedScale].galaxies}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Systems/Galaxy</div>
                    <div className="font-bold text-slate-700">
                      {Math.floor(UNIVERSE_SCALES[selectedScale].systems / UNIVERSE_SCALES[selectedScale].galaxies)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Sectors</div>
                    <div className="font-bold text-slate-700">
                      {Math.floor(UNIVERSE_SCALES[selectedScale].systems / UNIVERSE_SCALES[selectedScale].galaxies / 20)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Total Stars</div>
                    <div className="font-bold text-slate-700">
                      ~{(UNIVERSE_SCALES[selectedScale].systems * 4.5).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────

export default function GalaxyMapCenter() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<GalaxyMapSubcategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScale, setSelectedScale] = useState<keyof typeof UNIVERSE_SCALES>("medium");
  const { toast } = useToast();

  const filteredCategories = useMemo(() => {
    if (!activeCategory) return GALAXY_MAP_CATEGORIES;
    return GALAXY_MAP_CATEGORIES.filter((c) => c.id === activeCategory);
  }, [activeCategory]);

  const allSubcategories = useMemo(() => {
    return GALAXY_MAP_CATEGORIES.flatMap((c) =>
      c.subcategories.map((s) => ({ ...s, categoryName: c.name }))
    );
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return allSubcategories.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q)
    );
  }, [searchQuery, allSubcategories]);

  const displayItems = searchResults || filteredCategories.flatMap((c) => c.subcategories);

  return (
    <GameLayout>
      <div className="h-full flex flex-col bg-white">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            <h1 className="font-orbitron text-sm font-bold text-slate-900 tracking-wider uppercase">
              Galaxy Map Center
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search maps, galaxies, nebulae..."
                className="pl-9 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedScale} onValueChange={(v) => setSelectedScale(v as keyof typeof UNIVERSE_SCALES)}>
              <SelectTrigger className="w-40 text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(UNIVERSE_SCALES) as [keyof typeof UNIVERSE_SCALES, typeof UNIVERSE_SCALES[keyof typeof UNIVERSE_SCALES]][]).map(
                  ([key, scale]) => (
                    <SelectItem key={key} value={key} className="text-[11px]">
                      {scale.name} ({scale.systems.toLocaleString()} systems)
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Category sidebar */}
          <CategorySidebar
            categories={GALAXY_MAP_CATEGORIES}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />

          {/* Map grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {searchResults ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Search Results ({searchResults.length})
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                {filteredCategories.map((cat) => (
                  <div key={cat.id} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <cat.icon className="w-4 h-4 text-primary" />
                      <h3 className="font-orbitron text-xs font-bold text-slate-900 tracking-wider uppercase">
                        {cat.name}
                      </h3>
                      <Badge variant="secondary" className="text-[9px]">
                        {cat.subcategories.length} maps
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">{cat.description}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {cat.subcategories.map((sub) => (
                        <MapCard
                          key={sub.id}
                          subcategory={sub}
                          onSelect={() => setSelectedMap(sub)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {searchResults.map((sub) => (
                  <MapCard
                    key={sub.id}
                    subcategory={sub}
                    onSelect={() => setSelectedMap(sub)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selectedMap && (
        <MapDetailPanel
          subcategory={selectedMap}
          onClose={() => setSelectedMap(null)}
        />
      )}
    </GameLayout>
  );
}

// Re-export Galaxy3DView for use in other pages
export { Galaxy3DView };
