import {
  getBrandIconSrc,
  getBrandLogoSrc,
  type BrandSurfaceTone,
} from "@/lib/frontend/shared/brand-assets";
import Image from "next/image";

type BrandLogoProps = {
  tone: BrandSurfaceTone;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

type BrandIconProps = {
  tone: BrandSurfaceTone;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  tone,
  width,
  height,
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={getBrandLogoSrc(tone)}
      alt="IndexFlow"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}

export function BrandIcon({
  tone,
  width,
  height,
  className,
  priority = false,
}: BrandIconProps) {
  return (
    <Image
      src={getBrandIconSrc(tone)}
      alt="IndexFlow"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
