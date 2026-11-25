import React, {useEffect, useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Real 3D hero bottle (lathe geometry + physical transmission material), rendered once as a
 * transparent 360° turntable image sequence and reused by every scene.
 */
const PROFILE: [number, number][] = [
  [0, 0], [0.36, 0], [0.43, 0.04], [0.45, 0.14], [0.45, 1.62], [0.43, 1.78], [0.35, 1.98], [0.24, 2.2], [0.17, 2.34], [0.17, 2.52],
];

const ribbed = (pts: [number, number][], scale = 1, maxY = 99) => {
  const out: THREE.Vector2[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const steps = 24;
    for (let s = 0; s < steps; s++) {
      const u = s / steps;
      let x = x0 + (x1 - x0) * u;
      const y = y0 + (y1 - y0) * u;
      if (y > maxY) continue;
      // moulded grooves on the body
      if (y > 0.3 && y < 1.5 && x > 0.42) x -= 0.022 * Math.max(0, Math.sin((y - 0.3) * Math.PI * 7)) ** 6;
      out.push(new THREE.Vector2(x * scale, y));
    }
  }
  const last = pts[pts.length - 1];
  if (last[1] <= maxY) out.push(new THREE.Vector2(last[0] * scale, last[1]));
  else out.push(new THREE.Vector2(0, maxY));
  return out;
};

const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => env.dispose();
  }, [gl, scene]);
  return null;
};

const Bottle: React.FC<{angle: number}> = ({angle}) => {
  const body = useMemo(() => new THREE.LatheGeometry(ribbed(PROFILE), 128), []);
  const water = useMemo(() => new THREE.LatheGeometry(ribbed(PROFILE, 0.94, 1.5), 96), []);
  return (
    <group rotation={[0.12, angle, 0.05]} position={[0, -1.3, 0]}>
      <mesh geometry={body}>
        {/* clear PET: mostly see-through, strong env reflections + clearcoat */}
        <meshPhysicalMaterial
          color="#e8f8ff"
          transparent
          opacity={0.32}
          emissive="#bfe8ff"
          emissiveIntensity={0.12}
          roughness={0.04}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={2.4}
          specularIntensity={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={water} renderOrder={-1}>
        <meshPhysicalMaterial color="#6ccbf5" emissive="#2b9fd8" emissiveIntensity={0.15} transparent opacity={0.55} roughness={0.02} envMapIntensity={1.6} clearcoat={1} depthWrite={false} />
      </mesh>
      {/* label band */}
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.458, 0.458, 0.42, 128, 1, true]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <cylinderGeometry args={[0.461, 0.461, 0.09, 128, 1, true]} />
        <meshStandardMaterial color="#3fae5a" roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* cap with grip ridges */}
      <mesh position={[0, 2.64, 0]}>
        <cylinderGeometry args={[0.215, 0.215, 0.27, 48]} />
        <meshStandardMaterial color="#2b9fd8" roughness={0.32} metalness={0.05} />
      </mesh>
      {Array.from({length: 28}, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.218, 2.63, Math.sin(a) * 0.218]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.012, 0.22, 0.022]} />
            <meshStandardMaterial color="#1f86bd" roughness={0.4} />
          </mesh>
        );
      })}
      <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.025, 12, 64]} />
        <meshStandardMaterial color="#2b9fd8" roughness={0.35} />
      </mesh>
    </group>
  );
};

export const BottleSpin: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  const angle = (f / durationInFrames) * Math.PI * 2;
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{fov: 28, position: [0, 0.15, 7.0]}}
      gl={{alpha: true, antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping}}
      style={{background: 'transparent'}}
    >
      <Env />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, 2, -3]} intensity={1.4} color="#bfe6ff" />
      <Bottle angle={angle} />
    </ThreeCanvas>
  );
};
