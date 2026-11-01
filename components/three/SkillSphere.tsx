"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Billboard, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { sphereWords } from "@/lib/data";

const FONT = "/fonts/SpaceGrotesk.ttf";

const HOVER = ["#fd7163", "#4a70ec", "#4b96e2", "#7fa23a", "#b966ac"]; // sunset, electric, aurora, citrus, dusk

function Word({ children, position, index }: { children: string; position: THREE.Vector3; index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.color.lerp(color.set(hovered ? HOVER[index % HOVER.length] : "#0b0b14"), 0.15);
    const s = hovered ? 1.35 : 1;
    ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.15);
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.classList.add("cursor-grab");
  };
  const out = () => {
    setHovered(false);
    document.body.classList.remove("cursor-grab");
  };

  return (
    <Billboard position={position}>
      <Text
        ref={ref}
        font={FONT}
        fontSize={0.42}
        letterSpacing={-0.02}
        anchorX="center"
        anchorY="middle"
        onPointerOver={over}
        onPointerOut={out}
      >
        {children}
      </Text>
    </Billboard>
  );
}

function Cloud({ radius = 4.2 }) {
  const group = useRef<THREE.Group>(null);
  // Fibonacci sphere for an even distribution
  const words = useMemo(() => {
    const n = sphereWords.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    return sphereWords.map((w, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      return { w, pos: new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(radius) };
    });
  }, [radius]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={group}>
      {words.map(({ w, pos }, i) => (
        <Word key={w} position={pos} index={i}>
          {w}
        </Word>
      ))}
      <mesh>
        <sphereGeometry args={[radius * 0.55, 32, 32]} />
        <meshBasicMaterial color="#4a70ec" wireframe transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

// Keep the whole word cloud in frame whatever the canvas shape (phones are tall & narrow)
function FitCamera() {
  const { camera, size, scene } = useThree();
  useFrame(() => {
    const aspect = size.width / size.height;
    const z = aspect < 1 ? 12 * Math.min(1.7, 1.02 / aspect) : 12;
    camera.position.setLength(z);
    // fade the far side of the cloud, relative to the camera distance
    const fog = scene.fog as THREE.Fog | null;
    if (fog) { fog.near = z - 3; fog.far = z + 5; }
  });
  return null;
}

export default function SkillSphere() {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 1.75]} gl={{ alpha: true }}>
      <fog attach="fog" args={["#fafaf8", 9, 17]} />
      <FitCamera />
      <Cloud />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  );
}
