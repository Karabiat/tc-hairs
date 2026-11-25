"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { Wig, type WigMode } from "./Wig";
import { Studio } from "./Studio";
import { GltfWig, ModelErrorBoundary } from "./GltfWig";
import type { HairStyle } from "./hairGeometry";
import type { QualityTier } from "@/lib/hooks";

export interface WigSceneProps {
  mode: WigMode;
  style: HairStyle;
  colorName: string;
  quality: QualityTier;
  reducedMotion: boolean;
  progressRef?: React.MutableRefObject<number>;
  seed?: number;
  autoRotate?: boolean;
  interactive?: boolean;
  visible?: boolean;
}

const GLB_URL = process.env.NEXT_PUBLIC_WIG_GLB;

export default function WigScene({
  mode,
  style,
  colorName,
  quality,
  reducedMotion,
  progressRef,
  seed = 7,
  autoRotate = true,
  interactive = true,
  visible = true,
}: WigSceneProps) {
  const dpr: [number, number] =
    quality === "high" ? [1, 1.9] : quality === "medium" ? [1, 1.5] : [1, 1.2];

  return (
    <Canvas
      aria-hidden
      dpr={dpr}
      camera={{ position: [0, 0.12, 6.3], fov: 36, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : visible ? "always" : "never"}
      performance={{ min: 0.55 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.02;
      }}
    >
      <React.Suspense fallback={null}>
        {GLB_URL ? (
          <ModelErrorBoundary
            fallback={
              <Wig
                mode={mode}
                style={style}
                colorName={colorName}
                quality={quality}
                reducedMotion={reducedMotion}
                progressRef={progressRef}
                seed={seed}
                autoRotate={autoRotate}
                interactive={interactive}
              />
            }
          >
            <React.Suspense
              fallback={
                <Wig
                  mode={mode}
                  style={style}
                  colorName={colorName}
                  quality={quality}
                  reducedMotion={reducedMotion}
                  progressRef={progressRef}
                  seed={seed}
                  autoRotate={autoRotate}
                  interactive={interactive}
                />
              }
            >
              <GltfWig url={GLB_URL} />
            </React.Suspense>
          </ModelErrorBoundary>
        ) : (
          <Wig
            mode={mode}
            style={style}
            colorName={colorName}
            quality={quality}
            reducedMotion={reducedMotion}
            progressRef={progressRef}
            seed={seed}
            autoRotate={autoRotate}
            interactive={interactive}
          />
        )}
        <Studio quality={quality} progressRef={progressRef} />
      </React.Suspense>
      {!reducedMotion && visible && <AdaptiveDpr />}
    </Canvas>
  );
}
