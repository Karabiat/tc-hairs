"use client";

import * as React from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

/**
 * Optional production path: set NEXT_PUBLIC_WIG_GLB=/models/wig.glb and a
 * Draco-compressed photoreal wig will be loaded instead of the procedural
 * strands. The model is normalised to the same 3.6-unit height so the camera,
 * lighting and story choreography stay identical.
 *
 * See README for the gltf-transform compression command.
 */
export function GltfWig({ url }: { url: string }) {
  // Second argument enables the DRACOLoader (decoder served from the CDN).
  const { scene } = useGLTF(url, true);

  const model = React.useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          if (mat && "envMapIntensity" in mat) {
            (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.1;
          }
        });
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = size.y > 0.001 ? 3.5 / size.y : 1;
    clone.position.sub(center);
    return { clone, scale };
  }, [scene]);

  return (
    <group position={[0, -0.32, 0]} scale={model.scale}>
      <primitive object={model.clone} />
    </group>
  );
}

export class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // Silent fallback to the procedural wig; the page should never break.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
