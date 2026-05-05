import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { districts } from "@/data/mockData";

const positions: Record<string, [number, number]> = {
  // Northern Province
  Jaffna: [0, 2.4],
  Kilinochchi: [-0.2, 2.0],
  Mullaitivu: [0.4, 2.0],
  Vavuniya: [-0.2, 1.6],
  Mannar: [-0.8, 1.8],

  // North Central
  Anuradhapura: [-0.4, 1.4],
  Polonnaruwa: [0.4, 1.2],

  // North Western
  Kurunegala: [-0.8, 0.8],
  Puttalam: [-1.4, 1.0],

  // Central
  Kandy: [-0.2, 0.6],
  Matale: [-0.2, 0.9],
  "Nuwara Eliya": [0.2, 0.4],   // ✅ FIXED

  // Eastern
  Trincomalee: [0.8, 1.4],
  Batticaloa: [1.0, 0.6],
  Ampara: [1.0, -0.2],

  // Western
  Colombo: [-1.2, -0.2],
  Gampaha: [-1.2, 0.3],
  Kalutara: [-1.2, -0.8],

  // Sabaragamuwa
  Ratnapura: [-0.4, -0.6],
  Kegalle: [-0.8, 0.2],

  // Uva
  Badulla: [0.6, 0.2],
  Monaragala: [0.6, -0.6],

  // Southern
  Galle: [-0.6, -1.4],
  Matara: [0, -1.8],
  Hambantota: [0.6, -1.6],
};

function Pillar({ x, z, height, color, name, amount }: { x: number; z: number; height: number; color: string; name: string; amount: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hover, setHover] = useState(false);
  const [grown, setGrown] = useState(0);
  useFrame((_, dt) => {
    setGrown((g) => Math.min(1, g + dt * 0.5));
    if (ref.current) {
      const target = height * grown;
      ref.current.scale.y = target;
      ref.current.position.y = target / 2;
    }
  });
  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={ref}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[0.35, 1, 0.35]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} emissive={hover ? "#E8C96C" : "#000"} emissiveIntensity={hover ? 0.6 : 0} />
      </mesh>
      <Text position={[0, height + 0.3, 0]} fontSize={0.18} color="#E8C96C" anchorX="center">
        {name}
      </Text>
      {hover && (
        <Text position={[0, height + 0.55, 0]} fontSize={0.14} color="#F5F0E8" anchorX="center">
          {`LKR ${(amount / 1_000_000).toFixed(1)}M`}
        </Text>
      )}
    </group>
  );
}

function Scene() {
  const max = Math.max(...districts.map((d) => d.amount));
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 8, 5]} intensity={2} color="#E8C96C" />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#8B1A1A" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#0A1628" metalness={0.3} roughness={0.8} />
      </mesh>
      {districts.map((d) => {
        const [x, z] = positions[d.name] ?? [0, 0];
        const ratio = d.amount / max;
        const h = 0.5 + ratio * 2.5;
        const t = ratio;
        const color = new THREE.Color().lerpColors(new THREE.Color("#1A3A5C"), new THREE.Color("#E8C96C"), t);
        return <Pillar key={d.name} x={x} z={z} height={h} color={"#" + color.getHexString()} name={d.name} amount={d.amount} />;
      })}
      <Float floatIntensity={0.3} speed={1.5}>
        <Text position={[0, 4, 0]} fontSize={0.4} color="#C9A84C" anchorX="center">
          SRI LANKA
        </Text>
      </Float>
      <OrbitControls enablePan={false} minDistance={5} maxDistance={15} maxPolarAngle={Math.PI / 2.2} />
    </>
  );
}

export default function SriLankaMap3D() {
  return (
    <div style={{ width: "100%", height: 480 }}>
      <Canvas camera={{ position: [4, 6, 7], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
