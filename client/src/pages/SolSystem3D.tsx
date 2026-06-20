import { useEffect, useRef, useState, useCallback } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SOL_SYSTEM, CelestialBody } from "@/lib/solSystemData";
import {
  Globe, RotateCcw, Eye, EyeOff, ZoomIn, ZoomOut, Info,
  ChevronRight, ChevronDown, X, Sun, Moon, Star, Orbit
} from "lucide-react";
import { PLANET_IMAGE_MAP } from "@shared/config/astronomyImages";

const ORBIT_COLORS: Record<string, string> = {
  "sol-mercury": "#a0a0a0",
  "sol-venus": "#e8c76a",
  "sol-earth": "#4a90d9",
  "sol-mars": "#c1440e",
  "sol-ceres": "#8b7355",
  "sol-jupiter": "#c88b3a",
  "sol-saturn": "#d4a555",
  "sol-uranus": "#73c2d4",
  "sol-neptune": "#3f54ba",
  "sol-pluto": "#b5a48a",
};

const BODY_COLORS: Record<string, string> = {
  star: "#ffd700",
  planet: "#4a90d9",
  dwarf_planet: "#8b7355",
  moon: "#c0c0c0",
  asteroid: "#808080",
  comet: "#87ceeb",
};

const PLANET_SIZES: Record<string, number> = {
  "sol-mercury": 0.35,
  "sol-venus": 0.8,
  "sol-earth": 0.85,
  "sol-mars": 0.5,
  "sol-ceres": 0.2,
  "sol-jupiter": 2.5,
  "sol-saturn": 2.2,
  "sol-uranus": 1.5,
  "sol-neptune": 1.4,
  "sol-pluto": 0.15,
};

const MOON_SIZES: Record<string, number> = {
  "sol-luna": 0.25,
  "sol-phobos": 0.08,
  "sol-deimos": 0.06,
  "sol-io": 0.22,
  "sol-europa": 0.2,
  "sol-ganymede": 0.3,
  "sol-callisto": 0.28,
  "sol-titan": 0.3,
  "sol-enceladus": 0.1,
  "sol-rhea": 0.12,
  "sol-dione": 0.1,
  "sol-tethys": 0.09,
  "sol-mimas": 0.07,
  "sol-iapetus": 0.11,
  "sol-titania": 0.15,
  "sol-oberon": 0.14,
  "sol-umbriel": 0.1,
  "sol-ariel": 0.1,
  "sol-miranda": 0.07,
  "sol-triton": 0.2,
  "sol-proteus": 0.06,
  "sol-nereid": 0.04,
  "sol-charon": 0.2,
};

const PLANET_COLORS: Record<string, string> = {
  "sol-mercury": "#a0a0a0",
  "sol-venus": "#e8c76a",
  "sol-earth": "#4a90d9",
  "sol-mars": "#c1440e",
  "sol-ceres": "#8b7355",
  "sol-jupiter": "#c88b3a",
  "sol-saturn": "#d4a555",
  "sol-uranus": "#73c2d4",
  "sol-neptune": "#3f54ba",
  "sol-pluto": "#b5a48a",
};

interface OrbitRing {
  id: string;
  radius: number;
  color: string;
  tilt: number;
}

function buildOrbitRings(): OrbitRing[] {
  const rings: OrbitRing[] = [];
  const planets = SOL_SYSTEM.bodies.filter((b) => b.type === "planet" || b.type === "dwarf_planet");
  for (const planet of planets) {
    const dist = planet.properties.distanceFromParent || 50;
    const scaled = Math.sqrt(dist) * 2.5;
    rings.push({
      id: planet.id,
      radius: scaled,
      color: ORBIT_COLORS[planet.id] || "#444444",
      tilt: 0,
    });
  }
  return rings;
}

function getDistanceScale(body: CelestialBody): number {
  const dist = body.properties.distanceFromParent || 0;
  if (body.type === "planet" || body.type === "dwarf_planet") {
    return Math.sqrt(dist) * 2.5;
  }
  if (body.parentId) {
    return 1.5 + Math.sqrt(dist || 0.5) * 3;
  }
  return 0;
}

