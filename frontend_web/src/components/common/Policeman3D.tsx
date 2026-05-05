import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Stylized 3D Sri Lanka Police officer built from primitives.
 * Uniform: khaki/tan shirt, dark navy trousers, peaked cap with badge,
 * black belt, gold buttons. Animated: idle sway + saluting arm + walking legs.
 */
export default function Policeman3D({
  position = [2.6, -1.4, 0] as [number, number, number],
  scale = 1,
}) {
  const root = useRef<THREE.Group>(null!);
  const rightArm = useRef<THREE.Group>(null!);
  const leftArm = useRef<THREE.Group>(null!);
  const leftLeg = useRef<THREE.Group>(null!);
  const rightLeg = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      // gentle bobbing + slow turn to face camera
      root.current.position.y = position[1] + Math.sin(t * 2) * 0.04;
      root.current.rotation.y = Math.sin(t * 0.4) * 0.4;
    }
    // Saluting right arm - cycles between salute and rest
    const saluteCycle = (Math.sin(t * 0.6) + 1) / 2; // 0..1
    if (rightArm.current) {
      // raise arm up and bend toward forehead
      rightArm.current.rotation.z = -0.2 - saluteCycle * 2.4;
      rightArm.current.rotation.x = -saluteCycle * 0.3;
    }
    // Left arm subtle swing
    if (leftArm.current) {
      leftArm.current.rotation.x = Math.sin(t * 1.5) * 0.25;
    }
    // Marching legs
    if (leftLeg.current) leftLeg.current.rotation.x = Math.sin(t * 1.5) * 0.35;
    if (rightLeg.current) rightLeg.current.rotation.x = -Math.sin(t * 1.5) * 0.35;
    // Head subtle look around
    if (head.current) head.current.rotation.y = Math.sin(t * 0.8) * 0.2;
  });

  // Sri Lanka Police colors
  const KHAKI = "#B8A678";       // shirt (light tan-khaki)
  const KHAKI_DARK = "#8C7A4E";
  const TROUSER = "#1A2238";     // dark navy trousers
  const SKIN = "#D9A77A";
  const BLACK = "#0E0E12";
  const GOLD = "#C9A84C";
  const RED = "#8B1A1A";

  return (
    <group ref={root} position={position} scale={scale}>
      {/* ---- HEAD ---- */}
      <group ref={head} position={[0, 1.7, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.07, 0.02, 0.2]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color={BLACK} />
        </mesh>
        <mesh position={[0.07, 0.02, 0.2]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color={BLACK} />
        </mesh>
        {/* Mustache */}
        <mesh position={[0, -0.07, 0.2]}>
          <boxGeometry args={[0.14, 0.025, 0.04]} />
          <meshStandardMaterial color={BLACK} roughness={0.9} />
        </mesh>

        {/* ---- PEAKED CAP ---- */}
        {/* Cap crown - khaki */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.23, 0.16, 24]} />
          <meshStandardMaterial color={KHAKI} roughness={0.6} />
        </mesh>
        {/* Top of cap */}
        <mesh position={[0, 0.31, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 24]} />
          <meshStandardMaterial color={KHAKI_DARK} roughness={0.6} />
        </mesh>
        {/* Black band around cap */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.245, 0.245, 0.05, 24]} />
          <meshStandardMaterial color={BLACK} roughness={0.7} />
        </mesh>
        {/* Cap visor (peak) - black */}
        <mesh position={[0, 0.13, 0.18]} rotation={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.03, 24, 1, false, -Math.PI / 2.2, Math.PI / 1.1]} />
          <meshStandardMaterial color={BLACK} metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Cap badge - gold star on front band */}
        <mesh position={[0, 0.18, 0.245]}>
          <cylinderGeometry args={[0.05, 0.05, 0.015, 16]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} emissive={GOLD} emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* ---- NECK ---- */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 12]} />
        <meshStandardMaterial color={SKIN} />
      </mesh>

      {/* ---- TORSO (shirt) ---- */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.62, 0.7, 0.32]} />
        <meshStandardMaterial color={KHAKI} roughness={0.65} />
      </mesh>
      {/* Shoulder epaulettes - red with gold */}
      <mesh position={[-0.27, 1.36, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.34]} />
        <meshStandardMaterial color={RED} roughness={0.6} />
      </mesh>
      <mesh position={[0.27, 1.36, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.34]} />
        <meshStandardMaterial color={RED} roughness={0.6} />
      </mesh>
      {/* Gold buttons down the front */}
      {[0.25, 0.1, -0.05, -0.2].map((y, i) => (
        <mesh key={i} position={[0, 1.05 + y, 0.165]}>
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} />
        </mesh>
      ))}
      {/* Pockets */}
      <mesh position={[-0.16, 1.18, 0.165]}>
        <boxGeometry args={[0.18, 0.16, 0.005]} />
        <meshStandardMaterial color={KHAKI_DARK} />
      </mesh>
      <mesh position={[0.16, 1.18, 0.165]}>
        <boxGeometry args={[0.18, 0.16, 0.005]} />
        <meshStandardMaterial color={KHAKI_DARK} />
      </mesh>

      {/* ---- BELT ---- */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.66, 0.08, 0.34]} />
        <meshStandardMaterial color={BLACK} roughness={0.5} />
      </mesh>
      {/* Belt buckle - gold */}
      <mesh position={[0, 0.72, 0.175]}>
        <boxGeometry args={[0.1, 0.07, 0.02]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} />
      </mesh>

      {/* ---- ARMS ---- */}
      {/* Right arm (saluting) - pivot at shoulder */}
      <group ref={rightArm} position={[0.36, 1.32, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
          <meshStandardMaterial color={KHAKI} roughness={0.65} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.65, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
      </group>
      {/* Left arm */}
      <group ref={leftArm} position={[-0.36, 1.32, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
          <meshStandardMaterial color={KHAKI} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
      </group>

      {/* ---- LEGS (trousers) ---- */}
      <group ref={leftLeg} position={[-0.16, 0.68, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.1, 0.72, 12]} />
          <meshStandardMaterial color={TROUSER} roughness={0.7} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.78, 0.05]}>
          <boxGeometry args={[0.16, 0.1, 0.28]} />
          <meshStandardMaterial color={BLACK} roughness={0.4} metalness={0.3} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.16, 0.68, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.1, 0.72, 12]} />
          <meshStandardMaterial color={TROUSER} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.78, 0.05]}>
          <boxGeometry args={[0.16, 0.1, 0.28]} />
          <meshStandardMaterial color={BLACK} roughness={0.4} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
