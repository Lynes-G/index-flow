"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAccentInkOnLight } from "@/lib/frontend/shared/accentColor";
import { getBaseUrl } from "@/lib/frontend/shared/getBaseUrl";
import {
  BackgroundType,
  isResolvedBackgroundDark,
  type ThemePreset,
} from "@/lib/frontend/appearance/themePresets";
import { cn } from "@/lib/frontend/shared/utils";

const getLuminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const toLinear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  const rLin = toLinear(r);
  const gLin = toLinear(g);
  const bLin = toLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
};

type PublicPageFooterProps = {
  accentColor: string;
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  backgroundSolidColor?: string;
  backgroundImageUrl?: string;
  preset: ThemePreset;
};

const PublicPageFooter = ({
  accentColor,
  backgroundType,
  backgroundValue,
  backgroundSolidColor,
  backgroundImageUrl,
  preset,
}: PublicPageFooterProps) => {
  const [imageIsDark, setImageIsDark] = useState<boolean | null>(null);
  const accentInk = getAccentInkOnLight(accentColor);

  useEffect(() => {
    if (backgroundType !== "image") {
      setImageIsDark(null);
      return;
    }
    if (!backgroundImageUrl) {
      setImageIsDark(null);
      return;
    }

    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = backgroundImageUrl;
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      const size = 20;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        setImageIsDark(null);
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      let total = 0;
      let count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] || 0;
        const g = data[i + 1] || 0;
        const b = data[i + 2] || 0;
        const luminance = getLuminance({ r, g, b });
        total += luminance;
        count += 1;
      }
      const average = count ? total / count : 1;
      setImageIsDark(average < 0.45);
    };
    img.onerror = () => {
      if (!cancelled) setImageIsDark(null);
    };

    return () => {
      cancelled = true;
    };
  }, [backgroundType, backgroundImageUrl]);

  const footerBaseIsDark = isResolvedBackgroundDark({
    backgroundType,
    backgroundValue,
    backgroundSolidColor,
    preset,
  });

  const footerTone =
    backgroundType === "image"
      ? imageIsDark
        ? "dark"
        : "light"
      : footerBaseIsDark
        ? "dark"
        : "light";

  const footerPillClass =
    footerTone === "dark"
      ? "public-footer-pill-dark px-4 py-2"
      : backgroundType === "image"
        ? "public-footer-pill-light px-4 py-2"
        : "";

  return (
    <footer
      className={cn(
        "mt-6 pt-5 text-center sm:mt-10 sm:pt-8",
        footerTone === "dark"
          ? "border-t border-white/20"
          : "border-t border-white/30",
      )}
    >
      <div
        className={cn(
          "inline-flex w-full max-w-full flex-col items-center gap-2 px-3 text-sm sm:min-w-[280px] sm:px-4",
          footerTone === "dark" ? "text-white/70" : "text-slate-600",
          footerPillClass,
        )}
      >
        <span>Powered by:</span>
        <Link
          href={getBaseUrl() + "/"}
          className={cn(
            "inline-flex items-center justify-center font-semibold hover:underline",
            footerTone === "dark" ? "text-white" : "text-slate-900",
          )}
          style={footerTone === "dark" ? undefined : { color: accentInk }}
          aria-label="Built by nullIsOne"
        >
          <span className="rounded-md bg-slate-950 p-1">
            <Image
              src="/nullIsOne2.svg"
              alt="nullIsOne logo"
              width={140}
              height={32}
              className="h-8 w-auto shrink-0"
            />
          </span>
        </Link>
      </div>
    </footer>
  );
};

export default PublicPageFooter;
