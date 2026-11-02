"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Billboard, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { sphereWords } from "@/lib/data";

const FONT = "/fonts/PlusJakartaSans-Medium.woff";

// Entrance: 0 -> 1 once the globe scrolls into view (shared by every word).
type Appear = { started: boolean; t: number };
const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const easeBack = (x: number) => { x = Math.min(1, Math.max(0, x)); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

const HOVER = ["#fd7163", "#4a70ec", "#4b96e2", "#7fa23a", "#b966ac"]; // sunset, electric, aurora, citrus, dusk

function Word({ children, position, index, count, appear }: { children: string; position: THREE.Vector3; index: number; count: number; appear: Appear }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.color.lerp(color.set(hovered ? HOVER[index % HOVER.length] : "#0b0b14"), 0.15);
    // staggered pop-in: each word fades and springs up a little after the previous one
    const local = (appear.t - (index / count) * 0.55) / 0.45;
    mat.transparent = true;
    mat.opacity = easeOut(local);
    const s = (hovered ? 1.35 : 1) * easeBack(local);
    if (local < 1) ref.current.scale.setScalar(Math.max(0.001, s));
    else ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.15);
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
  const wire = useRef<THREE.MeshBasicMaterial>(null);
  const { gl } = useThree();
  const appear = useMemo<Appear>(() => ({ started: false, t: 0 }), []);

  // start the entrance only when the globe is actually on screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) appear.started = true; }, { threshold: 0.35 });
    io.observe(gl.domElement);
    return () => io.disconnect();
  }, [gl, appear]);

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
    if (appear.started && appear.t < 1) appear.t = Math.min(1, appear.t + delta / 1.8);
    const e = easeOut(appear.t);
    if (group.current) {
      // spins in fast and settles into the idle drift, growing from a small core
      group.current.rotation.y += delta * 0.08 + (1 - e) * delta * 4;
      group.current.scale.setScalar(0.55 + 0.45 * e);
    }
    if (wire.current) wire.current.opacity = 0.14 * e;
  });

  return (
    <group ref={group}>
      {words.map(({ w, pos }, i) => (
        <Word key={w} position={pos} index={i} count={words.length} appear={appear}>
          {w}
        </Word>
      ))}
      <mesh>
        <sphereGeometry args={[radius * 0.55, 32, 32]} />
        <meshBasicMaterial ref={wire} color="#4a70ec" wireframe transparent opacity={0} />
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
