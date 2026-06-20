import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Globe,
  Orbit,
  Telescope,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Eye,
  Ship,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

type ViewMode = "system" | "galaxy" | "universe";

interface SolarPlanet {
  name: string;
  orbitRadius: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  type: string;
  hasRing: boolean;
  hasMoon: boolean;
}

interface StarSystemData {
  name: string;
  x: number;
  y: number;
  color: string;
  size: number;
  owner?: string;
  planetCount: number;
}

interface GalaxyData {
  name: string;
  x: number;
  y: number;
  size: number;
  color: string;
  systemCount: number;
}

const SOLAR_PLANETS: SolarPlanet[] = [
  { name: "Mercury", orbitRadius: 40, size: 3, color: "#b5a48a", speed: 4.15, angle: 0.8, type: "rocky", hasRing: false, hasMoon: false },
  { name: "Venus", orbitRadius: 65, size: 5, color: "#e8cda0", speed: 1.62, angle: 2.1, type: "terrestrial", hasRing: false, hasMoon: false },
  { name: "Earth", orbitRadius: 95, size: 5.5, color: "#4a90d9", speed: 1.0, angle: 4.3, type: "terrestrial", hasRing: false, hasMoon: true },
  { name: "Mars", orbitRadius: 125, size: 4, color: "#c1440e", speed: 0.53, angle: 1.0, type: "terrestrial", hasRing: false, hasMoon: true },
  { name: "Jupiter", orbitRadius: 175, size: 14, color: "#c9a96e", speed: 0.084, angle: 3.7, type: "gas", hasRing: false, hasMoon: true },
  { name: "Saturn", orbitRadius: 225, size: 11, color: "#e8d5a3", speed: 0.034, angle: 0.4, type: "gas", hasRing: true, hasMoon: true },
  { name: "Uranus", orbitRadius: 270, size: 8, color: "#9fc4c7", speed: 0.012, angle: 5.2, type: "ice", hasRing: true, hasMoon: true },
  { name: "Neptune", orbitRadius: 310, size: 7.5, color: "#4b70dd", speed: 0.006, angle: 2.9, type: "ice", hasRing: false, hasMoon: true },
];

function generateGalaxySystems(count: number, cx: number, cy: number, spread: number): StarSystemData[] {
  const names = [
    "Sol", "Alpha Centauri", "Sirius", "Vega", "Arcturus", "Rigel", "Proxima",
    "Barnard's Star", "Wolf 359", "Lalande", "Ross 128", "61 Cygni", "Procyon",
    "Tau Ceti", "Epsilon Eridani", "Ross 154", "Bessel", "Luyten", "Kapteyn",
    "GJ 687", "LHS 292", "GJ 1245", "Ross 248", "GJ 1002", "LHS 1140",
    "TOI-700", "Kepler-442", "TRAPPIST-1", "HD 40307", "HD 85512",
  ];
  const colors = ["#ffd700", "#ffffff", "#ff9944", "#aaccff", "#ffccaa", "#ccddff"];
  const owners = ["", "", "", "", "Player", "Nova Federation", "Zerg Combine", "Trade League"];
  const systems: StarSystemData[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = names[Math.floor(Math.random() * names.length)];
    } while (usedNames.has(name) && usedNames.size < names.length);
    usedNames.add(name);

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * spread;
    systems.push({
      name,
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 3,
      owner: owners[Math.floor(Math.random() * owners.length)],
      planetCount: Math.floor(Math.random() * 6) + 1,
    });
  }
  return systems;
}

function generateUniverseGalaxies(count: number): GalaxyData[] {
  const names = [
    "Milky Way", "Andromeda", "Triangulum", "Centaurus A", "Sombrero",
    "Whirlpool", "Pinwheel", "Sunflower", "Black Eye", "Cartwheel",
    "Cigar", "Bode's", "M51", "M82", "NGC 1300", "NGC 253",
    "NGC 1365", "NGC 6946", "NGC 4594", "NGC 224",
  ];
  const colors = ["#aaccff", "#ffccaa", "#ffaacc", "#aaffcc", "#ccbbff", "#ffddaa"];
  const galaxies: GalaxyData[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = names[Math.floor(Math.random() * names.length)];
    } while (usedNames.has(name) && usedNames.size < names.length);
    usedNames.add(name);

    galaxies.push({
      name,
      x: 100 + Math.random() * 600,
      y: 50 + Math.random() * 400,
      size: 4 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      systemCount: Math.floor(Math.random() * 500) + 10,
    });
  }
  return galaxies;
}

