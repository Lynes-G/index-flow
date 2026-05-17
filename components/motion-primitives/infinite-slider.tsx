"use client";

import * as React from "react";
import {
  Marquee,
  MarqueeContent,
  type MarqueeProps,
} from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

type InfiniteSliderProps = Omit<MarqueeProps, "children"> & {
  children: React.ReactNode;
  speedOnHover?: number;
};

function InfiniteSlider({
  children,
  className,
  speed = 40,
  speedOnHover,
  gap = 96,
  onMouseEnter,
  onMouseLeave,
  ...props
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const activeSpeed = isHovered && speedOnHover ? speedOnHover : speed;

  return (
    <Marquee
      pauseOnHover={false}
      speed={activeSpeed}
      gap={gap}
      className={cn("w-full", className)}
      onMouseEnter={(event) => {
        setIsHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setIsHovered(false);
        onMouseLeave?.(event);
      }}
      {...props}
    >
      <MarqueeContent>{children}</MarqueeContent>
    </Marquee>
  );
}

export { InfiniteSlider };
