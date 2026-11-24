import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '@remotion/three';
import { continueRender, delayRender, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../styles/tokens';

const VERTEX_SHADER = `
  uniform float uCurl;
  uniform float uRadius;
  varying vec2 vUv;
  varying float vShade;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Diagonal curl axis from bottom-left toward top-right
    vec2 dir = normalize(vec2(0.75, 0.65));
    float proj = dot(pos.xy, dir);
    float curlLine = mix(-0.95, 1.15, uCurl);
    float dist = proj - curlLine;

    vShade = 1.0;

    if (dist > 0.0) {
      float theta = dist / uRadius;
      float newProj;
      float newZ;

      if (theta < 3.14159265) {
        newProj = curlLine + sin(theta) * uRadius;
        newZ = (1.0 - cos(theta)) * uRadius;
        vShade = 0.72 + 0.28 * cos(theta);
      } else {
        float flatDist = dist - 3.14159265 * uRadius;
        newProj = curlLine - flatDist;
        newZ = 2.0 * uRadius;
        vShade = 0.88;
      }

      pos.xy += dir * (newProj - proj);
      pos.z += newZ;
    } else {
      // Soft ambient shadow cast onto flat card near the crease
      vShade = smoothstep(0.0, -0.22, dist) * 0.22 + 0.78;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uFrontMap;
  uniform vec3 uBackColor;
  varying vec2 vUv;
  varying float vShade;

  void main() {
    vec3 color = gl_FrontFacing
      ? texture2D(uFrontMap, vUv).rgb
      : uBackColor;
    gl_FragColor = vec4(color * vShade, 1.0);
  }
`;

interface PageCurl3DProps {
  cardImageSrc: string;
  startFrame: number;
  duration?: number;
  /** card size and position in scene units (defaults = skill values) */
  scale?: number;
  position?: [number, number, number];
}

export const PageCurl3D: React.FC<PageCurl3DProps> = ({
  cardImageSrc,
  startFrame,
  duration = 32,
  scale = 1,
  position = [-0.22, -0.04, 0],
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const curlProgress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0.05, 1.0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.85, 0.3, 1),
    }
  );

  const [handle] = React.useState(() => delayRender('card texture'));
  const texture = useMemo(
    () => new THREE.TextureLoader().load(cardImageSrc, (t) => { t.colorSpace = THREE.SRGBColorSpace; continueRender(handle); }),
    [cardImageSrc, handle]
  );

  const uniforms = useMemo(
    () => ({
      uCurl: { value: curlProgress },
      uRadius: { value: 0.14 },
      uFrontMap: { value: texture },
      uBackColor: { value: new THREE.Color(COLORS.navy) },
    }),
    [texture]
  );

  uniforms.uCurl.value = curlProgress;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, 2.7], fov: 38 }}
      style={{ backgroundColor: 'transparent' }}
    >
      <mesh position={position} scale={[scale, scale, scale]}>
        <planeGeometry args={[1.05, 1.48, 64, 96]} />
        <shaderMaterial
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
    </ThreeCanvas>
  );
};