export function GalaxyViewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [viewMode, setViewMode] = useState<ViewMode>("galaxy");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<{ name: string; x: number; y: number; detail?: string } | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const galaxySystems = useMemo(() => generateGalaxySystems(80, 400, 250, 220), []);
  const universeGalaxies = useMemo(() => generateUniverseGalaxies(20), []);

  const drawSolarSystem = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    const cx = w / 2 + pan.x;
    const cy = h / 2 + pan.y;

    const starGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * zoom);
    starGlow.addColorStop(0, "rgba(255, 200, 50, 0.9)");
    starGlow.addColorStop(0.3, "rgba(255, 150, 30, 0.4)");
    starGlow.addColorStop(0.7, "rgba(255, 100, 20, 0.1)");
    starGlow.addColorStop(1, "transparent");
    ctx.fillStyle = starGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 30 * zoom, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffe066";
    ctx.beginPath();
    ctx.arc(cx, cy, 8 * zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff8dc";
    ctx.beginPath();
    ctx.arc(cx - 1 * zoom, cy - 1 * zoom, 3 * zoom, 0, Math.PI * 2);
    ctx.fill();

    SOLAR_PLANETS.forEach((planet) => {
      const orbitR = planet.orbitRadius * zoom;
      ctx.strokeStyle = "rgba(100, 140, 180, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.stroke();

      const angle = planet.angle + time * planet.speed * 0.3;
      const px = cx + Math.cos(angle) * orbitR;
      const py = cy + Math.sin(angle) * orbitR;
      const pSize = planet.size * zoom;

      if (planet.hasRing) {
        ctx.strokeStyle = `${planet.color}88`;
        ctx.lineWidth = 1.5 * zoom;
        ctx.beginPath();
        ctx.ellipse(px, py, pSize * 2.2, pSize * 0.6, 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();

      if (planet.hasMoon) {
        const moonAngle = time * 3 + planet.angle;
        const moonDist = pSize * 3;
        const mx = px + Math.cos(moonAngle) * moonDist;
        const my = py + Math.sin(moonAngle) * moonDist;
        ctx.fillStyle = "#ccc";
        ctx.beginPath();
        ctx.arc(mx, my, 1.5 * zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      if (zoom > 0.6) {
        ctx.fillStyle = "rgba(200, 220, 240, 0.7)";
        ctx.font = `${Math.max(9, 10 * zoom)}px 'Rajdhani', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(planet.name, px, py + pSize + 12 * zoom);
      }
    });
  }, [zoom, pan]);

  const drawGalaxy = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    const cx = w / 2 + pan.x;
    const cy = h / 2 + pan.y;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(zoom, zoom);
    ctx.translate(-400, -250);

    for (let i = 0; i < 3; i++) {
      const armAngle = (i * Math.PI * 2) / 3 + time * 0.01;
      ctx.strokeStyle = `rgba(100, 150, 200, ${0.04 - i * 0.01})`;
      ctx.lineWidth = 30 - i * 8;
      ctx.beginPath();
      for (let t = 0; t < 200; t++) {
        const angle = armAngle + t * 0.03;
        const dist = t * 1.2;
        const x = 400 + Math.cos(angle) * dist;
        const y = 250 + Math.sin(angle) * dist;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    const coreGlow = ctx.createRadialGradient(400, 250, 0, 400, 250, 60);
    coreGlow.addColorStop(0, "rgba(200, 220, 255, 0.3)");
    coreGlow.addColorStop(0.5, "rgba(100, 150, 200, 0.1)");
    coreGlow.addColorStop(1, "transparent");
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(400, 250, 60, 0, Math.PI * 2);
    ctx.fill();

    galaxySystems.forEach((sys) => {
      const pulse = Math.sin(time * 2 + sys.x * 0.1) * 0.3 + 0.7;
      const isHovered = hoveredItem?.name === sys.name;
      const isSelected = selectedSystem === sys.name;
      const baseSize = sys.size * (isHovered ? 1.8 : isSelected ? 1.5 : 1);

      if (sys.owner) {
        const ownerColor = sys.owner === "Player" ? "rgba(0, 170, 255, 0.15)" :
          sys.owner === "Nova Federation" ? "rgba(0, 255, 100, 0.15)" :
          sys.owner === "Zerg Combine" ? "rgba(255, 50, 50, 0.15)" :
          "rgba(255, 200, 0, 0.15)";
        ctx.fillStyle = ownerColor;
        ctx.beginPath();
        ctx.arc(sys.x, sys.y, baseSize * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      const glow = ctx.createRadialGradient(sys.x, sys.y, 0, sys.x, sys.y, baseSize * 2.5);
      glow.addColorStop(0, `${sys.color}${Math.floor(pulse * 80).toString(16).padStart(2, "0")}`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sys.x, sys.y, baseSize * 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = sys.color;
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.arc(sys.x, sys.y, baseSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (zoom > 0.7) {
        ctx.fillStyle = "rgba(200, 220, 240, 0.6)";
        ctx.font = "8px 'Rajdhani', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(sys.name, sys.x, sys.y + baseSize + 10);
      }
    });

    ctx.restore();
  }, [zoom, pan, galaxySystems, hoveredItem, selectedSystem]);

  const drawUniverse = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    const cx = w / 2 + pan.x;
    const cy = h / 2 + pan.y;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(zoom, zoom);
    ctx.translate(-400, -250);

    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 500;
      const b = 0.2 + Math.random() * 0.5;
      ctx.fillStyle = `rgba(${150 + Math.random() * 100}, ${150 + Math.random() * 100}, ${200 + Math.random() * 55}, ${b})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.5 + Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    universeGalaxies.forEach((gal) => {
      const pulse = Math.sin(time * 0.5 + gal.x * 0.02) * 0.2 + 0.8;
      const gSize = gal.size * (hoveredItem?.name === gal.name ? 1.6 : 1);

      const glow = ctx.createRadialGradient(gal.x, gal.y, 0, gal.x, gal.y, gSize * 3);
      glow.addColorStop(0, `${gal.color}${Math.floor(pulse * 60).toString(16).padStart(2, "0")}`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(gal.x, gal.y, gSize * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = gal.color;
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.ellipse(gal.x, gal.y, gSize * 2, gSize * 0.8, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = "rgba(200, 220, 240, 0.5)";
      ctx.font = "9px 'Rajdhani', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(gal.name, gal.x, gal.y + gSize * 2 + 12);
    });

    ctx.restore();
  }, [zoom, pan, universeGalaxies, hoveredItem]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      timeRef.current += 0.016;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#030810";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 200; i++) {
        const sx = ((i * 137.508 + timeRef.current * 0.5) % w);
        const sy = ((i * 97.31) % h);
        const b = 0.3 + Math.sin(timeRef.current + i) * 0.2;
        ctx.fillStyle = `rgba(200, 220, 255, ${b})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.5 + (i % 3) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      if (viewMode === "system") drawSolarSystem(ctx, w, h, timeRef.current);
      else if (viewMode === "galaxy") drawGalaxy(ctx, w, h, timeRef.current);
      else drawUniverse(ctx, w, h, timeRef.current);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [viewMode, drawSolarSystem, drawGalaxy, drawUniverse]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (viewMode === "galaxy") {
      const cx = canvas.width / 2 + pan.x;
      const cy = canvas.height / 2 + pan.y;
      const found = galaxySystems.find((sys) => {
        const sx = cx + (sys.x - 400) * zoom;
        const sy = cy + (sys.y - 250) * zoom;
        return Math.hypot(mx - sx, my - sy) < 15;
      });
      if (found) {
        setHoveredItem({ name: found.name, x: mx, y: my, detail: `${found.planetCount} planets · ${found.owner || "Unowned"}` });
      } else {
        setHoveredItem(null);
      }
    } else if (viewMode === "universe") {
      const cx = canvas.width / 2 + pan.x;
      const cy = canvas.height / 2 + pan.y;
      const found = universeGalaxies.find((g) => {
        const gx = cx + (g.x - 400) * zoom;
        const gy = cy + (g.y - 250) * zoom;
        return Math.hypot(mx - gx, my - gy) < g.size * 3;
      });
      if (found) {
        setHoveredItem({ name: found.name, x: mx, y: my, detail: `${found.systemCount} star systems` });
      } else {
        setHoveredItem(null);
      }
    } else {
      setHoveredItem(null);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.max(0.2, Math.min(5, z * delta)));
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== "galaxy") return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = canvas.width / 2 + pan.x;
    const cy = canvas.height / 2 + pan.y;

    const found = galaxySystems.find((sys) => {
      const sx = cx + (sys.x - 400) * zoom;
      const sy = cy + (sys.y - 250) * zoom;
      return Math.hypot(mx - sx, my - sy) < 15;
    });
    setSelectedSystem(found?.name || null);
  };

  const viewModes: { key: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "system", label: "Solar System", icon: Globe },
    { key: "galaxy", label: "Galaxy", icon: Orbit },
    { key: "universe", label: "Universe", icon: Telescope },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#030810]" data-testid="galaxy-viewport">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />

      {/* Top Left: View Mode Switcher */}
      <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-1">
        {viewModes.map((mode) => (
          <button
            key={mode.key}
            type="button"
            onClick={() => { setViewMode(mode.key); setPan({ x: 0, y: 0 }); setZoom(1); setSelectedSystem(null); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded transition-all",
              viewMode === mode.key
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700/50"
            )}
            data-testid={`viewport-mode-${mode.key}`}
          >
            <mode.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Top Right: Zoom Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(5, z * 1.2))}
          className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] font-mono text-slate-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.2, z / 1.2))}
          className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => { setPan({ x: 0, y: 0 }); setZoom(1); }}
          className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Reset View"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Left: Info Panel */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg border backdrop-blur-md transition-all",
            showInfo
              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
              : "bg-slate-900/80 text-slate-400 border-slate-700/50 hover:text-white"
          )}
        >
          <Info className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Info</span>
        </button>
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-400 font-mono">
          {viewMode === "system" && "Sol System · 8 planets"}
          {viewMode === "galaxy" && `${galaxySystems.length} systems · Milky Way`}
          {viewMode === "universe" && `${universeGalaxies.length} galaxies · Observable`}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredItem && (
        <div
          className="absolute pointer-events-none z-50 bg-slate-900/95 border border-slate-700/50 rounded-lg px-3 py-2 shadow-xl backdrop-blur-md"
          style={{ left: hoveredItem.x + 15, top: hoveredItem.y - 10 }}
        >
          <div className="text-[11px] font-semibold text-white">{hoveredItem.name}</div>
          {hoveredItem.detail && (
            <div className="text-[9px] text-slate-400 mt-0.5">{hoveredItem.detail}</div>
          )}
        </div>
      )}

      {/* Selected System Info */}
      {selectedSystem && viewMode === "galaxy" && (
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 w-56 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[12px] font-bold text-white">{selectedSystem}</div>
            <button type="button" onClick={() => setSelectedSystem(null)} className="text-slate-500 hover:text-white text-xs">✕</button>
          </div>
          {(() => {
            const sys = galaxySystems.find((s) => s.name === selectedSystem);
            if (!sys) return null;
            return (
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between text-slate-400">
                  <span>Planets</span>
                  <span className="text-white font-mono">{sys.planetCount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Owner</span>
                  <span className={cn("font-mono", sys.owner ? "text-cyan-400" : "text-slate-600")}>{sys.owner || "Unowned"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode("system")}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/25 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  Enter System
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
