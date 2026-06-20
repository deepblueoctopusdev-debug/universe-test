import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Globe, Map, Layers, Eye, RotateCcw, Maximize2, Minimize2,
  ChevronRight, ChevronDown, Star, Orbit, Compass, Sparkles,
  Telescope, Rocket, Shield, Zap, Sun, Moon, Crosshair,
  Grid3x3, Hexagon, Triangle, CircleDot, Search, Info, Play,
  Pause, SkipForward, Settings, Download, Upload, RefreshCw
} from "lucide-react";

const GALAXY_TYPES = [
  {
    id: "spiral",
    name: "Spiral Galaxy",
    description: "Classic spiral arms radiating from a central bulge. Rich in star formation and habitable worlds.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/NGC_4414_%28NASA-med%29.jpg/1280px-NGC_4414_%28NASA-med%29.jpg",
    arms: [2, 3, 4],
    size: "100,000 ly",
    stars: "100-400 billion",
    habitability: "High",
    color: "from-blue-500 to-purple-600",
    subtypes: [
      { id: "spiral-2", name: "Two-Arm Spiral", arms: 2, desc: "Barred spiral with two prominent arms" },
      { id: "spiral-3", name: "Three-Arm Spiral", arms: 3, desc: "Trilateral symmetry" },
      { id: "spiral-4", name: "Four-Arm Spiral", arms: 4, desc: "Grand design spiral" },
      { id: "spiral-barred", name: "Barred Spiral", arms: 2, desc: "Central bar structure" },
    ]
  },
  {
    id: "elliptical",
    name: "Elliptical Galaxy",
    description: "Smooth, featureless light profiles. Older stellar populations with little gas or dust.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Elliptical_galaxy_M87_-_heic0610a.jpg/1280px-Elliptical_galaxy_M87_-_heic0610a.jpg",
    arms: [],
    size: "10,000-1,000,000 ly",
    stars: "10 million-100 trillion",
    habitability: "Low",
    color: "from-amber-500 to-orange-600",
    subtypes: [
      { id: "elliptical-e0", name: "E0 - Spherical", arms: 0, desc: "Nearly perfectly round" },
      { id: "elliptical-e3", name: "E3 - Elliptical", arms: 0, desc: "Mildly elongated" },
      { id: "elliptical-e7", name: "E7 - Flattened", arms: 0, desc: "Highly elongated" },
      { id: "elliptical-dwarf", name: "Dwarf Elliptical", arms: 0, desc: "Small, low luminosity" },
    ]
  },
  {
    id: "ring",
    name: "Ring Galaxy",
    description: "Distinctive ring structure of stars and gas. Formed by galactic collisions.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/NGC_7293_%28aka%29.jpg/1280px-NGC_7293_%28aka%29.jpg",
    arms: [1],
    size: "75,000 ly",
    stars: "10-50 billion",
    habitability: "Medium",
    color: "from-cyan-500 to-blue-600",
    subtypes: [
      { id: "ring-classic", name: "Classic Ring", arms: 1, desc: "Perfect circular ring" },
      { id: "ring-polar", name: "Polar Ring", arms: 1, desc: "Ring perpendicular to disk" },
      { id: "ring-uncertain", name: "Uncertain Ring", arms: 1, desc: "Irregular ring structure" },
    ]
  },
  {
    id: "lenticular",
    name: "Lenticular Galaxy",
    description: "Intermediate between spiral and elliptical. Has a disk but no spiral arms.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/NGC_2787_-_HST_-_heic0616a.jpg/1280px-NGC_2787_-_HST_-_heic0616a.jpg",
    arms: [],
    size: "50,000-100,000 ly",
    stars: "50-100 billion",
    habitability: "Medium",
    color: "from-yellow-500 to-amber-600",
    subtypes: [
      { id: "lenticular-s0", name: "S0 - No Bar", arms: 0, desc: "No central bar" },
      { id: "lenticular-s0a", name: "S0a - Weak Bar", arms: 0, desc: "Faint bar structure" },
      { id: "lenticular-sa", name: "Sa - Tight Arms", arms: 2, desc: "Tightly wound arms" },
    ]
  },
  {
    id: "irregular",
    name: "Irregular Galaxy",
    description: "No defined shape. Rich in gas and young stars. Often interaction-driven.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Magellanic_Cloud_-_Heic1501a.jpg/1280px-Magellanic_Cloud_-_Heic1501a.jpg",
    arms: [],
    size: "3,000-30,000 ly",
    stars: "1-10 billion",
    habitability: "Low-Medium",
    color: "from-red-500 to-pink-600",
    subtypes: [
      { id: "irregular-im", name: "Im - Magellanic", arms: 0, desc: "Magellanic type" },
      { id: "irregular-ia", name: "Irr - Amorphous", arms: 0, desc: "No structure" },
      { id: "irregular-dwarf", name: "Dwarf Irregular", arms: 0, desc: "Small, gas-rich" },
    ]
  },
  {
    id: "interacting",
    name: "Interacting Galaxies",
    description: "Galaxies in the process of merging. Dramatic tidal tails and star formation.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Antennae_Galaxies_by_Hubble.jpg/1280px-Antennae_Galaxies_by_Hubble.jpg",
    arms: [],
    size: "Varies",
    stars: "Combined billions",
    habitability: "Very Low",
    color: "from-red-600 to-orange-500",
    subtypes: [
      { id: "interacting-merger", name: "Major Merger", arms: 0, desc: "Equal-mass collision" },
      { id: "interacting-minor", name: "Minor Merger", arms: 0, desc: "Unequal-mass collision" },
      { id: "interacting-tidal", name: "Tidal Interaction", arms: 0, desc: "Gravitational distortion" },
    ]
  }
];

