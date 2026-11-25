"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion, useSceneQuality } from "@/lib/hooks";
import type { WigMode } from "@/components/three/Wig";
import type { HairStyle } from "@/components/three/hairGeometry";

const WigScene = dynamic(() => import("./WigScene"), {
  ssr: false,
  loading: () => <SceneSkeleton />,
});

export interface WigCanvasProps {
  mode?: WigMode;
  style?: HairStyle;
  colorName?: string;
  progressRef?: React.MutableRefObject<number>;
  seed?: number;
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
  label?: string;
  skeletonLabel?: string;
}

function SceneSkeleton({ label = "Sculpting" }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <span className="relative grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-orange/20" />
          <span className="absolute inset-2 rounded-full border border-orange/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-orange" />
        </span>
        <span className="text-[9px] uppercase tracking-[0.4em] text-bone/40">{label}</span>
      </div>
    </div>
  );
}

/**
 * Lazy-loaded 3D wrapper. The canvas only renders while it is near the
 * viewport (IntersectionObserver + frameloop), caps DPR by device tier, and
 * falls back to a light tier for phones / low-core machines.
 */
export function WigCanvas({
  mode = "hero",
  style = "straight",
  colorName = "Jet",
  progressRef,
  seed,
  autoRotate,
  interactive,
  className,
  label = "Rotating 3D render of a luxury wig",
  skeletonLabel,
}: WigCanvasProps) {
  const quality = useSceneQuality();
  const reducedMotion = usePrefersReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "180px 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <WigScene
        mode={mode}
        style={style}
        colorName={colorName}
        quality={quality}
        reducedMotion={reducedMotion}
        progressRef={progressRef}
        seed={seed}
        autoRotate={autoRotate}
        interactive={interactive}
        visible={visible}
      />
      {!visible && <SceneSkeleton label={skeletonLabel} />}
    </div>
  );
}
