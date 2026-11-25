"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import type { QualityTier } from "@/lib/hooks";

/**
 * Studio lighting for the wig. The hair shader fakes its own key + rim lights,
 * but the physical bust and the environment reflections are lit for real:
 * a warm key from camera left, a hot orange rim from behind, and a cool fill
 * to keep the shadows from going dead. The rim sweeps as the story progresses.
 */
export function Studio({
  quality,
  progressRef,
}: {
  quality: QualityTier;
  progressRef?: React.MutableRefObject<number>;
}) {
  const rim = React.useRef<THREE.SpotLight>(null);
  const key = React.useRef<THREE.DirectionalLight>(null);
  const envRes = quality === "low" ? 128 : quality === "medium" ? 256 : 384;

  useFrame(() => {
    const p = progressRef?.current ?? 0;
    if (rim.current) {
      rim.current.intensity = 70 + p * 80;
      rim.current.position.x = -4.2 + p * 2.6;
      rim.current.position.z = -3.6 + p * 1.4;
    }
    if (key.current) {
      key.current.intensity = 2.1 + p * 0.7;
      key.current.position.x = 3.2 - p * 1.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.22} color="#4a2c1a" />
      <directionalLight
        ref={key}
        position={[3.2, 3.8, 3.4]}
        intensity={2.2}
        color="#ffd2ab"
      />
      <spotLight
        ref={rim}
        position={[-4.2, 1.6, -3.6]}
        angle={0.85}
        penumbra={1}
        intensity={70}
        distance={16}
        decay={2}
        color="#ff5a00"
      />
      <pointLight position={[3.6, -0.4, 2.6]} intensity={18} distance={10} decay={2} color="#ff8a4d" />
      <pointLight position={[-2.2, 2.4, 2.2]} intensity={7} distance={8} decay={2} color="#c9dcff" />

      <Environment resolution={envRes} frames={1}>
        <color attach="background" args={["#040302"]} />
        <Lightformer
          form="rect"
          intensity={3.4}
          color="#ffd9b3"
          scale={[5, 2.2, 1]}
          position={[3, 4, 4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={5.5}
          color="#ff5a00"
          scale={[2.2, 6, 1]}
          position={[-4, 1, -3]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={1.4}
          color="#ffffff"
          scale={[3, 3, 1]}
          position={[0, 5, -4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.7}
          color="#8fa6c9"
          scale={[4, 3, 1]}
          position={[-3, 0, 3]}
          target={[0, 0, 0]}
        />
      </Environment>

      {quality !== "low" && (
        <ContactShadows
          position={[0, -2.54, 0]}
          opacity={0.5}
          scale={7}
          blur={2.8}
          far={4.2}
          resolution={quality === "high" ? 512 : 256}
          frames={1}
          color="#000000"
        />
      )}
    </>
  );
}