const MAP_MODES = [
  { id: "political", name: "Political", icon: Shield, desc: "Empire ownership and borders", color: "text-blue-500" },
  { id: "economic", name: "Economic", icon: Zap, desc: "Resource distribution", color: "text-amber-500" },
  { id: "military", name: "Military", icon: Crosshair, desc: "Fleet positions and strength", color: "text-red-500" },
  { id: "scientific", name: "Scientific", icon: Telescope, desc: "Research and technology", color: "text-purple-500" },
  { id: "diplomatic", name: "Diplomatic", icon: Globe, desc: "Relations and alliances", color: "text-green-500" },
  { id: "habitability", name: "Habitability", icon: Compass, desc: "World suitability", color: "text-emerald-500" },
  { id: "sensor", name: "Sensor Range", icon: Eye, desc: "Detection coverage", color: "text-cyan-500" },
  { id: "hyperlane", name: "Hyperlanes", icon: Orbit, desc: "FTL travel routes", color: "text-indigo-500" },
];

const UNIVERSE_SIZES = [
  { id: "tiny", name: "Tiny", galaxies: 8, sectors: 16, systems: 32, desc: "Small private game" },
  { id: "small", name: "Small", galaxies: 16, sectors: 32, systems: 64, desc: "Small group" },
  { id: "medium", name: "Medium", galaxies: 32, sectors: 64, systems: 128, desc: "Standard game" },
  { id: "large", name: "Large", galaxies: 64, sectors: 128, systems: 256, desc: "Large empire" },
  { id: "huge", name: "Huge", galaxies: 128, sectors: 256, systems: 512, desc: "Massive scale" },
  { id: "massive", name: "Massive", galaxies: 256, sectors: 512, systems: 1024, desc: "Stellaris scale" },
];

const STAR_CLASSES = [
  { class: "O", name: "Blue Giant", color: "#9bb0ff", temp: "30,000K", rarity: "0.003%", mass: "16+ M☉" },
  { class: "B", name: "Blue-White", color: "#aabfff", temp: "20,000K", rarity: "0.13%", mass: "2.1-16 M☉" },
  { class: "A", name: "White", color: "#cad7ff", temp: "8,500K", rarity: "0.6%", mass: "1.4-2.1 M☉" },
  { class: "F", name: "Yellow-White", color: "#f8f7ff", temp: "6,500K", rarity: "3%", mass: "1.04-1.4 M☉" },
  { class: "G", name: "Yellow Dwarf", color: "#fff4ea", temp: "5,500K", rarity: "7.6%", mass: "0.8-1.04 M☉" },
  { class: "K", name: "Orange Dwarf", color: "#ffd2a1", temp: "4,500K", rarity: "12.1%", mass: "0.45-0.8 M☉" },
  { class: "M", name: "Red Dwarf", color: "#ffcc6f", temp: "3,000K", rarity: "76.5%", mass: "0.08-0.45 M☉" },
];

