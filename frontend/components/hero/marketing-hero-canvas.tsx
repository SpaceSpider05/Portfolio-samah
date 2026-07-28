"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group, Mesh } from "three";

const BAR_HEIGHTS = [0.35, 0.55, 0.45, 0.75, 0.95, 0.7];
const CHANNELS: { color: string; pos: [number, number, number] }[] = [
  { color: "#DBA1A2", pos: [-1.15, 0.85, 0.2] },
  { color: "#EFD8D6", pos: [1.2, 0.7, 0.15] },
  { color: "#C2C6B9", pos: [-1.05, -0.75, 0.25] },
  { color: "#F7F3ED", pos: [1.1, -0.55, 0.2] },
];

function MarketingDashboard() {
  const root = useRef<Group>(null);
  const bars = useRef<Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Soft in-place chart pulse only — no floating / drifting
    bars.current.forEach((bar, index) => {
      if (!bar) {
        return;
      }
      const pulse = 0.92 + Math.sin(t * 1.4 + index) * 0.06;
      const h = BAR_HEIGHTS[index] * pulse;
      bar.scale.y = h;
      bar.position.y = -0.55 + h / 2;
    });
  });

  return (
    <group ref={root} position={[0, 0, 0]}>
      <RoundedBox args={[2.2, 1.55, 0.08]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#52392F" metalness={0.25} roughness={0.45} />
      </RoundedBox>
      <RoundedBox args={[2.05, 1.4, 0.04]} radius={0.06} smoothness={4} position={[0, 0, 0.05]}>
        <meshStandardMaterial color="#2F1E19" metalness={0.15} roughness={0.55} />
      </RoundedBox>

      <mesh position={[0, 0.55, 0.08]}>
        <planeGeometry args={[1.7, 0.12]} />
        <meshBasicMaterial color="#DBA1A2" />
      </mesh>
      <mesh position={[-0.55, 0.28, 0.08]}>
        <planeGeometry args={[0.7, 0.22]} />
        <meshBasicMaterial color="#EFD8D6" />
      </mesh>
      <mesh position={[0.45, 0.28, 0.08]}>
        <planeGeometry args={[0.7, 0.22]} />
        <meshBasicMaterial color="#C2C6B9" />
      </mesh>

      <group position={[0, -0.15, 0.12]}>
        {BAR_HEIGHTS.map((height, index) => (
          <mesh
            key={height}
            ref={(node) => {
              if (node) {
                bars.current[index] = node;
              }
            }}
            position={[-0.75 + index * 0.3, -0.55 + height / 2, 0]}
            scale={[1, height, 1]}
          >
            <boxGeometry args={[0.18, 1, 0.12]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#DBA1A2" : "#EFD8D6"}
              emissive="#DBA1A2"
              emissiveIntensity={0.18}
              metalness={0.2}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {CHANNELS.map(({ color, pos }) => (
        <group key={color} position={pos}>
          <RoundedBox args={[0.5, 0.5, 0.08]} radius={0.1} smoothness={4}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.12}
              metalness={0.2}
              roughness={0.35}
            />
          </RoundedBox>
          <mesh position={[0, 0, 0.06]}>
            <circleGeometry args={[0.1, 20]} />
            <meshBasicMaterial color="#422B23" />
          </mesh>
        </group>
      ))}

      <group position={[0.15, 0.05, 0.35]}>
        <RoundedBox args={[1.05, 1.35, 0.07]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#F7F3ED" metalness={0.1} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.32, 0.05]}>
          <planeGeometry args={[0.78, 0.5]} />
          <meshBasicMaterial color="#DBA1A2" />
        </mesh>
        <mesh position={[0, -0.15, 0.05]}>
          <planeGeometry args={[0.78, 0.12]} />
          <meshBasicMaterial color="#C2C6B9" />
        </mesh>
        <mesh position={[0, -0.36, 0.05]}>
          <planeGeometry args={[0.55, 0.12]} />
          <meshBasicMaterial color="#422B23" />
        </mesh>
      </group>
    </group>
  );
}

export function MarketingHeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 3, 2]} intensity={1.15} color="#F7F3ED" />
      <pointLight position={[-2, -1, 3]} intensity={0.75} color="#DBA1A2" />
      <MarketingDashboard />
    </Canvas>
  );
}
