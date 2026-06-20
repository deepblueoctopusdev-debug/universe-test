import { useRef, useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PLANET_ASSETS } from "@shared/config";
import GameLayout from "@/components/layout/GameLayout";
import {
  Globe, MapPin, Zap, Users, Search, RotateCcw, Maximize2,
  Home, Ship, Shield, Crosshair, ChevronRight, Star, Map as MapIcon
} from "lucide-react";
import * as THREE from "three";

// ─── Data interfaces ──────────────────────────────────────────────────────────

interface Planet {
  id: string;
  name: string;
  class: string;
  owner?: string;
  alliance?: string;
  coordinates: string;
}

interface System {
  id: string;
  name: string;
  coordinates: string;
  planets: Planet[];
  activity: number;
  owner?: string;
  alliance?: string;
}

interface Sector {
  id: string;
  name: string;
  coordinates: string;
  systems: System[];
}

interface Galaxy {
  id: string;
  realmId: string;
  name: string;
  coordinates: string;
  sectors: Sector[];
}

interface RealmServer {
  id: string;
  name: string;
  region: "NA" | "EU" | "APAC";
  status: "online" | "maintenance" | "degraded";
  playersOnline: number;
  maxPlayers: number;
  tickRateMs: number;
  uptimePercent: number;
  universes: string[];
}

interface RealmResponse {
  realms: RealmServer[];
  selectedRealmId: string;
  selectedRealm: RealmServer;
}

// ─── Mock universe data ───────────────────────────────────────────────────────