interface StarPosition {
  x: number;
  y: number;
  z: number;
  class: string;
  name: string;
  size: number;
  planets: number;
}

interface GalaxyConfig {
  type: string;
  arms: number;
  size: number;
  density: number;
  seed: string;
}

function generateGalaxyStars(config: GalaxyConfig): StarPosition[] {
  const stars: StarPosition[] = [];
  const rng = mulberry32(hashString(config.seed));
  const centerX = 400;
  const centerY = 300;
  const radius = 250;

  if (config.arms === 0) {
    const count = Math.floor(config.size * config.density);
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const r = Math.pow(rng(), 0.5) * radius * (config.type === "elliptical" ? 0.8 : 1);
      const elongation = config.type === "elliptical" ? 0.5 + rng() * 0.3 : 1;
      stars.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r * elongation,
        z: (rng() - 0.5) * 20,
        class: pickStarClass(rng),
        name: generateStarName(rng),
        size: 1 + rng() * 3,
        planets: Math.floor(rng() * 8),
      });
    }
  } else {
    const starsPerArm = Math.floor(config.size * config.density / config.arms);
    for (let arm = 0; arm < config.arms; arm++) {
      const armOffset = (arm / config.arms) * Math.PI * 2;
      for (let i = 0; i < starsPerArm; i++) {
        const t = i / starsPerArm;
        const spiralAngle = armOffset + t * Math.PI * 2.5;
        const r = t * radius;
        const spread = (0.1 + t * 0.3) * radius * 0.15;
        const sx = Math.cos(spiralAngle) * r + (rng() - 0.5) * spread;
        const sy = Math.sin(spiralAngle) * r + (rng() - 0.5) * spread;
        const distFromCenter = Math.sqrt(sx * sx + sy * sy);
        if (distFromCenter < radius) {
          stars.push({
            x: centerX + sx,
            y: centerY + sy,
            z: (rng() - 0.5) * 10,
            class: pickStarClass(rng),
            name: generateStarName(rng),
            size: 1 + rng() * 3,
            planets: Math.floor(rng() * 8),
          });
        }
      }
    }
    const coreStars = Math.floor(config.size * config.density * 0.15);
    for (let i = 0; i < coreStars; i++) {
      const angle = rng() * Math.PI * 2;
      const r = Math.pow(rng(), 2) * radius * 0.2;
      stars.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        z: (rng() - 0.5) * 5,
        class: pickStarClass(rng),
        name: generateStarName(rng),
        size: 1 + rng() * 2,
        planets: Math.floor(rng() * 6),
      });
    }
  }
  return stars;
}

function mulberry32(a: number) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickStarClass(rng: () => number): string {
  const r = rng();
  if (r < 0.00003) return "O";
  if (r < 0.00133) return "B";
  if (r < 0.00733) return "A";
  if (r < 0.03733) return "F";
  if (r < 0.11333) return "G";
  if (r < 0.23433) return "K";
  return "M";
}

