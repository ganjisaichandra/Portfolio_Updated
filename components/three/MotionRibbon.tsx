"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motionCards, paint, setDisplayFont, type Painter } from "@/lib/motionCards";

export type RibbonProgress = { target: number; value: number };

// The path the ribbon travels (camera sits at the origin looking down -Z):
// starts small along the bottom -> swings close in a shallow arc -> wraps the left edge
// -> runs away along the top -> leaves top-right.
const PATH = [
  [-7, -4.2, -24], [-1, -3.6, -15], [4.2, -2.4, -8.5], [3.2, -1.1, -4.6],
  [0, -0.4, -3.6], [-3.6, 0.2, -4.4], [-5.2, 1.4, -8], [-3, 2.9, -13],
  [2, 3.6, -19], [7, 4.4, -25], [13, 6, -32],
].map(([x, y, z]) => new THREE.Vector3(x, y, z));

const WORLD_X = new THREE.Vector3(1, 0, 0);
const GAP = 0.042; // spacing between cards along the curve (0..1)
const TEX_W = 512;
const TEX_H = 288;

function roundedAlpha() {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 144;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000"; g.fillRect(0, 0, 256, 144);
  g.fillStyle = "#fff"; g.beginPath(); g.roundRect(0, 0, 256, 144, 14); g.fill();
  return new THREE.CanvasTexture(c);
}

function Ribbon({ progress }: { progress: RibbonProgress }) {
  const { camera, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(PATH, false, "catmullrom", 0.5), []);

  // One shared animated canvas per painter type (cheap: 6 redraws per frame, not 24).
  const painters = useMemo(() => {
    const kinds: Painter[] = ["pixel", "chart", "orbs", "type", "ui", "waves"];
    return Object.fromEntries(
      kinds.map((k) => {
        const canvas = document.createElement("canvas");
        canvas.width = TEX_W; canvas.height = TEX_H;
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        return [k, { ctx: canvas.getContext("2d")!, tex }];
      })
    ) as Record<Painter, { ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture }>;
  }, []);

  const alpha = useMemo(roundedAlpha, []);

  const cards = useMemo(
    () =>
      motionCards.map((c) => {
        let map: THREE.Texture = painters[c.painter].tex;
        let video: HTMLVideoElement | undefined;
        if (c.video) {
          video = document.createElement("video");
          Object.assign(video, { src: c.video, muted: true, loop: true, playsInline: true, crossOrigin: "anonymous" });
          const vt = new THREE.VideoTexture(video);
          vt.colorSpace = THREE.SRGBColorSpace;
          map = vt;
        }
        const mat = new THREE.MeshBasicMaterial({ map, alphaMap: alpha, transparent: true, side: THREE.DoubleSide, depthWrite: false });
        return { mat, video };
      }),
    [painters, alpha]
  );

  useEffect(() => {
    const f = getComputedStyle(document.documentElement).getPropertyValue("--font-display");
    setDisplayFont(f.trim());
    return () => cards.forEach((c) => { c.video?.pause(); c.mat.dispose(); });
  }, [cards]);

  const tmp = useMemo(
    () => ({ p: new THREE.Vector3(), tan: new THREE.Vector3(), n: new THREE.Vector3(), x: new THREE.Vector3(), y: new THREE.Vector3(), m: new THREE.Matrix4() }),
    []
  );

  useFrame((state, delta) => {
    // smooth the scroll progress
    const k = 1 - Math.pow(0.004, delta); // smooth but responsive follow of the scroll position
    progress.value += (progress.target - progress.value) * k;
    if (Math.abs(progress.target - progress.value) < 0.00005) progress.value = progress.target;
    const p = progress.value;
    const t = state.clock.elapsedTime;

    const n = cards.length;
    const start = 0.12; // first cards are already entering while the section scrolls into view
    const travel = 1 - start + n * GAP + 0.02;
    const mobile = size.width < 700;

    const visiblePainters = new Set<Painter>();
    group.current?.children.forEach((obj, i) => {
      const mesh = obj as THREE.Mesh;
      const u = start + p * travel - i * GAP + Math.sin(t * 0.3 + i) * 0.002;
      const visible = u >= 0 && u <= 1;
      mesh.visible = visible;
      const card = cards[i];
      if (card.video) {
        if (visible && card.video.paused) card.video.play().catch(() => {});
        else if (!visible && !card.video.paused) card.video.pause();
      }
      if (!visible) return;
      visiblePainters.add(motionCards[i].painter);

      curve.getPointAt(u, tmp.p);
      curve.getTangentAt(u, tmp.tan);
      // face the camera while the card's long edge follows the ribbon direction
      tmp.n.copy(camera.position).sub(tmp.p).normalize();
      tmp.x.copy(tmp.tan).addScaledVector(tmp.n, -tmp.tan.dot(tmp.n)).normalize();
      if (tmp.x.x < 0) tmp.x.negate(); // keep content reading left-to-right
      // soften the roll: blend the ribbon direction toward horizontal
      tmp.x.lerp(WORLD_X, 0.35).addScaledVector(tmp.n, -tmp.x.dot(tmp.n)).normalize();
      tmp.y.crossVectors(tmp.n, tmp.x);
      if (tmp.y.y < 0) { tmp.x.negate(); tmp.y.negate(); } // never upside-down
      tmp.m.makeBasis(tmp.x, tmp.y, tmp.n);
      mesh.quaternion.setFromRotationMatrix(tmp.m);
      mesh.position.copy(tmp.p);
      if (mobile) { mesh.position.multiplyScalar(1.7); mesh.position.x *= 0.7; } // smaller, tighter path on phones

      // fade in at the start of the path, out at the end
      const fade = Math.min(1, u / 0.06, (1 - u) / 0.06);
      card.mat.opacity = fade;
    });

    // only redraw the animated designs that are actually visible this frame
    visiblePainters.forEach((key) => {
      const { ctx, tex } = painters[key];
      paint(key, ctx, TEX_W, TEX_H, t);
      tex.needsUpdate = true;
    });
  });

  return (
    <group ref={group}>
      {cards.map((c, i) => (
        <mesh key={i} material={c.mat}>
          <planeGeometry args={[1.92, 1.08]} />
        </mesh>
      ))}
    </group>
  );
}

export default function MotionRibbon({ progress }: { progress: RibbonProgress }) {
  return (
    <Canvas camera={{ position: [0, 0, 0], fov: 60, near: 0.1, far: 100 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
      <Ribbon progress={progress} />
    </Canvas>
  );
}
