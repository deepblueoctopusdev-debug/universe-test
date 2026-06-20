import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import * as THREE from "three";

interface StarSystem {
  id: string;
  name: string;
  position: THREE.Vector3;
  color: string;
  size: number;
  planets: Planet[];
  owner?: string;
  fleetCount?: number;
}

interface Planet {
  id: string;
  name: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  size: number;
  color: string;
  hasMoon: boolean;
  type: "terrestrial" | "gas" | "ice" | "rocky";
}

interface Fleet {
  id: string;
  name: string;
  position: THREE.Vector3;
  owner: string;
  shipCount: number;
  status: "idle" | "moving" | "patrol" | "combat";
  targetId?: string;
}

type ViewMode = "galaxy" | "system" | "planet";

const STAR_NAMES = [
  "Sol", "Alpha Centauri", "Sirius", "Vega", "Arcturus", "Rigel",
  "Proxima", "Barnard's Star", "Wolf 359", "Lalande 21185",
  "Ross 128", "EZ Aquarii", "61 Cygni", "Procyon", "Tau Ceti",
  "Epsilon Eridani", "Lacaille 9352", "Ross 154", "Bessel",
  "Struve 2398", "Groombridge 34", "Luyten's Star", "Kapteyn",
  "Lacaille 8760", "Kruger 60", "Van Maanen", "HIP 67593",
  "TZ Arietis", "GJ 1061", "YZ Ceti", "HIP 87937", "Tau Ceti",
  "2MASS 1928", "GJ 687", "LHS 292", "GJ 1245", "Kapteyn",
  "Luyten 726-8", "Ross 248", "GJ 1002", "LHS 1140", "GJ 3053",
  "TOI-700", "Kepler-442", "TRAPPIST-1", "Proxima b", "Ross 128 b",
  "GJ 667C", "HD 40307", "HD 85512", "Tau Ceti e", "Tau Ceti f",
  "Kapteyn b", "OGLE-2005", "MOA-2009", "Kepler-62", "Kepler-186",
];

function generateStarSystems(count: number): StarSystem[] {
  const systems: StarSystem[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = STAR_NAMES[Math.floor(Math.random() * STAR_NAMES.length)];
    } while (usedNames.has(name));
    usedNames.add(name);

    const spread = 400;
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 0.3,
      (Math.random() - 0.5) * spread
    );

    const starColors = ["#ffd700", "#ffffff", "#ff6b6b", "#4ecdc4", "#a8e6cf", "#dda0dd", "#87ceeb"];
    const planetCount = Math.floor(Math.random() * 6) + 1;
    const planets: Planet[] = [];

    for (let p = 0; p < planetCount; p++) {
      const planetTypes: Planet["type"][] = ["terrestrial", "gas", "ice", "rocky"];
      const planetColors: Record<Planet["type"], string> = {
        terrestrial: "#4a90d9",
        gas: "#c9a96e",
        ice: "#b8d4e3",
        rocky: "#8b7355",
      };
      const type = planetTypes[Math.floor(Math.random() * planetTypes.length)];
      planets.push({
        id: `${i}-p${p}`,
        name: `${name} ${String.fromCharCode(65 + p)}`,
        orbitRadius: 15 + p * 8 + Math.random() * 4,
        orbitSpeed: 0.2 + Math.random() * 0.5,
        orbitOffset: Math.random() * Math.PI * 2,
        size: 0.5 + Math.random() * 1.5,
        color: planetColors[type],
        hasMoon: Math.random() > 0.6,
        type,
      });
    }

    systems.push({
      id: `sys-${i}`,
      name,
      position,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      size: 1 + Math.random() * 2,
      planets,
      owner: Math.random() > 0.7 ? "Player" : undefined,
      fleetCount: Math.random() > 0.5 ? Math.floor(Math.random() * 5) : 0,
    });
  }

  return systems;
}

function generateFleets(systems: StarSystem[]): Fleet[] {
  const fleets: Fleet[] = [];
  const owners = ["Player", "Nova Federation", "Zerg Combine", "Trade League"];

  for (let i = 0; i < 15; i++) {
    const sys = systems[Math.floor(Math.random() * systems.length)];
    fleets.push({
      id: `fleet-${i}`,
      name: `${["1st", "2nd", "3rd", "Alpha", "Beta", "Gamma", "Delta"][Math.floor(Math.random() * 7)]} ${["Fleet", "Squadron", "Task Force"][Math.floor(Math.random() * 3)]}`,
      position: sys.position.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10
      )),
      owner: owners[Math.floor(Math.random() * owners.length)],
      shipCount: Math.floor(Math.random() * 20) + 1,
      status: (["idle", "moving", "patrol", "combat"] as const)[Math.floor(Math.random() * 4)],
      targetId: Math.random() > 0.5 ? systems[Math.floor(Math.random() * systems.length)].id : undefined,
    });
  }

  return fleets;
}

