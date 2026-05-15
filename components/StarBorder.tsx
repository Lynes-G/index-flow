"use client";

import { ReactNode } from "react";

type StarBorderProps = {
  children: ReactNode;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  glowOpacity?: number;
};

const StarBorder = ({
  children,
  className = "",
  color = "#ffffff",
  speed = "7s",
  thickness = 1,
  glowOpacity = 0.55,
}: StarBorderProps) => {
  return (
    <div
      className={`star-border-container ${className}`.trim()}
      style={{
        padding: `${thickness}px`,
        boxShadow: `0 0 0 1px ${color}25, 0 0 28px color-mix(in srgb, ${color} ${Math.round(
          glowOpacity * 100,
        )}%, transparent)`,
      }}
    >
      <div
        className="star-border-halo"
        style={{
          background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${color} ${Math.round(
            glowOpacity * 100,
          )}%, transparent) 0%, transparent 72%)`,
          animationDuration: `calc(${speed} * 1.6)`,
        }}
      />
      <div
        className="star-border-orbit"
        style={{
          background: `conic-gradient(
            from 0deg,
            color-mix(in srgb, ${color} 18%, transparent) 0deg,
            ${color} 48deg,
            #ffffff 78deg,
            ${color} 108deg,
            color-mix(in srgb, ${color} 22%, transparent) 148deg,
            transparent 210deg,
            color-mix(in srgb, ${color} 14%, transparent) 260deg,
            ${color} 310deg,
            #ffffff 332deg,
            ${color} 348deg,
            color-mix(in srgb, ${color} 18%, transparent) 360deg
          )`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
};

export default StarBorder;
