import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

function GlobeLines() {
  const group = useRef<THREE.Group>(null!);

  const lines = useMemo(() => {
    const items: THREE.BufferGeometry[] = [];
    const radius = 1.4;

    // Latitude lines
    for (let lat = -75; lat <= 75; lat += 25) {
      const r = radius * Math.cos((lat * Math.PI) / 180);
      const y = radius * Math.sin((lat * Math.PI) / 180);
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle)));
      }
      items.push(new THREE.BufferGeometry().setFromPoints(points));
    }

    // Longitude lines
    for (let lng = 0; lng < 360; lng += 30) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI;
        const theta = (lng * Math.PI) / 180;
        points.push(new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        ));
      }
      items.push(new THREE.BufferGeometry().setFromPoints(points));
    }

    return items;
  }, []);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.18;
    }
  });

  return (
    <group ref={group}>
      {lines.map((geo, i) => (
        <line key={i}>
          <primitive object={geo} />
          <lineBasicMaterial color="#22d3ee" transparent opacity={0.18} />
        </line>
      ))}
      {/* Glowing dots at intersections (simplified as small spheres at poles/equator) */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, -1.4, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius, tiltX, tiltZ, speed, color }: {
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  color: string;
}) {
  const group = useRef<THREE.Group>(null!);
  const dot = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (dot.current) {
      dot.current.position.x = radius * Math.cos(t);
      dot.current.position.z = radius * Math.sin(t);
    }
  });

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.006, 8, 80]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.35} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function CoreGlow() {
  return (
    <mesh>
      <sphereGeometry args={[1.38, 32, 32]} />
      <meshStandardMaterial
        color="#0a1628"
        transparent
        opacity={0.85}
        metalness={0.3}
        roughness={0.8}
        emissive="#0d3060"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#22d3ee" />
      <pointLight position={[-3, -2, -3]} intensity={1.0} color="#4ade80" />

      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
        <CoreGlow />
        <GlobeLines />
        <OrbitRing radius={2.1} tiltX={0.4} tiltZ={0.1} speed={0.6} color="#22d3ee" />
        <OrbitRing radius={2.5} tiltX={-0.7} tiltZ={0.5} speed={0.4} color="#4ade80" />
        <OrbitRing radius={1.8} tiltX={1.2} tiltZ={-0.3} speed={0.9} color="#a78bfa" />
      </Float>
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

export function TechGlobe() {
  if (typeof window !== "undefined" && !supportsWebGL()) return null;

  return (
    <div style={{ width: "100%", height: "100%" }} aria-hidden="true">
      <WebGLErrorBoundary>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