const UNIVERSE_GALAXIES: Galaxy[] = [
  {
    id: "gal1",
    realmId: "nexus-alpha",
    name: "Nexus-Alpha",
    coordinates: "[1:0:0]",
    sectors: [
      {
        id: "sec1",
        name: "Sector 1",
        coordinates: "[1:1:0]",
        systems: [
          {
            id: "sys1",
            name: "Sol System",
            coordinates: "[1:1:100]",
            activity: 95,
            planets: [
              { id: "pl1", name: "Mercury", class: "R", coordinates: "[1:1:100:1]", owner: "Neutral" },
              { id: "pl2", name: "Venus", class: "V", coordinates: "[1:1:100:2]", owner: "Neutral" },
              { id: "pl3", name: "Earth", class: "M", coordinates: "[1:1:100:3]", owner: "Commander", alliance: "ADMIN" },
              { id: "pl4", name: "Mars", class: "D", coordinates: "[1:1:100:4]", owner: "Player_412", alliance: "SETTLERS" },
            ]
          },
          {
            id: "sys2",
            name: "Kepler System",
            coordinates: "[1:1:205]",
            activity: 72,
            planets: [
              { id: "pl5", name: "Kepler-452b", class: "M", coordinates: "[1:1:205:1]", owner: "Player_891", alliance: "EXPLORERS" },
              { id: "pl6", name: "Kepler-186f", class: "G", coordinates: "[1:1:205:2]", owner: "NPC_Station" },
            ]
          },
          {
            id: "sys3",
            name: "Proxima Centauri",
            coordinates: "[1:1:312]",
            activity: 60,
            planets: [
              { id: "pl7", name: "Proxima b", class: "M", coordinates: "[1:1:312:1]", owner: "Player_102" },
            ]
          }
        ]
      },
      {
        id: "sec2",
        name: "Sector 2",
        coordinates: "[1:2:0]",
        systems: [
          {
            id: "sys4",
            name: "Andromeda Crossing",
            coordinates: "[1:2:156]",
            activity: 45,
            planets: [
              { id: "pl8", name: "Andromeda Prime", class: "M", coordinates: "[1:2:156:1]", owner: "Pirate Gang" },
              { id: "pl9", name: "Andromeda Minor", class: "A", coordinates: "[1:2:156:2]" },
            ]
          },
          {
            id: "sys5",
            name: "Triangulum Gate",
            coordinates: "[1:2:280]",
            activity: 88,
            planets: [
              { id: "pl10", name: "Triangulum Major", class: "G", coordinates: "[1:2:280:1]", owner: "Trade League" },
              { id: "pl11", name: "Triangulum Minor", class: "M", coordinates: "[1:2:280:2]", owner: "Trade League" },
            ]
          }
        ]
      },
      {
        id: "sec3",
        name: "Sector 3",
        coordinates: "[1:3:0]",
        systems: [
          {
            id: "sys6",
            name: "Orion Nebula Outpost",
            coordinates: "[1:3:400]",
            activity: 35,
            planets: [
              { id: "pl12", name: "Orion-1", class: "M", coordinates: "[1:3:400:1]", owner: "Nova Federation" },
              { id: "pl13", name: "Orion-2", class: "D", coordinates: "[1:3:400:2]", owner: "Nova Federation" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gal2",
    realmId: "nexus-alpha",
    name: "Cygnus-Beta",
    coordinates: "[2:0:0]",
    sectors: [
      {
        id: "sec4",
        name: "Sector 1",
        coordinates: "[2:1:0]",
        systems: [
          {
            id: "sys7",
            name: "Binary Star",
            coordinates: "[2:1:98]",
            activity: 88,
            planets: [
              { id: "pl14", name: "Twin Alpha", class: "T", coordinates: "[2:1:98:1]", owner: "TechCorp", alliance: "INDUSTRIAL" },
              { id: "pl15", name: "Twin Beta", class: "M", coordinates: "[2:1:98:2]", owner: "TechCorp" },
            ]
          },
          {
            id: "sys8",
            name: "Void's Edge",
            coordinates: "[2:1:250]",
            activity: 20,
            planets: [
              { id: "pl16", name: "Void Station", class: "S", coordinates: "[2:1:250:1]", owner: "Zerg Combine" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gal3",
    realmId: "nexus-alpha",
    name: "Andromeda-Gamma",
    coordinates: "[3:0:0]",
    sectors: [
      {
        id: "sec5",
        name: "Sector 1",
        coordinates: "[3:1:0]",
        systems: [
          {
            id: "sys9",
            name: "Andromeda Prime",
            coordinates: "[3:1:50]",
            activity: 92,
            planets: [
              { id: "pl17", name: "Andromeda Core", class: "M", coordinates: "[3:1:50:1]", owner: "Holy Empire" },
              { id: "pl18", name: "Andromeda Moon", class: "R", coordinates: "[3:1:50:2]", owner: "Holy Empire" },
            ]
          }
        ]
      }
    ]
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TEMP_THEME_IMAGE = "/theme-temp.png";

function getPlanetColor(planetClass: string): string {
  const colors: Record<string, string> = {
    M: "#4a90d9", G: "#c9a96e", D: "#8b7355", R: "#ff6b6b",
    V: "#ffd700", T: "#87ceeb", A: "#dda0dd", S: "#ff7a4d"
  };
  return colors[planetClass] || "#4488ff";
}

function getActivityColor(activity: number): string {
  if (activity > 75) return "#ef4444";
  if (activity > 50) return "#f59e0b";
  return "#22c55e";
}

function getPlanetImagePath(planetClass: string): string {
  const normalized = planetClass.toUpperCase();
  if (normalized === "M") return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
  if (normalized === "D") return PLANET_ASSETS.TERRESTRIAL.DESERT.path;
  if (normalized === "R") return PLANET_ASSETS.TERRESTRIAL.VOLCANIC.path;
  if (normalized === "V") return PLANET_ASSETS.TERRESTRIAL.VOLCANIC.path;
  if (normalized === "T") return PLANET_ASSETS.TERRESTRIAL.ICE.path;
  if (normalized === "G") return PLANET_ASSETS.GAS_GIANTS.JUPITER_CLASS.path;
  if (normalized === "A") return PLANET_ASSETS.EXOTIC.RING_WORLD.path;
  return PLANET_ASSETS.TERRESTRIAL.EARTH_LIKE.path;
}

// ─── 3D Universe View Component ───────────────────────────────────────────────

export default function UniverseView3D() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
  const [selectedGalaxy, setSelectedGalaxy] = useState<Galaxy | null>(UNIVERSE_GALAXIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredSystem, setHoveredSystem] = useState<System | null>(null);
  const [cameraMode, setCameraMode] = useState<"free" | "follow">("free");

  const { data: realmData } = useQuery<RealmResponse>({
    queryKey: ["/api/universe/realms"],
    queryFn: async () => {
      const res = await fetch("/api/universe/realms", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load realm servers");
      return res.json();
    },
  });

  const selectedRealmId = realmData?.selectedRealmId || "nexus-alpha";
  const filteredGalaxies = UNIVERSE_GALAXIES.filter((g) => g.realmId === selectedRealmId);
  const allSystems = useMemo(() =>
    filteredGalaxies.flatMap((g) => g.sectors.flatMap((s) => s.systems)),
    [filteredGalaxies]
  );

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allSystems.filter((sys) =>
      sys.name.toLowerCase().includes(q) ||
      sys.coordinates.toLowerCase().includes(q)
    );
  }, [searchQuery, allSystems]);

  // Three.js scene setup
  const sceneState = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    systemMeshes: new Map<string, THREE.Group>(),
    galaxyMeshes: new Map<string, THREE.Group>(),
    frameRef: 0,
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    cameraTarget: new THREE.Vector3(0, 0, 0),
    cameraDistance: 600,
    cameraTheta: Math.PI / 4,
    cameraPhi: Math.PI / 3,
  });

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000011, 1);
    container.appendChild(renderer.domElement);
    sceneState.current.renderer = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000011, 0.0008);
    sceneState.current.scene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 10000);
    updateCameraPosition(camera);
    sceneState.current.camera = camera;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x333344, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 200, 100);
    scene.add(dirLight);

    // Starfield background
    createStarfield(scene);

    // Grid helper
    const gridHelper = new THREE.GridHelper(1200, 40, 0x111133, 0x111122);
    gridHelper.position.y = -50;
    scene.add(gridHelper);

    // Build galaxy/systems
    buildUniverse(scene, filteredGalaxies);

    // Animation loop
    const animate = () => {
      sceneState.current.frameRef = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => {
      sceneState.current.isDragging = true;
      sceneState.current.lastMouse = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      sceneState.current.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      sceneState.current.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (sceneState.current.isDragging) {
        const dx = e.clientX - sceneState.current.lastMouse.x;
        const dy = e.clientY - sceneState.current.lastMouse.y;
        sceneState.current.lastMouse = { x: e.clientX, y: e.clientY };
        sceneState.current.cameraTheta -= dx * 0.005;
        sceneState.current.cameraPhi = Math.max(0.2, Math.min(Math.PI - 0.2, sceneState.current.cameraPhi - dy * 0.005));
        updateCameraPosition(camera);
      }

      // Hover detection
      sceneState.current.raycaster.setFromCamera(sceneState.current.mouse, camera);
      const intersects = sceneState.current.raycaster.intersectObjects(scene.children, true);
      for (const hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj) {
          if (obj.userData?.systemId) {
            const sys = allSystems.find((s) => s.id === obj!.userData.systemId);
            if (sys) setHoveredSystem(sys);
            break;
          }
          obj = obj.parent;
        }
      }
      if (!intersects.length) setHoveredSystem(null);
    };
    const handleMouseUp = () => {
      sceneState.current.isDragging = false;
    };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      sceneState.current.cameraDistance = Math.max(100, Math.min(2000, sceneState.current.cameraDistance + e.deltaY * 0.5));
      updateCameraPosition(camera);
    };
    const handleClick = (e: MouseEvent) => {
      if (Math.abs(e.clientX - sceneState.current.lastMouse.x) > 5) return;
      sceneState.current.raycaster.setFromCamera(sceneState.current.mouse, camera);
      const intersects = sceneState.current.raycaster.intersectObjects(scene.children, true);
      for (const hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj) {
          if (obj.userData?.systemId) {
            const sys = allSystems.find((s) => s.id === obj!.userData.systemId);
            if (sys) {
              setSelectedSystem(sys);
              sceneState.current.cameraTarget.set(
                obj.position.x,
                obj.position.y,
                obj.position.z
              );
              sceneState.current.cameraDistance = 150;
              updateCameraPosition(camera);
            }
            break;
          }
          obj = obj.parent;
        }
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("click", handleClick);
      cancelAnimationFrame(sceneState.current.frameRef);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [filteredGalaxies, allSystems]);

  function updateCameraPosition(camera: THREE.PerspectiveCamera) {
    const s = sceneState.current;
    const x = s.cameraDistance * Math.sin(s.cameraPhi) * Math.cos(s.cameraTheta);
    const y = s.cameraDistance * Math.cos(s.cameraPhi);
    const z = s.cameraDistance * Math.sin(s.cameraPhi) * Math.sin(s.cameraTheta);
    camera.position.set(
      s.cameraTarget.x + x,
      s.cameraTarget.y + y,
      s.cameraTarget.z + z
    );
    camera.lookAt(s.cameraTarget);
  }

  function createStarfield(scene: THREE.Scene) {
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3000;
      const brightness = 0.3 + Math.random() * 0.7;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness + Math.random() * 0.2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 1.2, vertexColors: true, transparent: true, opacity: 0.7 });
    scene.add(new THREE.Points(geo, mat));
  }

  function buildUniverse(scene: THREE.Scene, galaxies: Galaxy[]) {
    const s = sceneState.current;
    s.systemMeshes.clear();
    s.galaxyMeshes.clear();

    // Clear existing universe objects (keep lights, grid, starfield)
    const toRemove: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child.userData?.isUniverseObject) toRemove.push(child);
    });
    toRemove.forEach((obj) => {
      if (obj.parent) obj.parent.remove(obj);
    });

    const galaxySpacing = 500;
    const sectorSpacing = 200;
    const systemSpacing = 80;

    galaxies.forEach((galaxy, gIdx) => {
      const galaxyGroup = new THREE.Group();
      galaxyGroup.position.set(
        (gIdx - (galaxies.length - 1) / 2) * galaxySpacing,
        0,
        0
      );
      galaxyGroup.userData = { isUniverseObject: true, galaxyId: galaxy.id };

      // Galaxy label
      const galaxyLabel = createTextSprite(galaxy.name, 0x3aa9ff);
      galaxyLabel.position.set(0, 60, 0);
      galaxyGroup.add(galaxyLabel);

      // Galaxy boundary sphere
      const boundaryGeo = new THREE.SphereGeometry(180, 32, 32);
      const boundaryMat = new THREE.MeshBasicMaterial({
        color: 0x3aa9ff,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide,
      });
      const boundary = new THREE.Mesh(boundaryGeo, boundaryMat);
      boundary.userData = { isUniverseObject: true };
      galaxyGroup.add(boundary);

      galaxy.sectors.forEach((sector, sIdx) => {
        const sectorGroup = new THREE.Group();
        const sectorAngle = (sIdx / galaxy.sectors.length) * Math.PI * 2;
        const sectorRadius = 120;
        sectorGroup.position.set(
          Math.cos(sectorAngle) * sectorRadius,
          0,
          Math.sin(sectorAngle) * sectorRadius
        );
        sectorGroup.userData = { isUniverseObject: true };

        sector.systems.forEach((system, sysIdx) => {
          const systemGroup = new THREE.Group();
          const sysAngle = (sysIdx / sector.systems.length) * Math.PI * 2;
          const sysRadius = sectorSpacing * 0.6;
          systemGroup.position.set(
            Math.cos(sysAngle) * sysRadius,
            (Math.random() - 0.5) * 40,
            Math.sin(sysAngle) * sysRadius
          );
          systemGroup.userData = { isUniverseObject: true, systemId: system.id };

          // Star sphere
          const starGeo = new THREE.SphereGeometry(3, 16, 16);
          const activityColor = new THREE.Color(getActivityColor(system.activity));
          const starMat = new THREE.MeshBasicMaterial({ color: activityColor });
          const starMesh = new THREE.Mesh(starGeo, starMat);
          starMesh.userData = { isUniverseObject: true, systemId: system.id };
          systemGroup.add(starMesh);

          // Glow
          const glowGeo = new THREE.SphereGeometry(6, 16, 16);
          const glowMat = new THREE.MeshBasicMaterial({
            color: activityColor,
            transparent: true,
            opacity: 0.15,
          });
          const glowMesh = new THREE.Mesh(glowGeo, glowMat);
          glowMesh.userData = { isUniverseObject: true };
          systemGroup.add(glowMesh);

          // System label
          const label = createTextSprite(system.name, 0xffffff);
          label.position.set(0, 12, 0);
          label.userData = { isUniverseObject: true };
          systemGroup.add(label);

          // Orbit ring for systems with planets
          if (system.planets.length > 0) {
            const orbitGeo = new THREE.RingGeometry(10, 10.3, 32);
            const orbitMat = new THREE.MeshBasicMaterial({
              color: 0x334455,
              transparent: true,
              opacity: 0.2,
              side: THREE.DoubleSide,
            });
            const orbit = new THREE.Mesh(orbitGeo, orbitMat);
            orbit.rotation.x = Math.PI / 2;
            orbit.userData = { isUniverseObject: true };
            systemGroup.add(orbit);

            // Planet dots
            system.planets.forEach((planet, pIdx) => {
              const planetAngle = (pIdx / system.planets.length) * Math.PI * 2;
              const planetDist = 10 + pIdx * 3;
              const planetGeo = new THREE.SphereGeometry(1.2, 8, 8);
              const planetMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(getPlanetColor(planet.class)) });
              const planetMesh = new THREE.Mesh(planetGeo, planetMat);
              planetMesh.position.set(
                Math.cos(planetAngle) * planetDist,
                0,
                Math.sin(planetAngle) * planetDist
              );
              planetMesh.userData = { isUniverseObject: true };
              systemGroup.add(planetMesh);
            });
          }

          // Connection line to sector center
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(
              Math.cos(sysAngle) * sysRadius,
              0,
              Math.sin(sysAngle) * sysRadius
            ),
          ]);
          const lineMat = new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.15 });
          const line = new THREE.Line(lineGeo, lineMat);
          line.userData = { isUniverseObject: true };
          sectorGroup.add(line);

          sectorGroup.add(systemGroup);
          s.systemMeshes.set(system.id, systemGroup);
        });

        galaxyGroup.add(sectorGroup);
      });

      // Connection lines between galaxies
      if (gIdx > 0) {
        const prevPos = new THREE.Vector3(
          (gIdx - 1 - (galaxies.length - 1) / 2) * galaxySpacing,
          0,
          0
        );
        const currPos = new THREE.Vector3(
          (gIdx - (galaxies.length - 1) / 2) * galaxySpacing,
          0,
          0
        );
        const warpLineGeo = new THREE.BufferGeometry().setFromPoints([prevPos, currPos]);
        const warpLineMat = new THREE.LineDashedMaterial({
          color: 0x3aa9ff,
          transparent: true,
          opacity: 0.2,
          dashSize: 10,
          gapSize: 5,
        });
        const warpLine = new THREE.Line(warpLineGeo, warpLineMat);
        warpLine.computeLineDistances();
        warpLine.userData = { isUniverseObject: true };
        scene.add(warpLine);
      }

      scene.add(galaxyGroup);
      s.galaxyMeshes.set(galaxy.id, galaxyGroup);
    });
  }

  function createTextSprite(text: string, colorHex: number): THREE.Sprite {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = `#${colorHex.toString(16).padStart(6, "0")}`;
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, 128, 40);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.8 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(40, 10, 1);
    return sprite;
  }

  const handleResetCamera = () => {
    const s = sceneState.current;
    s.cameraTarget.set(0, 0, 0);
    s.cameraDistance = 600;
    s.cameraTheta = Math.PI / 4;
    s.cameraPhi = Math.PI / 3;
    if (s.camera) updateCameraPosition(s.camera);
  };

  const handleFocusSystem = (sys: System) => {
    const mesh = sceneState.current.systemMeshes.get(sys.id);
    if (!mesh) return;
    const s = sceneState.current;
    s.cameraTarget.set(mesh.position.x, mesh.position.y, mesh.position.z);
    s.cameraDistance = 120;
    if (s.camera) updateCameraPosition(s.camera);
    setSelectedSystem(sys);
  };

  const handleFocusGalaxy = (gal: Galaxy) => {
    const mesh = sceneState.current.galaxyMeshes.get(gal.id);
    if (!mesh) return;
    const s = sceneState.current;
    s.cameraTarget.set(mesh.position.x, mesh.position.y, mesh.position.z);
    s.cameraDistance = 350;
    if (s.camera) updateCameraPosition(s.camera);
    setSelectedGalaxy(gal);
  };

  return (
    <GameLayout>
      <div className="space-y-4 animate-in fade-in duration-500">
        {/* Header */}
        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ minHeight: 120 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-transparent" />
          <div className="relative z-10 p-6 flex items-center gap-4">
            <Globe className="w-12 h-12 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-white drop-shadow">3D Universe View</h2>
              <p className="text-slate-300 font-rajdhani">
                Navigate galaxies, sectors, and systems in full 3D space. Drag to rotate, scroll to zoom, click to select.
              </p>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search systems by name or coordinates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 bg-slate-50 border-slate-200"
              data-testid="input-search-systems"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleResetCamera} className="h-9">
            <RotateCcw className="w-4 h-4 mr-1.5" /> Reset View
          </Button>
          <Button
            variant={cameraMode === "free" ? "default" : "outline"}
            size="sm"
            onClick={() => setCameraMode(cameraMode === "free" ? "follow" : "free")}
            className="h-9"
          >
            <Crosshair className="w-4 h-4 mr-1.5" /> {cameraMode === "free" ? "Free Camera" : "Follow Mode"}
          </Button>
          <div className="text-xs text-slate-500 font-mono">
            Systems: {allSystems.length} | Galaxies: {filteredGalaxies.length}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {searchQuery && searchResults.length > 0 && (
          <Card className="border-slate-200 bg-white shadow-lg max-h-[300px] overflow-y-auto">
            <CardContent className="p-2">
              {searchResults.map((sys) => (
                <button
                  key={sys.id}
                  className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-50 transition-colors text-left"
                  onClick={() => {
                    handleFocusSystem(sys);
                    setSearchQuery("");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-slate-800">{sys.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" />
                    {sys.coordinates}
                    <Badge variant="outline" className="text-[10px]">{sys.activity}%</Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main 3D Viewport + Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* 3D Viewport */}
          <div className="lg:col-span-3">
            <Card className="border-slate-200 overflow-hidden">
              <div
                ref={containerRef}
                className="w-full bg-[#000011]"
                style={{ height: 600 }}
                data-testid="universe-3d-viewport"
              />
              {/* Viewport overlay info */}
              <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 font-mono pointer-events-none">
                Drag: Rotate | Scroll: Zoom | Click: Select System
              </div>
            </Card>
          </div>

          {/* Right Panel: Galaxy / System Info */}
          <div className="space-y-4">
            {/* Galaxy Selector */}
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-600" />
                  Galaxies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredGalaxies.map((gal) => (
                  <button
                    key={gal.id}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded border text-left transition-colors",
                      selectedGalaxy?.id === gal.id
                        ? "border-cyan-300 bg-cyan-50"
                        : "border-slate-200 hover:border-cyan-200 hover:bg-slate-50"
                    )}
                    onClick={() => handleFocusGalaxy(gal)}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{gal.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{gal.coordinates}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Selected System Info */}
            {(selectedSystem || hoveredSystem) && (
              <Card className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    {selectedSystem?.name || hoveredSystem?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Coordinates</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedSystem?.coordinates || hoveredSystem?.coordinates}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Activity</span>
                    <span className="font-bold" style={{ color: getActivityColor(selectedSystem?.activity || hoveredSystem?.activity || 0) }}>
                      {selectedSystem?.activity || hoveredSystem?.activity}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Planets</span>
                    <span className="font-bold text-slate-800">
                      {(selectedSystem || hoveredSystem)?.planets.length || 0}
                    </span>
                  </div>
                  {(selectedSystem || hoveredSystem)?.owner && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Owner</span>
                      <span className="font-bold text-primary">
                        {(selectedSystem || hoveredSystem)?.owner}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Planets</div>
                    {(selectedSystem || hoveredSystem)?.planets.map((planet) => (
                      <div
                        key={planet.id}
                        className="flex items-center gap-2 py-1 hover:bg-slate-50 rounded px-1 cursor-pointer"
                        onClick={() => window.location.href = `/planet/${planet.id}`}
                      >
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: getPlanetColor(planet.class) }}
                        />
                        <span className="text-[11px] text-slate-700 truncate">{planet.name}</span>
                        <span className="text-[9px] text-slate-400 ml-auto">{planet.class}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => window.location.href = "/galaxy"}
                >
                  <MapIcon className="w-3.5 h-3.5 mr-2" /> 2D Galaxy Map
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => window.location.href = "/3d-viewport"}
                >
                  <Crosshair className="w-3.5 h-3.5 mr-2" /> Strategy Viewport
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => window.location.href = "/fleet"}
                >
                  <Ship className="w-3.5 h-3.5 mr-2" /> Fleet Command
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Universe Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="text-[10px] uppercase text-slate-500">Galaxies</div>
              <div className="text-xl font-bold text-slate-900">{filteredGalaxies.length}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="text-[10px] uppercase text-slate-500">Sectors</div>
              <div className="text-xl font-bold text-blue-700">
                {filteredGalaxies.reduce((sum, g) => sum + g.sectors.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="text-[10px] uppercase text-slate-500">Systems</div>
              <div className="text-xl font-bold text-green-700">{allSystems.length}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="text-[10px] uppercase text-slate-500">Planets</div>
              <div className="text-xl font-bold text-amber-700">
                {allSystems.reduce((sum, s) => sum + s.planets.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GameLayout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}