"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { GitState, Commit } from "@/lib/gitState";
import { playPop } from "@/lib/audioFx";

interface ClayGitScene3DProps {
  gitState?: GitState;
  interactive?: boolean;
  onCommitClick?: (commitId: string) => void;
  className?: string;
  showControlsOverlay?: boolean;
}

interface Node3D {
  id: string;
  mesh: THREE.Mesh;
  targetPos: THREE.Vector3;
  baseColor: THREE.Color;
  commit: Partial<Commit>;
  bounceOffset: number;
}

const CLAY_COLORS = {
  coral: 0xe89a7b,
  peach: 0xfad7c5,
  mint: 0x7cb88a,
  teal: 0x7bb8b8,
  yellow: 0xf3d98b,
  blue: 0x8fa8b2,
  surface: 0xfffdf9,
};

const NOTE_BG_HEX: Record<number, string> = {
  [CLAY_COLORS.coral]: "#FAD7C5",
  [CLAY_COLORS.peach]: "#FCF1D1",
  [CLAY_COLORS.mint]: "#D4E7D7",
  [CLAY_COLORS.teal]: "#B8D8D8",
  [CLAY_COLORS.yellow]: "#FCF1D1",
  [CLAY_COLORS.blue]: "#B8CBD0",
};

function createClayNoteTexture(message: string, accentColor: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = 512;
  const height = 192;
  canvas.width = width;
  canvas.height = height;

  if (ctx) {
    const bg = NOTE_BG_HEX[accentColor] ?? "#FAD7C5";
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(16, 12, width - 32, height - 24, 24);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.roundRect(16, 12, width - 32, 18, 24);
    ctx.fill();

    ctx.fillStyle = "#2D3436";
    ctx.font = "bold 28px Nunito, sans-serif";
    ctx.textBaseline = "top";

    const words = message.split(" ");
    let line = "";
    let y = 44;
    const maxWidth = width - 56;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, 32, y);
        line = word;
        y += 34;
        if (y > height - 40) break;
      } else {
        line = testLine;
      }
    }
    if (line && y <= height - 40) {
      ctx.fillText(line, 32, y);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createClayNoteMesh(message: string, accentColor: number): THREE.Mesh {
  const texture = createClayNoteTexture(message, accentColor);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    roughness: 0.72,
    metalness: 0.02,
  });
  const geometry = new THREE.PlaneGeometry(1.35, 0.52);
  const note = new THREE.Mesh(geometry, material);
  note.rotation.y = -0.35;
  note.rotation.x = -0.08;
  note.position.set(0.95, 0.15, 0.2);
  return note;
}