export default function SolSystem3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({
    star: true,
    planet: true,
    dwarf_planet: true,
    moon: false,
  });
  const [hoveredBody, setHoveredBody] = useState<string | null>(null);
  const animRef = useRef<number>(0);

  const bodiesByType = {
    star: SOL_SYSTEM.bodies.filter((b) => b.type === "star"),
    planet: SOL_SYSTEM.bodies.filter((b) => b.type === "planet"),
    dwarf_planet: SOL_SYSTEM.bodies.filter((b) => b.type === "dwarf_planet"),
    moon: SOL_SYSTEM.bodies.filter((b) => b.type === "moon"),
  };

  const orbitRings = buildOrbitRings();

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    import("three").then((THREE) => {
      if (destroyed || !containerRef.current) return;

      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x020208);

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100000);
      camera.position.set(40, 30, 60);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0x222244, 0.3);
      scene.add(ambientLight);
      const sunLight = new THREE.PointLight(0xfff5e0, 2, 500);
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);

      const starFieldGeo = new THREE.BufferGeometry();
      const starPositions = new Float32Array(3000 * 3);
      for (let i = 0; i < 3000; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 4000;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 4000;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 4000;
      }
      starFieldGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      const starFieldMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.6 });
      scene.add(new THREE.Points(starFieldGeo, starFieldMat));

      const sunGeo = new THREE.SphereGeometry(3, 64, 64);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      scene.add(sunMesh);

      const sunGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          color: 0xffaa00,
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending,
        })
      );
      sunGlow.scale.set(20, 20, 1);
      scene.add(sunGlow);

      const gridHelper = new THREE.GridHelper(200, 40, 0x1a1a3a, 0x0d0d20);
      gridHelper.rotation.x = 0;
      scene.add(gridHelper);

      const axisLen = 100;
      const axisMatX = new THREE.LineBasicMaterial({ color: 0xff4444 });
      const axisMatY = new THREE.LineBasicMaterial({ color: 0x44ff44 });
      const axisMatZ = new THREE.LineBasicMaterial({ color: 0x4444ff });

      const axisGeoX = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-axisLen, 0, 0), new THREE.Vector3(axisLen, 0, 0)]);
      const axisGeoY = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -axisLen, 0), new THREE.Vector3(0, axisLen, 0)]);
      const axisGeoZ = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -axisLen), new THREE.Vector3(0, 0, axisLen)]);
      scene.add(new THREE.Line(axisGeoX, axisMatX));
      scene.add(new THREE.Line(axisGeoY, axisMatY));
      scene.add(new THREE.Line(axisGeoZ, axisMatZ));

      const labelDiv = document.createElement("div");
      labelDiv.style.position = "absolute";
      labelDiv.style.top = "0";
      labelDiv.style.left = "0";
      labelDiv.style.pointerEvents = "none";
      labelDiv.style.zIndex = "10";
      container.appendChild(labelDiv);

      const orbitLines: THREE.Line[] = [];
      if (showOrbits) {
        for (const ring of orbitRings) {
          const points: THREE.Vector3[] = [];
          for (let i = 0; i <= 128; i++) {
            const angle = (i / 128) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(angle) * ring.radius, 0, Math.sin(angle) * ring.radius));
          }
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const mat = new THREE.LineBasicMaterial({ color: ring.color, transparent: true, opacity: 0.25 });
          const line = new THREE.Line(geo, mat);
          scene.add(line);
          orbitLines.push(line);
        }
      }

      const meshes: { body: CelestialBody; mesh: THREE.Mesh; moonMeshes?: { body: CelestialBody; mesh: THREE.Mesh }[] }[] = [];

      const planets = SOL_SYSTEM.bodies.filter((b) => b.type === "planet" || b.type === "dwarf_planet");
      for (const planet of planets) {
        const dist = getDistanceScale(planet);
        const size = PLANET_SIZES[planet.id] || 0.5;
        const color = PLANET_COLORS[planet.id] || "#888888";

        const geo = new THREE.SphereGeometry(size, 32, 32);
        const mat = new THREE.MeshPhongMaterial({ color: new THREE.Color(color), shininess: 30 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(dist, 0, 0);
        scene.add(mesh);

        if (planet.id === "sol-saturn") {
          const ringGeo = new THREE.RingGeometry(size * 1.3, size * 2.2, 64);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4a555, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2.5;
          mesh.add(ringMesh);
        }

        if (planet.id === "sol-uranus") {
          const ringGeo = new THREE.RingGeometry(size * 1.4, size * 1.8, 64);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0x73c2d4, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 6;
          mesh.add(ringMesh);
        }

        const moonMeshes: { body: CelestialBody; mesh: THREE.Mesh }[] = [];
        const moons = SOL_SYSTEM.bodies.filter((b) => b.parentId === planet.id);
        for (const moon of moons) {
          const moonDist = 1.5 + Math.sqrt(moon.properties.distanceFromParent || 0.5) * 3;
          const moonSize = MOON_SIZES[moon.id] || 0.08;
          const moonGeo = new THREE.SphereGeometry(moonSize, 16, 16);
          const moonMat = new THREE.MeshPhongMaterial({ color: 0xc0c0c0, shininess: 10 });
          const moonMeshObj = new THREE.Mesh(moonGeo, moonMat);
          moonMeshObj.position.set(moonDist, 0, 0);
          scene.add(moonMeshObj);
          moonMeshes.push({ body: moon, mesh: moonMeshObj });
        }

        meshes.push({ body: planet, mesh, moonMeshes });
      }

      let isMouseDown = false;
      let prevMouse = { x: 0, y: 0 };
      let rotX = 0.3;
      let rotY = 0;
      let camDist = 80;
      let targetLookAt = new THREE.Vector3(0, 0, 0);
      let currentLookAt = new THREE.Vector3(0, 0, 0);

      const onMouseDown = (e: MouseEvent) => {
        if (e.button === 0) { isMouseDown = true; prevMouse = { x: e.clientX, y: e.clientY }; }
      };
      const onMouseUp = () => { isMouseDown = false; };
      const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        rotY -= dx * 0.005;
        rotX -= dy * 0.005;
        rotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotX));
        prevMouse = { x: e.clientX, y: e.clientY };
      };
      const onWheel = (e: WheelEvent) => {
        camDist += e.deltaY * 0.1;
        camDist = Math.max(10, Math.min(500, camDist));
      };

      const onClick = (e: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const allMeshes: THREE.Object3D[] = [sunMesh];
        for (const m of meshes) {
          allMeshes.push(m.mesh);
          if (m.moonMeshes) {
            for (const mm of m.moonMeshes) allMeshes.push(mm.mesh);
          }
        }

        const intersects = raycaster.intersectObjects(allMeshes, false);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit === sunMesh) {
            setSelectedBody(SOL_SYSTEM.bodies.find((b) => b.id === "sol-sun") || null);
          } else {
            for (const m of meshes) {
              if (m.mesh === hit) { setSelectedBody(m.body); return; }
              if (m.moonMeshes) {
                for (const mm of m.moonMeshes) {
                  if (mm.mesh === hit) { setSelectedBody(mm.body); return; }
                }
              }
            }
          }
        }
      };

      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("wheel", onWheel);
      container.addEventListener("click", onClick);

      let time = 0;
      const animate = () => {
        if (destroyed) return;
        animRef.current = requestAnimationFrame(animate);
        time += 0.002;

        for (const m of meshes) {
          const period = m.body.properties.orbitalPeriod || 365;
          const speed = (2 * Math.PI) / (period * 0.02);
          const dist = getDistanceScale(m.body);
          const angle = time * speed;
          m.mesh.position.x = Math.cos(angle) * dist;
          m.mesh.position.z = Math.sin(angle) * dist;
          m.mesh.rotation.y += 0.01;

          if (m.moonMeshes) {
            for (const mm of m.moonMeshes) {
              const moonPeriod = mm.body.properties.orbitalPeriod || 30;
              const moonSpeed = (2 * Math.PI) / (moonPeriod * 0.5);
              const moonDist = 1.5 + Math.sqrt(mm.body.properties.distanceFromParent || 0.5) * 3;
              const moonAngle = time * moonSpeed;
              mm.mesh.position.x = m.mesh.position.x + Math.cos(moonAngle) * moonDist;
              mm.mesh.position.z = m.mesh.position.z + Math.sin(moonAngle) * moonDist;
            }
          }
        }

        camera.position.x = Math.sin(rotY) * Math.cos(rotX) * camDist;
        camera.position.y = Math.sin(rotX) * camDist;
        camera.position.z = Math.cos(rotY) * Math.cos(rotX) * camDist;
        currentLookAt.lerp(targetLookAt, 0.05);
        camera.lookAt(currentLookAt);

        labelDiv.innerHTML = "";
        if (showLabels) {
          const allBodies = [SOL_SYSTEM.bodies.find((b) => b.id === "sol-sun")!, ...meshes.flatMap((m) => [m.body, ...(m.moonMeshes?.map((mm) => mm.body) || [])])];
          for (const body of allBodies) {
            let pos: THREE.Vector3;
            if (body.id === "sol-sun") {
              pos = new THREE.Vector3(0, 0, 0);
            } else {
              const meshData = meshes.find((m) => m.body.id === body.id);
              if (meshData) {
                pos = meshData.mesh.position.clone();
                if (body.type === "moon") {
                  const moonData = meshData.moonMeshes?.find((mm) => mm.body.id === body.id);
                  if (moonData) pos = moonData.mesh.position.clone();
                }
              } else {
                continue;
              }
            }
            pos.project(camera);
            const x = (pos.x * 0.5 + 0.5) * width;
            const y = (-pos.y * 0.5 + 0.5) * height;
            if (pos.z < 1 && x > 0 && x < width && y > 0 && y < height) {
              const div = document.createElement("div");
              div.style.position = "absolute";
              div.style.left = `${x}px`;
              div.style.top = `${y - 14}px`;
              div.style.transform = "translateX(-50%)";
              div.style.color = body.id === hoveredBody ? "#ffffff" : "#88aacc";
              div.style.fontSize = body.type === "star" ? "11px" : body.type === "planet" ? "10px" : "8px";
              div.style.fontFamily = "monospace";
              div.style.textShadow = "0 0 4px rgba(0,0,0,0.8)";
              div.style.whiteSpace = "nowrap";
              div.style.pointerEvents = "none";
              div.textContent = body.name;
              labelDiv.appendChild(div);
            }
          }
        }

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
        cancelAnimationFrame(animRef.current);
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("wheel", onWheel);
        container.removeEventListener("click", onClick);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        if (container.contains(labelDiv)) container.removeChild(labelDiv);
      };
    });

    return () => { destroyed = true; cancelAnimationFrame(animRef.current); };
  }, [showOrbits, showLabels, showGrid, hoveredBody, orbitRings]);

  const toggleType = (type: string) => {
    setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const typeLabels: Record<string, string> = {
    star: "Stars",
    planet: "Planets",
    dwarf_planet: "Dwarf Planets",
    moon: "Moons",
  };

  const typeIcons: Record<string, React.ReactNode> = {
    star: <Sun className="w-3 h-3 text-yellow-500" />,
    planet: <Globe className="w-3 h-3 text-blue-500" />,
    dwarf_planet: <Globe className="w-3 h-3 text-amber-600" />,
    moon: <Moon className="w-3 h-3 text-slate-400" />,
  };

  return (
    <GameLayout>
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <Sun className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-orbitron text-sm font-bold text-slate-900 tracking-wide">Sol System — 3D View</h1>
              <p className="text-[9px] text-slate-400">G2V Yellow Dwarf • 8 planets • 5 dwarf planets • 200+ moons</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant={showOrbits ? "default" : "outline"} size="sm" className="h-7 text-[10px]" onClick={() => setShowOrbits(!showOrbits)}>
              <Orbit className="w-3 h-3 mr-1" /> Orbits
            </Button>
            <Button variant={showLabels ? "default" : "outline"} size="sm" className="h-7 text-[10px]" onClick={() => setShowLabels(!showLabels)}>
              {showLabels ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />} Labels
            </Button>
            <Button variant={showGrid ? "default" : "outline"} size="sm" className="h-7 text-[10px]" onClick={() => setShowGrid(!showGrid)}>
              Grid
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[220px] border-r border-slate-200 bg-white overflow-y-auto shrink-0">
            <div className="p-2">
              <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 px-1">System Bodies</div>
              {(Object.keys(bodiesByType) as Array<keyof typeof bodiesByType>).map((type) => (
                <div key={type}>
                  <button
                    type="button"
                    onClick={() => toggleType(type)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {expandedTypes[type] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    {typeIcons[type]}
                    <span className="flex-1 text-left">{typeLabels[type]}</span>
                    <span className="text-[8px] text-slate-400 font-mono">{bodiesByType[type].length}</span>
                  </button>
                  {expandedTypes[type] && (
                    <div className="ml-4 space-y-px">
                      {bodiesByType[type].map((body) => (
                        <button
                          key={body.id}
                          type="button"
                          onClick={() => setSelectedBody(body)}
                          onMouseEnter={() => setHoveredBody(body.id)}
                          onMouseLeave={() => setHoveredBody(null)}
                          className={cn(
                            "w-full flex items-center gap-1.5 px-2 py-1 rounded text-[10px] transition-colors",
                            selectedBody?.id === body.id ? "bg-primary/10 text-primary font-semibold" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PLANET_COLORS[body.id] || BODY_COLORS[body.type] || "#888" }} />
                          <span className="truncate">{body.name}</span>
                          {body.properties.habitable && <span className="text-[7px] text-green-500">★</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-2">
              <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 px-1">Axes</div>
              <div className="space-y-0.5 text-[9px] px-2">
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-red-500 rounded" /><span className="text-slate-500">X Axis (Right)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-green-500 rounded" /><span className="text-slate-500">Y Axis (Up)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-blue-500 rounded" /><span className="text-slate-500">Z Axis (Forward)</span></div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-2">
              <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 px-1">Controls</div>
              <div className="space-y-0.5 text-[9px] text-slate-500 px-2">
                <div>Drag to rotate</div>
                <div>Scroll to zoom</div>
                <div>Click body for details</div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative" ref={containerRef} />

          {selectedBody && (
            <div className="w-[260px] border-l border-slate-200 bg-white overflow-y-auto shrink-0">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: (PLANET_COLORS[selectedBody.id] || BODY_COLORS[selectedBody.type] || "#888") + "30" }}>
                      {selectedBody.type === "star" ? <Sun className="w-4 h-4 text-yellow-500" /> :
                       selectedBody.type === "moon" ? <Moon className="w-4 h-4 text-slate-400" /> :
                       <Globe className="w-4 h-4" style={{ color: PLANET_COLORS[selectedBody.id] || "#4a90d9" }} />}
                    </div>
                    <div>
                      <h3 className="text-[12px] font-bold text-slate-900">{selectedBody.name}</h3>
                      <Badge variant="outline" className="text-[7px] mt-0.5">{selectedBody.type.replace("_", " ")}</Badge>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSelectedBody(null)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>
                </div>

                <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">{selectedBody.properties.description}</p>

                {PLANET_IMAGE_MAP[selectedBody.id] && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={PLANET_IMAGE_MAP[selectedBody.id]}
                      alt={selectedBody.name}
                      className="w-full h-32 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  {selectedBody.properties.radius && (
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-[10px]">
                      <span className="text-slate-400">Radius</span>
                      <span className="font-mono font-semibold text-slate-700">{selectedBody.properties.radius.toLocaleString()} km</span>
                    </div>
                  )}
                  {selectedBody.properties.mass && (
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-[10px]">
                      <span className="text-slate-400">Mass</span>
                      <span className="font-mono font-semibold text-slate-700">{selectedBody.properties.mass.toExponential(2)} kg</span>
                    </div>
                  )}
                  {selectedBody.properties.distanceFromParent !== undefined && (
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-[10px]">
                      <span className="text-slate-400">Distance</span>
                      <span className="font-mono font-semibold text-slate-700">{selectedBody.properties.distanceFromParent} AU</span>
                    </div>
                  )}
                  {selectedBody.properties.orbitalPeriod && (
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-[10px]">
                      <span className="text-slate-400">Orbital Period</span>
                      <span className="font-mono font-semibold text-slate-700">{selectedBody.properties.orbitalPeriod} days</span>
                    </div>
                  )}
                  {selectedBody.properties.rotationPeriod && (
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-[10px]">
                      <span className="text-slate-400">Rotation</span>
                      <span className="font-mono font-semibold text-slate-700">{selectedBody.properties.rotationPeriod} days</span>
                    </div>
                  )}
                  {selectedBody.properties.meanTemperature && (
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-[10px]">
                      <span className="text-slate-400">Temperature</span>
                      <span className="font-mono font-semibold text-slate-700">{selectedBody.properties.meanTemperature} K</span>
                    </div>
                  )}
                  {selectedBody.properties.surfaceGravity && (
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-[10px]">
                      <span className="text-slate-400">Gravity</span>
                      <span className="font-mono font-semibold text-slate-700">{selectedBody.properties.surfaceGravity} m/s²</span>
                    </div>
                  )}
                  {selectedBody.properties.habitable !== undefined && (
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-[10px]">
                      <span className="text-slate-400">Habitable</span>
                      <span className={cn("font-semibold", selectedBody.properties.habitable ? "text-green-600" : "text-red-500")}>
                        {selectedBody.properties.habitable ? "Yes" : "No"}
                      </span>
                    </div>
                  )}
                  {selectedBody.properties.rings && (
                    <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-[10px]">
                      <span className="text-slate-400">Rings</span>
                      <span className="font-semibold text-slate-700">Yes</span>
                    </div>
                  )}
                </div>

                {selectedBody.properties.atmosphere && selectedBody.properties.atmosphere.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Atmosphere</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedBody.properties.atmosphere.map((gas) => (
                        <Badge key={gas} variant="outline" className="text-[8px]">{gas}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBody.properties.composition && selectedBody.properties.composition.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Composition</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedBody.properties.composition.map((comp) => (
                        <Badge key={comp} variant="outline" className="text-[8px]">{comp}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-slate-200">
                  <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Coordinates</div>
                  <div className="text-[9px] font-mono text-slate-500">{selectedBody.coordinateString}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
