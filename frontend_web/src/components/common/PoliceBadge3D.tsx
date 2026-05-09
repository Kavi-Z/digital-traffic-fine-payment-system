import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import Policeman3D from "./Policeman3D";

function HexBadge() {
  const ref = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  const hexShape = useMemo(() => {
    const s = new THREE.Shape();
    const r = 1.4;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      i === 0 ? s.moveTo(x, y) : s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, []);

  const starShape = useMemo(() => {
    const s = new THREE.Shape();
    const outer = 0.55, inner = 0.22;
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      i === 0 ? s.moveTo(x, y) : s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      mouse.x * 0.6 + state.clock.elapsedTime * 0.25,
      0.05
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -mouse.y * 0.3,
      0.05
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={ref}>
        <mesh castShadow>
          <extrudeGeometry args={[hexShape, { depth: 0.18, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4 }]} />
          <meshStandardMaterial color="#C9A84C" metalness={1} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0, 0.2]}>
          <extrudeGeometry args={[hexShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.02 }]} />
          <meshStandardMaterial color="#0A1628" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.28]}>
          <extrudeGeometry args={[starShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]} />
          <meshStandardMaterial color="#E8C96C" metalness={1} roughness={0.1} emissive="#C9A84C" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function PoliceCar() {
  const ref = useRef<THREE.Group>(null!);
  const lightRef1 = useRef<THREE.MeshStandardMaterial>(null!);
  const lightRef2 = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15 - 0.2;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
    const flash = Math.floor(state.clock.elapsedTime * 2) % 2;
    if (lightRef1.current) lightRef1.current.emissiveIntensity = flash ? 3 : 0;
    if (lightRef2.current) lightRef2.current.emissiveIntensity = flash ? 0 : 3;
  });
  return (
    <group ref={ref} position={[-3.2, -0.2, -0.5]} scale={0.6}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.5, 1]} />
        <meshStandardMaterial color="#0A1628" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.1, 0.45, 0]}>
        <boxGeometry args={[1.4, 0.4, 0.9]} />
        <meshStandardMaterial color="#112240" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.7, 0.25]}><boxGeometry args={[0.3, 0.1, 0.15]} /><meshStandardMaterial ref={lightRef1} color="#8B1A1A" emissive="#ff0000" emissiveIntensity={2} /></mesh>
      <mesh position={[0, 0.7, -0.25]}><boxGeometry args={[0.3, 0.1, 0.15]} /><meshStandardMaterial ref={lightRef2} color="#1a3a8b" emissive="#0066ff" emissiveIntensity={2} /></mesh>
      <mesh position={[0, 0, 0.51]}><boxGeometry args={[2.45, 0.05, 0.04]} /><meshStandardMaterial color="#C9A84C" metalness={1} roughness={0.2} /></mesh>
      {[[-0.7, -0.3, 0.5], [0.7, -0.3, 0.5], [-0.7, -0.3, -0.5], [0.7, -0.3, -0.5]].map((p, i) => (
        <mesh key={i} position={p as [number,number,number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.18, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Shield() {
  const ref = useRef<THREE.Group>(null!);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.2);
    s.bezierCurveTo(1.1, 1.2, 1.1, 0.4, 1.0, 0);
    s.bezierCurveTo(1.0, -0.8, 0.5, -1.3, 0, -1.5);
    s.bezierCurveTo(-0.5, -1.3, -1.0, -0.8, -1.0, 0);
    s.bezierCurveTo(-1.1, 0.4, -1.1, 1.2, 0, 1.2);
    return s;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    ref.current.scale.setScalar(s);
  });
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={ref} position={[3.2, 0, -0.5]} scale={0.7}>
        <mesh>
          <extrudeGeometry args={[shape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.04 }]} />
          <meshStandardMaterial color="#C9A84C" metalness={0.95} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0, 0.23]}>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial color="#8B1A1A" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

function Particles({ count = 150 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () => Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 10 - 2,
      s: Math.random() * 0.03 + 0.01,
      sp: Math.random() * 0.3 + 0.1,
    })),
    [count]
  );
  useFrame((state) => {
    if (!ref.current) return;
    data.forEach((d, i) => {
      const y = ((d.y + state.clock.elapsedTime * d.sp) % 12) - 6;
      dummy.position.set(d.x, y, d.z);
      dummy.rotation.set(state.clock.elapsedTime * d.sp, state.clock.elapsedTime * d.sp, 0);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#E8C96C" metalness={1} roughness={0.2} emissive="#C9A84C" emissiveIntensity={0.5} />
    </instancedMesh>
  );
}

export default function PoliceBadge3D({ minimal = false }: { minimal?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={2.5} color="#E8C96C" />
        <pointLight position={[-3, -2, 2]} intensity={1.5} color="#8B1A1A" />
        <pointLight position={[0, 0, 4]} intensity={1.2} color="#ffffff" />
        <HexBadge />
        {!minimal && <>
          <PoliceCar />
          <Shield />
          <Policeman3D position={[0, -1.6, 1.2]} scale={0.95} />
          <Particles />
          <Stars radius={50} depth={30} count={800} factor={3} fade speed={0.5} />
        </>}
        <fog attach="fog" args={["#0A1628", 8, 20]} />
      </Suspense>
    </Canvas>
  );
}