interface ViewportContextData {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedSystem: StarSystem | null;
  selectSystem: (system: StarSystem | null) => void;
  selectedPlanet: Planet | null;
  selectPlanet: (planet: Planet | null) => void;
  cameraPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
}

export function StrategyViewport3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, isDragging: false, lastX: 0, lastY: 0 });
  const systemsMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const fleetMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());

  const [viewMode, setViewMode] = useState<ViewMode>("galaxy");
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredSystem, setHoveredSystem] = useState<StarSystem | null>(null);
  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [cameraZoom, setCameraZoom] = useState(300);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showFleets, setShowFleets] = useState(true);
  const [showBorders, setShowBorders] = useState(true);

  const systemsRef = useRef<StarSystem[]>([]);
  const fleetsRef = useRef<Fleet[]>([]);

  useEffect(() => {
    systemsRef.current = generateStarSystems(120);
    fleetsRef.current = generateFleets(systemsRef.current);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000011, 1);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000011, 0.0015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 5000);
    camera.position.set(0, 300, 400);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0x333344, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 200, 100);
    scene.add(dirLight);

    const starFieldGeo = new THREE.BufferGeometry();
    const starFieldCount = 3000;
    const starFieldPositions = new Float32Array(starFieldCount * 3);
    const starFieldColors = new Float32Array(starFieldCount * 3);
    for (let i = 0; i < starFieldCount; i++) {
      starFieldPositions[i * 3] = (Math.random() - 0.5) * 2000;
      starFieldPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      starFieldPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      const brightness = 0.3 + Math.random() * 0.7;
      starFieldColors[i * 3] = brightness;
      starFieldColors[i * 3 + 1] = brightness;
      starFieldColors[i * 3 + 2] = brightness + Math.random() * 0.2;
    }
    starFieldGeo.setAttribute("position", new THREE.BufferAttribute(starFieldPositions, 3));
    starFieldGeo.setAttribute("color", new THREE.BufferAttribute(starFieldColors, 3));
    const starFieldMat = new THREE.PointsMaterial({ size: 0.8, vertexColors: true, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(starFieldGeo, starFieldMat));

    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaCount = 200;
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    for (let i = 0; i < nebulaCount; i++) {
      nebulaPositions[i * 3] = (Math.random() - 0.5) * 800;
      nebulaPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      nebulaPositions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nebulaPositions, 3));
    const nebulaMat = new THREE.PointsMaterial({ size: 3, color: 0x4488ff, transparent: true, opacity: 0.05 });
    scene.add(new THREE.Points(nebulaGeo, nebulaMat));

    systemsRef.current.forEach((system) => {
      const group = new THREE.Group();

      const starGeo = new THREE.SphereGeometry(system.size, 16, 16);
      const starMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(system.color) });
      const starMesh = new THREE.Mesh(starGeo, starMat);
      group.add(starMesh);

      const glowGeo = new THREE.SphereGeometry(system.size * 2, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(system.color),
        transparent: true,
        opacity: 0.15,
      });
      group.add(new THREE.Mesh(glowGeo, glowMat));

      if (system.owner) {
        const borderGeo = new THREE.RingGeometry(system.size * 4, system.size * 5, 32);
        const borderMat = new THREE.MeshBasicMaterial({
          color: system.owner === "Player" ? 0x00aaff : 0xff4444,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
        });
        const borderMesh = new THREE.Mesh(borderGeo, borderMat);
        borderMesh.rotation.x = Math.PI / 2;
        group.add(borderMesh);
      }

      if (system.planets.length > 0) {
        system.planets.forEach((planet) => {
          const orbitGeo = new THREE.RingGeometry(planet.orbitRadius - 0.1, planet.orbitRadius + 0.1, 64);
          const orbitMat = new THREE.MeshBasicMaterial({
            color: 0x334455,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
          });
          const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
          orbitMesh.rotation.x = Math.PI / 2;
          group.add(orbitMesh);
        });
      }

      if (system.fleetCount && system.fleetCount > 0) {
        const fleetIndicatorGeo = new THREE.OctahedronGeometry(0.8, 0);
        const fleetIndicatorMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true });
        const fleetIndicator = new THREE.Mesh(fleetIndicatorGeo, fleetIndicatorMat);
        fleetIndicator.position.set(system.size * 2.5, 0, 0);
        group.add(fleetIndicator);
      }

      group.position.copy(system.position);
      group.userData = { systemId: system.id };
      scene.add(group);
      systemsMeshesRef.current.set(system.id, group);
    });

    fleetsRef.current.forEach((fleet) => {
      const fleetGeo = new THREE.ConeGeometry(0.6, 1.5, 4);
      const fleetColor = fleet.owner === "Player" ? 0x00aaff : fleet.owner === "Nova Federation" ? 0xff6600 : 0xff0044;
      const fleetMat = new THREE.MeshBasicMaterial({ color: fleetColor });
      const fleetMesh = new THREE.Mesh(fleetGeo, fleetMat);
      fleetMesh.position.copy(fleet.position);
      fleetMesh.rotation.x = Math.PI / 2;
      fleetMesh.userData = { fleetId: fleet.id };
      scene.add(fleetMesh);
      fleetMeshesRef.current.set(fleet.id, fleetMesh);

      if (fleet.targetId) {
        const targetSystem = systemsRef.current.find((s) => s.id === fleet.targetId);
        if (targetSystem) {
          const linePoints = [fleet.position, targetSystem.position];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
          const lineMat = new THREE.LineBasicMaterial({ color: fleetColor, transparent: true, opacity: 0.3 });
          const line = new THREE.Line(lineGeo, lineMat);
          scene.add(line);
        }
      }
    });

    const gridHelper = new THREE.GridHelper(600, 30, 0x111133, 0x111122);
    gridHelper.position.y = -20;
    scene.add(gridHelper);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (mouseRef.current.isDragging && cameraRef.current) {
        const dx = e.clientX - mouseRef.current.lastX;
        const dy = e.clientY - mouseRef.current.lastY;
        mouseRef.current.lastX = e.clientX;
        mouseRef.current.lastY = e.clientY;

        const spherical = new THREE.Spherical();
        spherical.setFromVector3(cameraRef.current.position.clone().sub(cameraTarget));
        spherical.theta -= dx * 0.005;
        spherical.phi -= dy * 0.005;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        cameraRef.current.position.setFromSpherical(spherical).add(cameraTarget);
        cameraRef.current.lookAt(cameraTarget);
      }

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (cameraRef.current && sceneRef.current) {
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

        let found = false;
        for (const hit of intersects) {
          let obj: THREE.Object3D | null = hit.object;
          while (obj) {
            if (obj.userData?.systemId) {
              const sys = systemsRef.current.find((s) => s.id === obj!.userData.systemId);
              if (sys) {
                setHoveredSystem(sys);
                setTooltip({
                  text: `${sys.name} ${sys.owner ? `[${sys.owner}]` : ""} — ${sys.planets.length} planets${sys.fleetCount ? `, ${sys.fleetCount} fleets` : ""}`,
                  x: e.clientX,
                  y: e.clientY,
                });
                found = true;
                container.style.cursor = "pointer";
              }
              break;
            }
            obj = obj.parent;
          }
          if (found) break;
        }
        if (!found) {
          setHoveredSystem(null);
          setTooltip(null);
          container.style.cursor = "default";
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        e.preventDefault();
        setContextMenuPos({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
        return;
      }
      mouseRef.current.isDragging = true;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setCameraZoom((prev) => Math.max(20, Math.min(800, prev + e.deltaY * 0.5)));
    };

    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0) return;

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (cameraRef.current && sceneRef.current) {
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

        for (const hit of intersects) {
          let obj: THREE.Object3D | null = hit.object;
          while (obj) {
            if (obj.userData?.systemId) {
              const sys = systemsRef.current.find((s) => s.id === obj!.userData.systemId);
              if (sys) {
                setSelectedSystem(sys);
                setSelectedPlanet(null);
                setCameraTarget(sys.position.clone());
                if (viewMode === "galaxy") {
                  setViewMode("system");
                  setCameraZoom(80);
                }
              }
              return;
            }
            obj = obj.parent;
          }
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("click", handleClick);
    container.addEventListener("contextmenu", handleContextMenu);

    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.016;

      if (!isPaused) {
        systemsMeshesRef.current.forEach((group, id) => {
          const system = systemsRef.current.find((s) => s.id === id);
          if (!system) return;

          const star = group.children[0] as THREE.Mesh;
          if (star) {
            const scale = 1 + Math.sin(time * 2 + system.position.x) * 0.05;
            star.scale.setScalar(scale);
          }

          system.planets.forEach((planet, pIdx) => {
            const orbitMesh = group.children[2 + pIdx] as THREE.Mesh;
            if (!orbitMesh) return;

            const angle = time * planet.orbitSpeed + planet.orbitOffset;
            const px = Math.cos(angle) * planet.orbitRadius;
            const pz = Math.sin(angle) * planet.orbitRadius;

            let planetMesh: THREE.Mesh | null = null;
            group.children.forEach((child: THREE.Object3D) => {
              if ((child as any).userData?.planetId === planet.id) {
                planetMesh = child as THREE.Mesh;
              }
            });

            if (!planetMesh) {
              const geo = new THREE.SphereGeometry(planet.size, 8, 8);
              const mat = new THREE.MeshPhongMaterial({ color: new THREE.Color(planet.color) });
              planetMesh = new THREE.Mesh(geo, mat);
              (planetMesh as any).userData = { planetId: planet.id };
              group.add(planetMesh);

              if (planet.hasMoon) {
                const moonGeo = new THREE.SphereGeometry(planet.size * 0.3, 6, 6);
                const moonMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
                const moonMesh = new THREE.Mesh(moonGeo, moonMat);
                (moonMesh as any).userData = { isMoon: true, parentId: planet.id };
                group.add(moonMesh);
              }
            }

            planetMesh.position.set(px, 0, pz);
          });
        });

        fleetMeshesRef.current.forEach((mesh, id) => {
          mesh.rotation.z = time * 2;
          const bob = Math.sin(time * 3 + parseInt(id.split("-")[1]) * 0.5) * 0.3;
          mesh.position.y += bob * 0.01;
        });
      }

      if (cameraRef.current) {
        const currentPos = cameraRef.current.position;
        const targetPos = cameraTarget.clone().add(new THREE.Vector3(0, cameraZoom * 0.8, cameraZoom));
        currentPos.lerp(targetPos, 0.03);
        cameraRef.current.lookAt(cameraTarget);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("contextmenu", handleContextMenu);
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [viewMode, isPaused, cameraTarget, cameraZoom]);

  const handleZoomIn = useCallback(() => setCameraZoom((prev) => Math.max(20, prev - 30)), []);
  const handleZoomOut = useCallback(() => setCameraZoom((prev) => Math.min(800, prev + 30)), []);
  const handleResetCamera = useCallback(() => {
    setCameraTarget(new THREE.Vector3(0, 0, 0));
    setCameraZoom(300);
    setViewMode("galaxy");
    setSelectedSystem(null);
    setSelectedPlanet(null);
  }, []);

  const handleZoomToSystem = useCallback((system: StarSystem) => {
    setSelectedSystem(system);
    setSelectedPlanet(null);
    setCameraTarget(system.position.clone());
    setCameraZoom(80);
    setViewMode("system");
  }, []);

  return (
    <div className="relative w-full h-full bg-[#000011]">
      <div ref={containerRef} className="w-full h-full" />

      {/* Top-left: View Mode Tabs */}
      <div className="absolute top-3 left-3 flex gap-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 p-1">
        {(["galaxy", "system", "planet"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setViewMode(mode);
              if (mode === "galaxy") {
                setCameraTarget(new THREE.Vector3(0, 0, 0));
                setCameraZoom(300);
              }
            }}
            className={cn(
              "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded transition-all",
              viewMode === mode
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            {mode === "galaxy" ? "Galaxy" : mode === "system" ? "System" : "Planet"}
          </button>
        ))}
      </div>

      {/* Top-right: Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button onClick={handleZoomIn} className="w-8 h-8 bg-white/10 backdrop-blur-md rounded border border-white/10 text-white text-sm hover:bg-white/20 transition-colors" title="Zoom In">+</button>
        <button onClick={handleZoomOut} className="w-8 h-8 bg-white/10 backdrop-blur-md rounded border border-white/10 text-white text-sm hover:bg-white/20 transition-colors" title="Zoom Out">-</button>
        <button onClick={handleResetCamera} className="w-8 h-8 bg-white/10 backdrop-blur-md rounded border border-white/10 text-white text-[10px] hover:bg-white/20 transition-colors" title="Reset Camera">R</button>
        <button onClick={() => setIsPaused(!isPaused)} className={cn("w-8 h-8 backdrop-blur-md rounded border text-white text-[10px] transition-colors", isPaused ? "bg-amber-500/30 border-amber-500/40" : "bg-white/10 border-white/10 hover:bg-white/20")} title={isPaused ? "Resume" : "Pause"}>
          {isPaused ? "▶" : "⏸"}
        </button>
        <button onClick={() => setShowLabels(!showLabels)} className={cn("w-8 h-8 backdrop-blur-md rounded border text-white text-[10px] transition-colors", showLabels ? "bg-primary/20 border-primary/30" : "bg-white/10 border-white/10 hover:bg-white/20")} title="Toggle Labels">
          Aa
        </button>
        <button onClick={() => setShowFleets(!showFleets)} className={cn("w-8 h-8 backdrop-blur-md rounded border text-white text-[10px] transition-colors", showFleets ? "bg-primary/20 border-primary/30" : "bg-white/10 border-white/10 hover:bg-white/20")} title="Toggle Fleets">
          ⚔
        </button>
      </div>

      {/* Bottom: Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-md border-t border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Systems: {systemsRef.current.length}</span>
          <span>Fleets: {fleetsRef.current.length}</span>
          <span>View: <span className="text-primary font-bold uppercase">{viewMode}</span></span>
          {isPaused && <span className="text-amber-400 font-bold">PAUSED</span>}
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>WASD: Pan</span>
          <span>Scroll: Zoom</span>
          <span>Click: Select</span>
          <span>Right-click: Menu</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 px-3 py-2 bg-slate-900/95 border border-slate-700 rounded-lg shadow-xl text-[11px] text-white max-w-[300px]"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Right Panel: Selected System Info */}
      {selectedSystem && (
        <div className="absolute top-16 right-3 w-[280px] bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-orbitron text-sm font-bold text-white">{selectedSystem.name}</h3>
                <p className="text-[10px] text-slate-400">
                  {selectedSystem.owner ? `Controlled by ${selectedSystem.owner}` : "Uncontrolled"}
                </p>
              </div>
              <button onClick={() => setSelectedSystem(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
          </div>

          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">Planets</div>
                <div className="text-sm font-bold text-slate-900">{selectedSystem.planets.length}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">Fleets</div>
                <div className="text-sm font-bold text-slate-900">{selectedSystem.fleetCount || 0}</div>
              </div>
            </div>

            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-3">Planets</div>
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {selectedSystem.planets.map((planet) => (
                <div
                  key={planet.id}
                  onClick={() => {
                    setSelectedPlanet(planet);
                    setViewMode("planet");
                  }}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all",
                    selectedPlanet?.id === planet.id
                      ? "bg-primary/10 border-primary/20"
                      : "bg-slate-50 border-slate-200 hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: planet.color }} />
                    <span className="text-[11px] font-semibold text-slate-700">{planet.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase">{planet.type}</span>
                </div>
              ))}
            </div>

            {selectedSystem.owner && (
              <div className="mt-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Empire Control</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  This system is controlled by <span className="font-bold text-primary">{selectedSystem.owner}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="absolute z-50 w-[200px] bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden"
          style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
        >
          <div className="p-1">
            {[
              { label: "Go To System", icon: "🎯", action: () => { if (hoveredSystem) handleZoomToSystem(hoveredSystem); } },
              { label: "Send Fleet", icon: "🚀", action: () => {} },
              { label: "Survey System", icon: "📡", action: () => {} },
              { label: "Colony Ship", icon: "🏗️", action: () => {} },
              { label: "---" as string },
              { label: "Fleet Management", icon: "⚔️", action: () => {} },
              { label: "Starbase View", icon: "🛰️", action: () => {} },
              { label: "---" as string },
              { label: "Diplomacy", icon: "🤝", action: () => {} },
              { label: "Espionage", icon: "🕵️", action: () => {} },
            ].map((item, i) =>
              item.label === "---" ? (
                <div key={i} className="my-1 border-t border-slate-100" />
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    item.action?.();
                    setShowContextMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 rounded transition-colors text-left"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-12 left-3 flex gap-2">
        {[
          { key: "1", label: "Galaxy" },
          { key: "2", label: "System" },
          { key: "3", label: "Planet" },
          { key: "ESC", label: "Back" },
          { key: "F", label: "Focus" },
          { key: "R", label: "Reset" },
        ].map((hint) => (
          <div key={hint.key} className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded px-2 py-1 border border-white/10">
            <kbd className="text-[9px] font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">{hint.key}</kbd>
            <span className="text-[9px] text-slate-400">{hint.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
