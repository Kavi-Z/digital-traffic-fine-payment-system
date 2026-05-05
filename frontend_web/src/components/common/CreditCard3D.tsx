import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import * as THREE from "three";

function makeFrontTexture(name: string, number: string, expiry: string) {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 640;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 1024, 640);
  grad.addColorStop(0, "#9A7A32");
  grad.addColorStop(0.5, "#E8C96C");
  grad.addColorStop(1, "#9A7A32");
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 1024, 640);
  ctx.strokeStyle = "rgba(10,22,40,0.4)"; ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 984, 600);
  // chip
  ctx.fillStyle = "#0A1628"; ctx.fillRect(70, 220, 130, 100);
  ctx.fillStyle = "#C9A84C"; ctx.fillRect(80, 230, 110, 80);
  ctx.fillStyle = "#0A1628";
  ctx.font = "bold 36px 'Playfair Display', serif";
  ctx.fillText("SRI LANKA POLICE", 70, 100);
  ctx.font = "italic 24px 'Crimson Text', serif";
  ctx.fillText("Traffic Fine Card", 70, 140);
  ctx.font = "bold 60px monospace";
  ctx.fillText(number || "•••• •••• •••• ••••", 70, 410);
  ctx.font = "20px 'Crimson Text', serif";
  ctx.fillText("CARDHOLDER", 70, 490);
  ctx.fillText("EXPIRES", 720, 490);
  ctx.font = "bold 30px 'Playfair Display', serif";
  ctx.fillText((name || "YOUR NAME").toUpperCase(), 70, 530);
  ctx.fillText(expiry || "MM/YY", 720, 530);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  return t;
}

function makeBackTexture(cvv: string) {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 640;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0A1628"; ctx.fillRect(0, 0, 1024, 640);
  ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 100, 1024, 130);
  ctx.fillStyle = "#F5F0E8"; ctx.fillRect(70, 290, 600, 80);
  ctx.fillStyle = "#0A1628"; ctx.font = "bold 40px monospace";
  ctx.fillText(cvv || "•••", 600, 350);
  ctx.fillStyle = "#C9A84C"; ctx.font = "italic 22px 'Crimson Text', serif";
  ctx.fillText("Authorized Signature & CVV", 70, 410);
  return new THREE.CanvasTexture(c);
}

function Card({ name, number, expiry, cvv, flipped }: { name: string; number: string; expiry: string; cvv: string; flipped: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const front = useMemo(() => makeFrontTexture(name, number, expiry), [name, number, expiry]);
  const back = useMemo(() => makeBackTexture(cvv), [cvv]);
  useFrame((state) => {
    if (!ref.current) return;
    const target = flipped ? Math.PI : 0;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, target, 0.1);
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.05;
  });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[3.4, 2.1, 0.06]} />
        <meshStandardMaterial map={front} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.031]}>
        <planeGeometry args={[3.4, 2.1]} />
        <meshStandardMaterial map={back} metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function CreditCard3D(props: { name: string; number: string; expiry: string; cvv: string; flipped: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div style={{ width: "100%", height: 280 }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[3, 3, 4]} intensity={2} color="#E8C96C" />
          <pointLight position={[-3, -2, 3]} intensity={1} color="#ffffff" />
          <Card {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