function generateStarName(rng: () => number): string {
  const prefixes = ["Nova", "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Proxima", "Kepler", "Trappist", "Gliese", "Ross", "Wolf", "Sirius", "Vega", "Altair", "Rigel", "Polaris", "Antares", "Deneb", "Arcturus", "Aldebaran"];
  const suffixes = ["Prime", "Major", "Minor", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return `${prefixes[Math.floor(rng() * prefixes.length)]}-${Math.floor(rng() * 9999)} ${suffixes[Math.floor(rng() * suffixes.length)]}`;
}

function getStarColor(starClass: string): string {
  const colors: Record<string, string> = {
    O: "#9bb0ff", B: "#aabfff", A: "#cad7ff", F: "#f8f7ff",
    G: "#fff4ea", K: "#ffd2a1", M: "#ffcc6f"
  };
  return colors[starClass] || "#ffffff";
}

function getStarColorClass(starClass: string): string {
  const colors: Record<string, string> = {
    O: "text-blue-300", B: "text-blue-200", A: "text-white", F: "text-yellow-100",
    G: "text-yellow-300", K: "text-orange-400", M: "text-red-400"
  };
  return colors[starClass] || "text-white";
}

export default function UniverseMapBrowser() {
  const [activeCategory, setActiveCategory] = useState<"galaxy" | "mapmode" | "universe" | "3d">("galaxy");
  const [selectedGalaxy, setSelectedGalaxy] = useState(GALAXY_TYPES[0]);
  const [selectedSubtype, setSelectedSubtype] = useState(GALAXY_TYPES[0].subtypes[0]);
  const [selectedMapMode, setSelectedMapMode] = useState(MAP_MODES[0]);
  const [universeSize, setUniverseSize] = useState(UNIVERSE_SIZES[3]);
  const [galaxySeed, setGalaxySeed] = useState("STELLAR_DOMINION_2024");
  const [is3D, setIs3D] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredStar, setHoveredStar] = useState<StarPosition | null>(null);
  const [selectedStar, setSelectedStar] = useState<StarPosition | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);

  const galaxyConfig = useMemo<GalaxyConfig>(() => ({
    type: selectedGalaxy.id,
    arms: selectedSubtype.arms,
    size: 100,
    density: selectedGalaxy.id === "elliptical" ? 1.5 : selectedGalaxy.id === "irregular" ? 0.7 : 1,
    seed: galaxySeed,
  }), [selectedGalaxy, selectedSubtype, galaxySeed]);

  const stars = useMemo(() => generateGalaxyStars(galaxyConfig), [galaxyConfig]);

  const drawGalaxy = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const brightness = Math.random() * 0.3 + 0.1;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fillRect(x, y, 1, 1);
    }

    const centerX = w / 2 + pan.x;
    const centerY = h / 2 + pan.y;

    const coreGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60 * zoom);
    coreGlow.addColorStop(0, "rgba(255, 240, 200, 0.15)");
    coreGlow.addColorStop(1, "rgba(255, 240, 200, 0)");
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, w, h);

    stars.forEach((star) => {
      const sx = (star.x - 400) * zoom + centerX;
      const sy = (star.y - 300) * zoom + centerY;
      const size = star.size * zoom;
      const color = getStarColor(star.class);

      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 3);
      glow.addColorStop(0, color + "40");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(sx - size * 3, sy - size * 3, size * 6, size * 6);

      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (hoveredStar === star) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, size + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    if (selectedGalaxy.id === "spiral" && selectedSubtype.arms > 0) {
      ctx.strokeStyle = "rgba(100, 150, 255, 0.03)";
      ctx.lineWidth = 30 * zoom;
      for (let arm = 0; arm < selectedSubtype.arms; arm++) {
        const armOffset = (arm / selectedSubtype.arms) * Math.PI * 2;
        ctx.beginPath();
        for (let t = 0; t < 1; t += 0.01) {
          const angle = armOffset + t * Math.PI * 2.5;
          const r = t * 250 * zoom;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  }, [stars, zoom, pan, hoveredStar, selectedGalaxy, selectedSubtype]);

  useEffect(() => {
    if (!is3D) drawGalaxy();
  }, [drawGalaxy, is3D]);

  useEffect(() => {
    if (!is3D || !threeContainerRef.current) return;

    let destroyed = false;
    import("three").then((THREE) => {
      if (destroyed || !threeContainerRef.current) return;

      const container = threeContainerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a1a);

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
      camera.position.set(0, 200, 400);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
      pointLight.position.set(0, 0, 0);
      scene.add(pointLight);

      const coreGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          color: 0xfff0c8,
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending,
        })
      );
      coreGlow.scale.set(80, 80, 1);
      scene.add(coreGlow);

      const starGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(stars.length * 3);
      const colors = new Float32Array(stars.length * 3);

      stars.forEach((star, i) => {
        positions[i * 3] = (star.x - 400) * 0.8;
        positions[i * 3 + 1] = star.z * 2;
        positions[i * 3 + 2] = (star.y - 300) * 0.8;

        const tempColor = new THREE.Color(getStarColor(star.class));
        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
      });

      starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const starMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      });

      const starField = new THREE.Points(starGeometry, starMaterial);
      scene.add(starField);

      let isMouseDown = false;
      let prevMouse = { x: 0, y: 0 };
      let rotX = 0;
      let rotY = 0;
      let camDist = 500;

      const onMouseDown = (e: MouseEvent) => { isMouseDown = true; prevMouse = { x: e.clientX, y: e.clientY }; };
      const onMouseUp = () => { isMouseDown = false; };
      const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        rotY += dx * 0.005;
        rotX += dy * 0.005;
        rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
        prevMouse = { x: e.clientX, y: e.clientY };
      };
      const onWheel = (e: WheelEvent) => {
        camDist += e.deltaY * 0.5;
        camDist = Math.max(100, Math.min(2000, camDist));
      };

      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("wheel", onWheel);

      let animId: number;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        camera.position.x = Math.sin(rotY) * Math.cos(rotX) * camDist;
        camera.position.y = Math.sin(rotX) * camDist;
        camera.position.z = Math.cos(rotY) * Math.cos(rotX) * camDist;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      return () => {
        destroyed = true;
        cancelAnimationFrame(animId);
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("wheel", onWheel);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        container.removeChild(renderer.domElement);
      };
    });

    return () => { destroyed = true; };
  }, [is3D, stars]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    const centerX = canvas.width / 2 + pan.x;
    const centerY = canvas.height / 2 + pan.y;

    let closest: StarPosition | null = null;
    let minDist = 20;

    stars.forEach((star) => {
      const sx = (star.x - 400) * zoom + centerX;
      const sy = (star.y - 300) * zoom + centerY;
      const dist = Math.sqrt((mx - sx) ** 2 + (my - sy) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closest = star;
      }
    });

    setHoveredStar(closest);
  };

  const handleCanvasClick = () => {
    if (hoveredStar) {
      setSelectedStar(hoveredStar);
    }
  };

  return (
    <GameLayout>
      <div className="flex flex-col h-full -m-1 sm:-m-2 lg:-m-3 overflow-hidden rounded-lg">
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-orbitron text-lg font-bold text-slate-900 tracking-wide">Universe Map Browser</h1>
              <p className="text-[11px] text-slate-500">Explore galaxy types, map modes, and 3D systems</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={is3D ? "default" : "outline"} size="sm" onClick={() => setIs3D(!is3D)}>
              {is3D ? <Minimize2 className="w-3 h-3 mr-1" /> : <Maximize2 className="w-3 h-3 mr-1" />}
              {is3D ? "2D View" : "3D View"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)} className="flex flex-col flex-1 overflow-hidden">
          <TabsList className="mx-4 mt-2 bg-slate-100 p-1 h-9 w-fit">
            <TabsTrigger value="galaxy" className="text-[11px] font-semibold px-3">
              <Globe className="w-3 h-3 mr-1" /> Galaxy Types
            </TabsTrigger>
            <TabsTrigger value="mapmode" className="text-[11px] font-semibold px-3">
              <Layers className="w-3 h-3 mr-1" /> Map Modes
            </TabsTrigger>
            <TabsTrigger value="universe" className="text-[11px] font-semibold px-3">
              <Sparkles className="w-3 h-3 mr-1" /> Universe
            </TabsTrigger>
            <TabsTrigger value="3d" className="text-[11px] font-semibold px-3">
              <Orbit className="w-3 h-3 mr-1" /> Star Classes
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-[280px] border-r border-slate-200 bg-white overflow-y-auto shrink-0">
              <TabsContent value="galaxy" className="m-0 p-3 space-y-1">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">Galaxy Classification</div>
                {GALAXY_TYPES.map((gt) => (
                  <div key={gt.id}>
                    <button
                      type="button"
                      onClick={() => { setSelectedGalaxy(gt); setSelectedSubtype(gt.subtypes[0]); }}
                      className={cn(
                        "w-full text-left p-2 rounded-lg transition-all",
                        selectedGalaxy.id === gt.id ? "bg-primary/10 border border-primary/20" : "hover:bg-slate-50 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("w-6 h-6 rounded bg-gradient-to-br", gt.color, "flex items-center justify-center")}>
                          <Globe className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-semibold text-slate-800 truncate">{gt.name}</div>
                          <div className="text-[9px] text-slate-400">{gt.stars} stars</div>
                        </div>
                        <ChevronRight className={cn("w-3 h-3 transition-transform", selectedGalaxy.id === gt.id && "rotate-90")} />
                      </div>
                    </button>
                    {selectedGalaxy.id === gt.id && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {gt.subtypes.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setSelectedSubtype(st)}
                            className={cn(
                              "w-full text-left px-2 py-1.5 rounded text-[10px] transition-colors",
                              selectedSubtype.id === st.id ? "bg-primary/10 text-primary font-semibold" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            <div className="font-medium">{st.name}</div>
                            <div className="text-[9px] text-slate-400">{st.desc}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="mapmode" className="m-0 p-3 space-y-1">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">Map Overlay Modes</div>
                {MAP_MODES.map((mm) => (
                  <button
                    key={mm.id}
                    type="button"
                    onClick={() => setSelectedMapMode(mm)}
                    className={cn(
                      "w-full text-left p-2 rounded-lg transition-all",
                      selectedMapMode.id === mm.id ? "bg-primary/10 border border-primary/20" : "hover:bg-slate-50 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <mm.icon className={cn("w-4 h-4", mm.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-slate-800">{mm.name}</div>
                        <div className="text-[9px] text-slate-400">{mm.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </TabsContent>

              <TabsContent value="universe" className="m-0 p-3 space-y-3">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">Universe Size</div>
                  {UNIVERSE_SIZES.map((us) => (
                    <button
                      key={us.id}
                      type="button"
                      onClick={() => setUniverseSize(us)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg transition-all mb-1",
                        universeSize.id === us.id ? "bg-primary/10 border border-primary/20" : "hover:bg-slate-50 border border-transparent"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-semibold text-slate-800">{us.name}</div>
                        <Badge variant="outline" className="text-[8px]">{us.galaxies} galaxies</Badge>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{us.desc} — {us.sectors} sectors, {us.systems} systems/sector</div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">Generation Seed</div>
                  <input
                    type="text"
                    value={galaxySeed}
                    onChange={(e) => setGalaxySeed(e.target.value)}
                    className="w-full px-2 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">Universe Statistics</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Total Galaxies", value: universeSize.galaxies.toLocaleString() },
                      { label: "Sectors/Galaxy", value: universeSize.sectors.toLocaleString() },
                      { label: "Systems/Sector", value: universeSize.systems.toLocaleString() },
                      { label: "Total Systems", value: (universeSize.galaxies * universeSize.sectors * universeSize.systems).toLocaleString() },
                    ].map((stat) => (
                      <div key={stat.label} className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-[8px] text-slate-400 uppercase">{stat.label}</div>
                        <div className="text-[13px] font-bold text-slate-800 font-mono">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="3d" className="m-0 p-3 space-y-2">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">Stellar Classification (Morgan-Keenan)</div>
                {STAR_CLASSES.map((sc) => (
                  <div key={sc.class} className="p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: sc.color + "30" }}>
                        <span className="text-[11px] font-bold font-mono" style={{ color: sc.color }}>{sc.class}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] font-semibold text-slate-800">{sc.name}</div>
                        <div className="flex gap-2 text-[9px] text-slate-400">
                          <span>{sc.temp}</span>
                          <span>•</span>
                          <span>{sc.rarity}</span>
                          <span>•</span>
                          <span>{sc.mass}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden relative">
              {is3D ? (
                <div ref={threeContainerRef} className="flex-1 bg-[#0a0a1a] cursor-grab" />
              ) : (
                <div className="flex-1 relative bg-[#0a0a1a] overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={1200}
                    height={800}
                    className="w-full h-full cursor-crosshair"
                    onMouseMove={handleCanvasMouseMove}
                    onClick={handleCanvasClick}
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-slate-700/50 rounded-lg px-3 py-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Zoom</div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.max(0.2, zoom - 0.2))}>
                        <span className="text-[14px]">−</span>
                      </Button>
                      <span className="text-[11px] font-mono text-white w-12 text-center">{Math.round(zoom * 100)}%</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom(Math.min(5, zoom + 0.2))}>
                        <span className="text-[14px]">+</span>
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-slate-700/50 rounded-lg px-3 py-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{selectedGalaxy.name}</div>
                    <div className="text-[11px] text-white">{selectedSubtype.name}</div>
                    <div className="text-[9px] text-slate-400">{stars.length.toLocaleString()} stars rendered</div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md border border-slate-700/50 rounded-lg px-3 py-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Controls</div>
                    <div className="text-[9px] text-slate-300 space-y-0.5">
                      <div>Scroll to zoom</div>
                      <div>Click star for details</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-[280px] border-l border-slate-200 bg-white overflow-y-auto shrink-0">
              {selectedStar ? (
                <div className="p-3">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Selected Star</div>
                  <div className="p-3 bg-slate-50 rounded-lg mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: getStarColor(selectedStar.class) + "30" }}>
                        <Star className="w-5 h-5" style={{ color: getStarColor(selectedStar.class) }} />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-slate-900">{selectedStar.name}</div>
                        <Badge variant="outline" className="text-[8px] mt-0.5">{selectedStar.class}-class</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Class", value: selectedStar.class },
                        { label: "Planets", value: selectedStar.planets.toString() },
                        { label: "Position X", value: selectedStar.x.toFixed(0) },
                        { label: "Position Y", value: selectedStar.y.toFixed(0) },
                      ].map((stat) => (
                        <div key={stat.label} className="p-2 bg-slate-50 rounded">
                          <div className="text-[8px] text-slate-400 uppercase">{stat.label}</div>
                          <div className="text-[11px] font-bold text-slate-800 font-mono">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setSelectedStar(null)}>
                    Close Details
                  </Button>
                </div>
              ) : (
                <div className="p-3">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Galaxy Details</div>
                  <div className="overflow-hidden rounded-lg mb-3">
                    <img
                      src={selectedGalaxy.image}
                      alt={selectedGalaxy.name}
                      className="w-full h-36 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <h3 className="text-[13px] font-bold text-slate-900 mb-1">{selectedGalaxy.name}</h3>
                  <p className="text-[10px] text-slate-500 mb-3">{selectedGalaxy.description}</p>
                  <div className="space-y-2">
                    {[
                      { label: "Diameter", value: selectedGalaxy.size },
                      { label: "Stars", value: selectedGalaxy.stars },
                      { label: "Habitability", value: selectedGalaxy.habitability },
                      { label: "Arms", value: selectedSubtype.arms > 0 ? `${selectedSubtype.arms} arms` : "None" },
                      { label: "Rendered", value: `${stars.length.toLocaleString()} stars` },
                      { label: "Map Mode", value: selectedMapMode.name },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-[10px] text-slate-500">{stat.label}</span>
                        <span className="text-[10px] font-semibold text-slate-800">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Star Distribution</div>
                    <div className="space-y-1">
                      {STAR_CLASSES.map((sc) => {
                        const count = stars.filter(s => s.class === sc.class).length;
                        const pct = stars.length > 0 ? (count / stars.length * 100) : 0;
                        return (
                          <div key={sc.class} className="flex items-center gap-2">
                            <span className="text-[9px] font-mono w-3 text-center" style={{ color: sc.color }}>{sc.class}</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: sc.color }} />
                            </div>
                            <span className="text-[9px] text-slate-400 w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </GameLayout>
  );
}
