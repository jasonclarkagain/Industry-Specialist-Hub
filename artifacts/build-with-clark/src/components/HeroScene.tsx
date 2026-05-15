import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

function Particles({ count = 1200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 14;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      // Cool blue-to-teal gradient
      col[i * 3] = 0.3 + Math.random() * 0.4;
      col[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      col[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  );
}

function WireframeOrb({
  position,
  geometry,
  speed,
  rotAxis,
  scale = 1,
}: {
  position: [number, number, number];
  geometry: "icosahedron" | "octahedron" | "tetrahedron" | "dodecahedron";
  speed: number;
  rotAxis: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const axis = useMemo(() => new THREE.Vector3(...rotAxis).normalize(), [rotAxis]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotateOnAxis(axis, speed * 0.01);
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.4 + position[0]) * 0.15;
    }
  });

  const geo = useMemo(() => {
    switch (geometry) {
      case "icosahedron": return new THREE.IcosahedronGeometry(1, 0);
      case "octahedron": return new THREE.OctahedronGeometry(1, 0);
      case "tetrahedron": return new THREE.TetrahedronGeometry(1, 0);
      case "dodecahedron": return new THREE.DodecahedronGeometry(1, 0);
    }
  }, [geometry]);

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <primitive object={geo} />
      <meshStandardMaterial
        color="#4ade80"
        wireframe
        transparent
        opacity={0.25}
        emissive="#22d3ee"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.12;
      ref.current.rotation.z = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.15, 64, 64]} />
        <MeshDistortMaterial
          color="#0f3460"
          distort={0.4}
          speed={2.5}
          roughness={0.1}
          metalness={0.8}
          emissive="#22d3ee"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.012, 16, 120]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0.6, 0]}>
        <torusGeometry args={[1.85, 0.008, 16, 100]} />
        <meshStandardMaterial
          color="#4ade80"
          emissive="#4ade80"
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  );
}

function MouseReactiveGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.05;
    target.current.y += (mouse.current.y - target.current.y) * 0.05;
    if (group.current) {
      group.current.rotation.y = target.current.x;
      group.current.rotation.x = target.current.y;
    }
  });

  return <group ref={group}>{children}</group>;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-3, 2, -3]} intensity={1.5} color="#22d3ee" />
      <pointLight position={[3, -2, 3]} intensity={1.0} color="#4ade80" />

      <Particles />

      <MouseReactiveGroup>
        <CoreSphere />

        <WireframeOrb position={[3.2, 0.8, -1.5]} geometry="icosahedron" speed={1.2} rotAxis={[1, 0.5, 0.3]} scale={0.7} />
        <WireframeOrb position={[-3.0, -0.6, -1.0]} geometry="octahedron" speed={0.8} rotAxis={[0.3, 1, 0.2]} scale={0.85} />
        <WireframeOrb position={[1.8, -2.2, 0.8]} geometry="tetrahedron" speed={1.5} rotAxis={[0.6, 0.4, 1]} scale={0.55} />
        <WireframeOrb position={[-2.0, 2.0, 0.5]} geometry="dodecahedron" speed={0.6} rotAxis={[0.2, 0.8, 0.4]} scale={0.5} />
        <WireframeOrb position={[0.5, 2.8, -0.8]} geometry="icosahedron" speed={1.0} rotAxis={[1, 0.2, 0.7]} scale={0.38} />
        <WireframeOrb position={[-1.2, -2.6, 0.3]} geometry="octahedron" speed={0.9} rotAxis={[0.5, 0.3, 1]} scale={0.42} />
      </MouseReactiveGroup>
    </>
  );
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function HeroScene() {
  const [ready, setReady] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    if (!supportsWebGL()) {
      setWebglOk(false);
      return;
    }
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!ready || !webglOk) return null;

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <WebGLErrorBoundary>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5.5], fov: 55, near: 0.1, far: 100 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
