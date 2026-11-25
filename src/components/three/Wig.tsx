"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { createBustGeometry, createHairGeometry, type HairStyle } from "./hairGeometry";
import { hairFragmentShader, hairVertexShader } from "./hairShaders";
import type { QualityTier } from "@/lib/hooks";

export type WigMode = "hero" | "story" | "product";

const QUALITY = {
  high: { count: 2400, segments: 16 },
  medium: { count: 1250, segments: 12 },
  low: { count: 560, segments: 9 },
} as const;

/** Rich, warm bases. They read black in shadow and amber where the light lands. */
export const HAIR_PALETTES: Record<string, { a: string; b: string }> = {
  Jet: { a: "#070403", b: "#241408" },
  Espresso: { a: "#0d0704", b: "#2d190d" },
  Chestnut: { a: "#120a05", b: "#3b200f" },
  Honey: { a: "#1a0f07", b: "#533016" },
  Auburn: { a: "#100604", b: "#41170c" },
};

interface WigProps {
  mode?: WigMode;
  style?: HairStyle;
  colorName?: string;
  quality: QualityTier;
  reducedMotion?: boolean;
  progressRef?: React.MutableRefObject<number>;
  seed?: number;
  autoRotate?: boolean;
  interactive?: boolean;
}

function useCameraLook() {
  const { camera, size } = useThree();
  React.useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    camera.position.set(0, 0.12, aspect < 0.72 ? 6.9 : 6.3);
    camera.lookAt(0, -0.38, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
}

export function Wig({
  mode = "hero",
  style = "straight",
  colorName = "Jet",
  quality,
  reducedMotion = false,
  progressRef,
  seed = 7,
  autoRotate = true,
  interactive = true,
}: WigProps) {
  const group = React.useRef<THREE.Group>(null);
  const intro = React.useRef(0);
  const config = QUALITY[quality];
  const palette = HAIR_PALETTES[colorName] ?? HAIR_PALETTES.Jet;

  useCameraLook();

  const bustGeometry = React.useMemo(() => createBustGeometry(), []);
  const hairGeometry = React.useMemo(
    () =>
      createHairGeometry({
        count: config.count,
        segments: config.segments,
        style,
        seed,
        volume: style === "curly" ? 1.18 : 1,
        lengthScale: style === "curly" ? 0.94 : 1,
        widthScale: quality === "low" ? 1.25 : 1,
      }),
    [config.count, config.segments, style, seed, quality],
  );

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uSway: { value: quality === "low" ? 0.65 : 1 },
      uColorA: { value: new THREE.Color(palette.a) },
      uColorB: { value: new THREE.Color(palette.b) },
      uKeyDir: { value: new THREE.Vector3(0.42, 0.58, 0.7).normalize() },
      uRimDir: { value: new THREE.Vector3(-0.75, 0.28, -0.6).normalize() },
      uKeyColor: { value: new THREE.Color("#ffc496") },
      uRimColor: { value: new THREE.Color("#ff5a00") },
      uGlowColor: { value: new THREE.Color("#ff7a26") },
      uExposure: { value: 1.02 },
    }),
    [palette.a, palette.b, quality, reducedMotion],
  );

  const pointer = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!interactive || reducedMotion) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX / window.innerWidth - 0.5;
      pointer.current.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, reducedMotion]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    intro.current = Math.min(1, intro.current + d * 0.9);
    const easedIntro = 1 - Math.pow(1 - intro.current, 3);
    const progress = progressRef?.current ?? 0;
    const scroll =
      typeof window !== "undefined" ? Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.2) : 0;

    let targetRot = 0;
    let targetX = 0;
    let targetY = -0.22;
    let targetScale = 1.02;
    let tilt = -0.02;

    // Present the back/three-quarter of the crown: the procedural model has no
    // face, so the nape is the most convincing silhouette.
    const BACK = Math.PI * 0.92;

    if (mode === "hero") {
      targetRot =
        BACK + (autoRotate && !reducedMotion ? t * 0.14 : 0) + pointer.current.x * 0.65 + scroll * 0.55;
      targetY = -0.22 + (reducedMotion ? 0 : Math.sin(t * 0.55) * 0.022) - scroll * 0.22;
      tilt = pointer.current.y * -0.16;
      targetScale = 1.02;
    } else if (mode === "story") {
      targetRot = BACK + 0.35 + progress * Math.PI * 1.75 + pointer.current.x * 0.28;
      targetY = -0.2 + Math.sin(progress * Math.PI) * 0.05;
      targetX = (progress - 0.5) * 0.24;
      tilt = pointer.current.y * -0.08;
      targetScale = 1.02 + progress * 0.06;
    } else {
      targetRot = BACK + (autoRotate && !reducedMotion ? t * 0.18 : 0) + pointer.current.x * 0.55;
      targetY = -0.24;
      tilt = pointer.current.y * -0.1;
      targetScale = 1.0;
    }

    const ease = reducedMotion ? 12 : mode === "story" ? 6 : 3.2;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRot, ease, d);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tilt, 3, d);
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 2.6, d);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 2.6, d);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetScale * (0.9 + 0.1 * easedIntro), 3, d));

    uniforms.uTime.value = t;
    uniforms.uScroll.value = scroll;
    uniforms.uPointer.value.x = THREE.MathUtils.damp(
      uniforms.uPointer.value.x,
      pointer.current.x * 2,
      4,
      d,
    );
    uniforms.uPointer.value.y = THREE.MathUtils.damp(
      uniforms.uPointer.value.y,
      pointer.current.y * 2,
      4,
      d,
    );
    // A slow colour-temperature drift keeps the lighting alive without a light show.
    uniforms.uExposure.value = 1.0 + Math.sin(t * 0.35) * 0.04 + progress * 0.1;
  });

  return (
    <group ref={group} position={[0, -0.22, 0]} rotation={[0, Math.PI * 0.92, 0]}>
      <mesh geometry={bustGeometry} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#0c0a09"
          roughness={0.58}
          metalness={0.22}
          clearcoat={0.2}
          clearcoatRoughness={0.6}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* The strands use a hand-written shader for Kajiya-Kay anisotropy. */}
      <mesh geometry={hairGeometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={hairVertexShader}
          fragmentShader={hairFragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          transparent={false}
          depthWrite
        />
      </mesh>
    </group>
  );
}
