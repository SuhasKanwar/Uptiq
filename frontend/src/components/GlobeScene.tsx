"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Theme = {
  primary: string;
  secondary: string;
  background: string;
};

function useTheme(): Theme {
  return useMemo(() => {
    const getCssVar = (name: string, fallback: string) => {
      if (typeof window === "undefined") return fallback;
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
    };

    return {
      primary: getCssVar("--primary-color", "#41d1aa"),
      secondary: getCssVar("--secondary-color", "#9ca3af"),
      background: getCssVar("--background-color", "#080b10"),
    };
  }, []);
}

function TelemetryGrid({ theme }: { theme: Theme }) {
  const groupRef = useRef<THREE.Group>(null);
  const packetRef = useRef<THREE.InstancedMesh>(null);
  const scanRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);

  const rows = 9;
  const cols = 15;

  const { pointGeometry, linkGeometry, packets } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const links: number[] = [];
    const packetData: Array<{ x: number; z: number; phase: number; lane: number }> = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = (col - (cols - 1) / 2) * 0.62;
        const z = (row - (rows - 1) / 2) * 0.48;
        const lift = Math.sin(col * 0.9) * 0.05 + Math.cos(row * 0.8) * 0.04;
        points.push(new THREE.Vector3(x, lift, z));

        if (col < cols - 1) {
          const nextX = (col + 1 - (cols - 1) / 2) * 0.62;
          links.push(x, lift, z, nextX, lift + Math.sin((col + 1) * 0.9) * 0.04, z);
        }

        if (row < rows - 1 && col % 2 === row % 2) {
          const nextZ = (row + 1 - (rows - 1) / 2) * 0.48;
          links.push(x, lift, z, x, lift + Math.cos((row + 1) * 0.8) * 0.04, nextZ);
        }
      }
    }

    for (let i = 0; i < 28; i += 1) {
      packetData.push({
        x: ((i % cols) - (cols - 1) / 2) * 0.62,
        z: (((i * 5) % rows) - (rows - 1) / 2) * 0.48,
        phase: i * 0.37,
        lane: (i % 5) - 2,
      });
    }

    const nodeGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const connectorGeometry = new THREE.BufferGeometry();
    connectorGeometry.setAttribute("position", new THREE.Float32BufferAttribute(links, 3));

    return {
      pointGeometry: nodeGeometry,
      linkGeometry: connectorGeometry,
      packets: packetData,
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.x = -0.82 + Math.sin(t * 0.18) * 0.02;
      groupRef.current.rotation.z = 0.16 + Math.sin(t * 0.12) * 0.03;
    }

    if (packetRef.current) {
      const matrix = new THREE.Matrix4();
      packets.forEach((packet, index) => {
        const travel = ((t * 0.7 + packet.phase) % 1) * 8.6 - 4.3;
        const pulse = 0.055 + Math.sin(t * 2.4 + packet.phase) * 0.012;
        matrix.compose(
          new THREE.Vector3(travel, 0.18 + Math.sin(t + packet.phase) * 0.06, packet.z + packet.lane * 0.06),
          new THREE.Quaternion(),
          new THREE.Vector3(pulse, pulse, pulse)
        );
        packetRef.current?.setMatrixAt(index, matrix);
      });
      packetRef.current.instanceMatrix.needsUpdate = true;
    }

    if (scanRef.current) {
      scanRef.current.position.x = Math.sin(t * 0.55) * 4.4;
      scanRef.current.material.opacity = 0.18 + Math.sin(t * 1.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[1.25, -0.4, 0]}>
      <lineSegments geometry={linkGeometry}>
        <lineBasicMaterial color={theme.primary} transparent opacity={0.16} blending={THREE.AdditiveBlending} />
      </lineSegments>

      <points geometry={pointGeometry}>
        <pointsMaterial
          color={theme.secondary}
          size={0.045}
          transparent
          opacity={0.66}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <instancedMesh ref={packetRef} args={[undefined, undefined, packets.length]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={theme.primary} transparent opacity={0.92} blending={THREE.AdditiveBlending} />
      </instancedMesh>

      <mesh ref={scanRef} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 5.9]} />
        <meshBasicMaterial color={theme.primary} transparent opacity={0.22} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function IncidentRibbons({ theme }: { theme: Theme }) {
  const groupRef = useRef<THREE.Group>(null);

  const curves = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const y = 1.75 - index * 0.56;
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5.4, y, -0.9 + index * 0.08),
        new THREE.Vector3(-2.2, y + Math.sin(index) * 0.34, -0.2),
        new THREE.Vector3(1.2, y - 0.2, 0.34),
        new THREE.Vector3(4.9, y + Math.cos(index) * 0.22, -0.6),
      ]);
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        child.position.x = Math.sin(t * 0.45 + index) * 0.22;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0.8, -0.15, -1.8]}>
      {curves.map((curve, index) => (
        <mesh key={index}>
          <tubeGeometry args={[curve, 80, index === 2 ? 0.011 : 0.006, 8, false]} />
          <meshBasicMaterial
            color={index === 2 ? theme.primary : theme.secondary}
            transparent
            opacity={index === 2 ? 0.5 : 0.18}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function GlobeScene() {
  const theme = useTheme();

  return (
    <Canvas
      camera={{ position: [0, 2.2, 7.4], fov: 42 }}
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.background, 6.5, 12]} />
      <ambientLight intensity={0.46} />
      <pointLight position={[3, 5, 4]} intensity={1.2} color={theme.primary} />
      <pointLight position={[-5, 2, -3]} intensity={0.7} color="#7dd3fc" />
      <IncidentRibbons theme={theme} />
      <TelemetryGrid theme={theme} />
    </Canvas>
  );
}