export function ClayGitScene3D({
  gitState,
  interactive = true,
  onCommitClick,
  className = "w-full h-full min-h-[320px]",
  showControlsOverlay = true,
}: ClayGitScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    message: string;
    branch?: string;
  } | null>(null);
  const [nodeCount, setNodeCount] = useState(0);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);
  const linksGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Group | null>(null);
  const nodesMapRef = useRef<Map<string, Node3D>>(new Map());

  // Interaction dragging states
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.15, y: -0.2 });
  const currentRotationRef = useRef({ x: 0.15, y: -0.2 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mousePosRef = useRef(new THREE.Vector2(-10, -10));
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);

  // Spawn particle splash
  const spawnParticles = useCallback((pos: THREE.Vector3, color: THREE.Color) => {
    if (!particlesGroupRef.current) return;
    const count = 12;
    const geom = new THREE.SphereGeometry(0.08, 8, 8);
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.4,
      metalness: 0.1,
    });

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(geom, mat);
      p.position.copy(pos);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2.2,
        Math.random() * 2.5 + 0.5,
        (Math.random() - 0.5) * 2.2
      );
      p.userData = { vel, life: 1.0 };
      particlesGroupRef.current.add(p);
    }
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 1.2, 9);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialias and alpha
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Lighting - Soft Clay Studio Setup
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    // Top-down key light
    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    keyLight.position.set(5, 10, 7);
    scene.add(keyLight);

    // Soft blue-mint rim light
    const rimLight = new THREE.DirectionalLight(0xb8cbd0, 1.0);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    // Hemisphere light for ground warmth
    const hemiLight = new THREE.HemisphereLight(0xfff7ee, 0xd4e7d7, 0.7);
    scene.add(hemiLight);

    // 5. Container groups
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const linksGroup = new THREE.Group();
    mainGroup.add(linksGroup);
    linksGroupRef.current = linksGroup;

    const nodesGroup = new THREE.Group();
    mainGroup.add(nodesGroup);
    nodesGroupRef.current = nodesGroup;

    const particlesGroup = new THREE.Group();
    mainGroup.add(particlesGroup);
    particlesGroupRef.current = particlesGroup;

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera/group rotation interpolation
      currentRotationRef.current.x +=
        (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y +=
        (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (mainGroup) {
        mainGroup.rotation.x = currentRotationRef.current.x;
        mainGroup.rotation.y = currentRotationRef.current.y;
      }

      // Idle float & node bounces
      nodesMapRef.current.forEach((node) => {
        // Floating wave
        const floatY = Math.sin(elapsed * 2 + node.bounceOffset) * 0.08;
        node.mesh.position.y = node.targetPos.y + floatY;

        // Hover scale spring
        const isHovered = hoveredMeshRef.current === node.mesh;
        const targetScale = isHovered ? 1.25 : 1.0;
        node.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      });

      // Update particles
      if (particlesGroupRef.current) {
        for (let i = particlesGroupRef.current.children.length - 1; i >= 0; i--) {
          const p = particlesGroupRef.current.children[i] as THREE.Mesh;
          const vel = p.userData.vel as THREE.Vector3;
          p.position.addScaledVector(vel, delta);
          vel.y -= 5.0 * delta; // gravity
          p.userData.life -= delta * 1.5;
          p.scale.multiplyScalar(0.95);
          if (p.userData.life <= 0) {
            particlesGroupRef.current.remove(p);
            p.geometry.dispose();
          }
        }
      }

      // Raycast hover when camera and scene are ready
      if (cameraRef.current && nodesGroupRef.current && interactive) {
        raycasterRef.current.setFromCamera(mousePosRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(
          nodesGroupRef.current.children
        );
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh;
          hoveredMeshRef.current = hitMesh;
          container.style.cursor = "pointer";
        } else {
          hoveredMeshRef.current = null;
          container.style.cursor = isDraggingRef.current ? "grabbing" : "grab";
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Mouse & Touch Controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePosRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePosRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;
        targetRotationRef.current.y += deltaX * 0.008;
        targetRotationRef.current.x += deltaY * 0.008;
        // Clamp vertical angle
        targetRotationRef.current.x = Math.max(-0.6, Math.min(0.6, targetRotationRef.current.x));
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onClick = (e: MouseEvent) => {
      if (!cameraRef.current || !nodesGroupRef.current) return;
      const rect = container.getBoundingClientRect();
      const clickCoord = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycasterRef.current.setFromCamera(clickCoord, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        nodesGroupRef.current.children
      );

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const nodeId = hitMesh.userData.commitId;
        const node = nodesMapRef.current.get(nodeId);
        if (node) {
          playPop();
          spawnParticles(node.mesh.position, node.baseColor);
          setSelectedNode({
            id: node.id,
            message: node.commit.message || "Commit node",
            branch: node.commit.branch || "main",
          });
          onCommitClick?.(node.id);
        }
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("click", onClick);

      // Cleanup geometries & materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive, onCommitClick, spawnParticles]);

  // Build / update 3D Commit Nodes based on gitState or default showcase demo
  useEffect(() => {
    if (!nodesGroupRef.current || !linksGroupRef.current) return;

    // Clear previous objects
    while (nodesGroupRef.current.children.length > 0) {
      const child = nodesGroupRef.current.children[0] as THREE.Mesh;
      nodesGroupRef.current.remove(child);
      child.geometry.dispose();
    }
    while (linksGroupRef.current.children.length > 0) {
      const child = linksGroupRef.current.children[0] as THREE.Mesh;
      linksGroupRef.current.remove(child);
      child.geometry.dispose();
    }
    nodesMapRef.current.clear();

    // Determine commits to display
    let commitsList: {
      id: string;
      message: string;
      branch: string;
      parents: string[];
      x: number;
      y: number;
      z: number;
      color: number;
    }[] = [];

    if (gitState && gitState.commits.size > 0) {
      // Build real graph layout
      const sortedCommits = Array.from(gitState.commits.values()).sort(
        (a, b) => a.timestamp - b.timestamp
      );

      const branchLaneMap: Record<string, number> = { main: 0 };
      let nextLane = 1;

      commitsList = sortedCommits.map((c, index) => {
        const branchName = c.branch || "main";
        if (branchLaneMap[branchName] === undefined) {
          branchLaneMap[branchName] = nextLane++;
        }
        const lane = branchLaneMap[branchName];
        const isHead = gitState.HEAD === c.id;

        // Choose soft clay color
        let color = CLAY_COLORS.peach;
        if (branchName === "main") {
          color = CLAY_COLORS.coral;
        } else if (branchName.includes("feat")) {
          color = CLAY_COLORS.mint;
        } else if (branchName.includes("fix") || branchName.includes("bug")) {
          color = CLAY_COLORS.yellow;
        } else {
          color = CLAY_COLORS.teal;
        }
        if (isHead) {
          color = CLAY_COLORS.yellow;
        }

        const parents: string[] = [];
        if (c.parentIds && c.parentIds.length > 0) {
          parents.push(...c.parentIds);
        } else if (c.parentId) {
          parents.push(c.parentId);
        }

        return {
          id: c.id,
          message: c.message,
          branch: branchName,
          parents,
          x: (index - sortedCommits.length / 2) * 1.5,
          y: lane * 1.3 - 0.5,
          z: lane * 0.4,
          color,
        };
      });
    } else {
      // Showcase demo tree for landing page / empty sandbox
      commitsList = [
        {
          id: "c1",
          message: "init clay repo 🌱",
          branch: "main",
          parents: [],
          x: -3.2,
          y: -0.2,
          z: 0,
          color: CLAY_COLORS.coral,
        },
        {
          id: "c2",
          message: "create tactile components ✨",
          branch: "main",
          parents: ["c1"],
          x: -1.6,
          y: -0.2,
          z: 0,
          color: CLAY_COLORS.coral,
        },
        {
          id: "c3",
          message: "feat: pastel physics 🎨",
          branch: "feature/3d-physics",
          parents: ["c2"],
          x: 0.1,
          y: 1.2,
          z: 0.5,
          color: CLAY_COLORS.mint,
        },
        {
          id: "c4",
          message: "feat: tactile sound engine 🔊",
          branch: "feature/3d-physics",
          parents: ["c3"],
          x: 1.8,
          y: 1.2,
          z: 0.5,
          color: CLAY_COLORS.teal,
        },
        {
          id: "c5",
          message: "docs: add gameplay guide 📖",
          branch: "main",
          parents: ["c2"],
          x: 0.5,
          y: -0.2,
          z: 0,
          color: CLAY_COLORS.coral,
        },
        {
          id: "c6",
          message: "merge feature into main 🏆",
          branch: "main",
          parents: ["c4", "c5"],
          x: 3.1,
          y: -0.2,
          z: 0,
          color: CLAY_COLORS.yellow,
        },
      ];
    }

    setNodeCount(commitsList.length);

    // Shared sphere geometry
    const sphereGeom = new THREE.SphereGeometry(0.5, 32, 32);

    // Create Nodes
    commitsList.forEach((c, i) => {
      const clayMat = new THREE.MeshPhysicalMaterial({
        color: c.color,
        roughness: 0.65,
        metalness: 0.05,
        clearcoat: 0.15,
        clearcoatRoughness: 0.4,
      });

      const mesh = new THREE.Mesh(sphereGeom, clayMat);
      mesh.position.set(c.x, c.y, c.z);
      mesh.userData = { commitId: c.id };

      // Optional core accent ring
      const ringGeom = new THREE.TorusGeometry(0.56, 0.04, 16, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      mesh.add(ring);

      const note = createClayNoteMesh(c.message, c.color);
      mesh.add(note);

      nodesGroupRef.current?.add(mesh);
      nodesMapRef.current.set(c.id, {
        id: c.id,
        mesh,
        targetPos: new THREE.Vector3(c.x, c.y, c.z),
        baseColor: new THREE.Color(c.color),
        commit: { id: c.id, message: c.message, branch: c.branch },
        bounceOffset: i * 0.7,
      });
    });

    // Create Connecting Tubes/Links
    commitsList.forEach((c) => {
      const currentNode = nodesMapRef.current.get(c.id);
      if (!currentNode) return;

      c.parents.forEach((parentId) => {
        const parentNode = nodesMapRef.current.get(parentId);
        if (!parentNode) return;

        // Create smooth curve between parent and child
        const start = parentNode.targetPos;
        const end = currentNode.targetPos;
        const mid = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5);
        
        // Add pleasant arc
        if (start.y !== end.y) {
          mid.y = Math.max(start.y, end.y) + 0.2;
        }

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const tubeGeom = new THREE.TubeGeometry(curve, 24, 0.09, 12, false);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0xc8d9d2, // clay sidebar sage
          roughness: 0.6,
          metalness: 0.1,
        });

        const tube = new THREE.Mesh(tubeGeom, tubeMat);
        linksGroupRef.current?.add(tube);
      });
    });
  }, [gitState]);

  const handleResetCamera = () => {
    playPop();
    targetRotationRef.current = { x: 0.15, y: -0.2 };
    setSelectedNode(null);
  };

  return (
    <div className={`relative overflow-hidden rounded-clay-lg shadow-clay-inset bg-clay-bg-alt/60 select-none ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {/* Scene controls */}
      {showControlsOverlay && (
        <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-center justify-between">
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-clay-pill bg-clay-surface px-3 py-1 text-xs font-extrabold text-clay-text shadow-clay-raised">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-clay-coral" />
              3D commit notes
            </span>
            <span className="rounded-clay-pill bg-clay-mint/80 px-2.5 py-1 text-xs font-bold text-clay-text shadow-sm">
              {nodeCount} commits
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleResetCamera}
              className="clay-btn-pill bg-clay-surface text-xs text-clay-text shadow-clay-raised hover:bg-clay-bg"
              title="Reset 3D view"
            >
              Reset view
            </button>
          </div>
        </div>
      )}

      {/* Selected Node Card Tooltip */}
      {selectedNode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-sm w-[90%] pointer-events-auto z-10 transition-all duration-200">
          <div className="clay-card p-4 shadow-clay-raised-hover flex items-center justify-between gap-3 bg-clay-surface">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-clay-pill bg-clay-peach text-[11px] font-bold text-clay-text">
                  {selectedNode.branch}
                </span>
                <span className="font-mono text-xs text-clay-text-muted">
                  #{selectedNode.id.substring(0, 7)}
                </span>
              </div>
              <p className="font-bold text-sm text-clay-text truncate">
                {selectedNode.message}
              </p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="clay-icon-well size-7 bg-clay-bg-alt text-clay-text hover:bg-clay-peach text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom helper tip */}
      <div className="pointer-events-none absolute bottom-3 right-4 rounded-clay-pill bg-clay-bg/70 px-2.5 py-1 text-[11px] font-medium text-clay-text-muted/80 backdrop-blur-xs">
        Drag to rotate · Click a commit to inspect
      </div>
    </div>
  );
}
