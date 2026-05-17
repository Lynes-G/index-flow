"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressiveBlurProps = React.ComponentPropsWithoutRef<"div"> & {
  direction?: "left" | "right";
  blurIntensity?: number;
};

function ProgressiveBlur({
  className,
  direction = "left",
  blurIntensity = 1,
  style,
  ...props
}: ProgressiveBlurProps) {
  const gradient =
    direction === "left"
      ? "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.35), rgba(255,255,255,0))"
      : "linear-gradient(270deg, rgba(255,255,255,0.95), rgba(255,255,255,0.35), rgba(255,255,255,0))";

  return (
    <div
      aria-hidden="true"
      className={cn("bg-transparent", className)}
      style={{
        backdropFilter: `blur(${blurIntensity * 14}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity * 14}px)`,
        maskImage: gradient,
        WebkitMaskImage: gradient,
        ...style,
      }}
      {...props}
    />
  );
}

export { ProgressiveBlur };
