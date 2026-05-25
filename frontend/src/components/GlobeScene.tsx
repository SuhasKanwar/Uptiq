"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

function MonitoringGlobe({ primaryColor, backgroundColor }: { primaryColor: string; backgroundColor: string }) {
  const globeRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const connectionsRef = useRef<THREE.LineSegments>(null);

  const { nodePositions, connectionPairs } = useMemo(() => {
    const radius = 2.2;
    const nodeCount = 120;
    const positions: THREE.Vector3[] = [];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < nodeCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(new THREE.Vector3(x, y, z));
    }

    const pairs: [THREE.Vector3, THREE.Vector3][] = [];
    const maxDist = 1.4;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < maxDist && Math.random() > 0.3) {
          pairs.push([positions[i], positions[j]]);
        }
      }
    }

    return { nodePositions: positions, connectionPairs: pairs };
  }, []);

  const pointsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const verts = new Float32Array(nodePositions.length * 3);
    const sizes = new Float32Array(nodePositions.length);

    nodePositions.forEach((pos, i) => {
      verts[i * 3] = pos.x;
      verts[i * 3 + 1] = pos.y;
      verts[i * 3 + 2] = pos.z;
      sizes[i] = 0.03 + Math.random() * 0.04;
    });

    geometry.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, [nodePositions]);

  const linesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const verts = new Float32Array(connectionPairs.length * 6);

    connectionPairs.forEach(([a, b], i) => {
      verts[i * 6] = a.x;
      verts[i * 6 + 1] = a.y;
      verts[i * 6 + 2] = a.z;
      verts[i * 6 + 3] = b.x;
      verts[i * 6 + 4] = b.y;
      verts[i * 6 + 5] = b.z;
    });

    geometry.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    return geometry;
  }, [connectionPairs]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.08;
      globeRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[2.05, 48, 48]}>
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.03}
          wireframe
        />
      </Sphere>

      <Sphere args={[2.0, 32, 32]}>
        <meshBasicMaterial
          color={backgroundColor}
          transparent
          opacity={0.8}
        />
      </Sphere>

      <Sphere args={[2.5, 32, 32]}>
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.015}
          side={THREE.BackSide}
        />
      </Sphere>

      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          color={primaryColor}
          size={0.045}
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={connectionsRef} geometry={linesGeometry}>
        <lineBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function PulseRing({ radius, speed, delay, primaryColor }: { radius: number; speed: number; delay: number; primaryColor: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * speed + delay;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3 + delay) * 0.2;
      const scale = 1 + Math.sin(t * 1.5 + delay) * 0.02;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={ringRef}>
      <ringGeometry args={[radius - 0.005, radius + 0.005, 128]} />
      <meshBasicMaterial
        color={primaryColor}
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function GlobeScene() {
  const theme = useMemo(() => {
    const getCssVar = (name: string, fallback: string) => {
      if (typeof window === "undefined") return fallback;
      const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return value || fallback;
    };

    return {
      primary: getCssVar("--primary-color", "#2ca58d"),
      background: getCssVar("--background-color", "#0f0f19"),
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={theme.primary} />

      <MonitoringGlobe primaryColor={theme.primary} backgroundColor={theme.background} />
      <PulseRing radius={2.8} speed={0.15} delay={0} primaryColor={theme.primary} />
      <PulseRing radius={3.1} speed={-0.1} delay={Math.PI / 3} primaryColor={theme.primary} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />
    </Canvas>
  );
}
