"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { BackgroundType } from "@/lib/themePresets";
import { cn } from "@/lib/utils";

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    const [r, g, b] = normalized.split("");
    return {
      r: parseInt(`${r}${r}`, 16),
      g: parseInt(`${g}${g}`, 16),
      b: parseInt(`${b}${b}`, 16),
    };
  }
  if (normalized.length === 6) {
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    };
  }
  return null;
};

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

const isDarkBackground = ({
  backgroundType,
  backgroundValue,
  backgroundSolidColor,
  preset,
}: {
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  backgroundSolidColor?: string;
  preset: { background: { value: string; baseColor?: string } };
}) => {
  const sourceValue =
    backgroundType === "solid"
      ? backgroundSolidColor ||
        backgroundValue ||
        preset.background.baseColor ||
        preset.background.value
      : backgroundType === "gradient"
        ? backgroundValue || preset.background.value
        : backgroundType === "pattern"
          ? backgroundSolidColor ||
            preset.background.baseColor ||
            backgroundValue ||
            preset.background.value
          : backgroundValue ||
            backgroundSolidColor ||
            preset.background.value ||
            preset.background.baseColor;

  const matches = sourceValue?.match(/#[0-9a-fA-F]{3,6}/g) || [];
  if (matches.length === 0) return false;

  const luminanceValues = matches
    .map((hex) => hexToRgb(hex))
    .filter((rgb): rgb is { r: number; g: number; b: number } => rgb !== null)
    .map(getLuminance);

  if (luminanceValues.length === 0) return false;
  const average =
    luminanceValues.reduce((sum, value) => sum + value, 0) /
    luminanceValues.length;
  return average < 0.4;
};

type PublicPageFooterProps = {
  accentColor: string;
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  backgroundSolidColor?: string;
  backgroundImageUrl?: string;
  preset: { background: { value: string; baseColor?: string } };
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

  const footerBaseIsDark = isDarkBackground({
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
    backgroundType === "image"
      ? footerTone === "dark"
        ? "rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur"
        : "rounded-full border border-slate-200/70 bg-white/85 px-4 py-2 backdrop-blur"
      : footerTone === "dark"
        ? "rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur"
        : "";

  return (
    <div
      className={cn(
        "mt-10 pt-8 text-center",
        footerTone === "dark"
          ? "border-t border-white/20"
          : "border-t border-white/30",
      )}
    >
      <p
        className={cn(
          "inline-flex items-center gap-1 text-sm",
          footerTone === "dark" ? "text-white/70" : "text-slate-600",
          footerPillClass,
        )}
      >
        Powered by{" "}
        <Link
          href={getBaseUrl() + "/"}
          className={cn(
            "font-semibold hover:underline",
            footerTone === "dark" ? "text-white" : "text-slate-900",
          )}
          style={footerTone === "dark" ? undefined : { color: accentColor }}
        >
          IndexFlow
        </Link>
      </p>
    </div>
  );
};

export default PublicPageFooter;
