"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DownloadFormat = "svg" | "png" | "jpg";

type ProfileQrCardProps = {
  username: string;
  profileUrl: string;
  accentColor: string;
  title?: string;
  description?: string;
  className?: string;
};

const qrCanvasSize = 1024;
const exportWidth = 1200;
const exportHeight = 1520;
const qrOutputSize = 820;
const qrOffsetX = (exportWidth - qrOutputSize) / 2;
const qrOffsetY = 250;

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load QR image"));
    image.src = src;
  });

const buildFileName = (username: string, format: DownloadFormat) =>
  `${username}-qr-code.${format}`;

const ProfileQrCard = ({
  username,
  profileUrl,
  accentColor,
  title = "Share this profile",
  description,
  className,
}: ProfileQrCardProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [activeFormat, setActiveFormat] = useState<DownloadFormat | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const titleId = useId();
  const cardDescription = description || `Scan to open ${username}'s link hub`;

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isDropdownOpen]);

  const exportRaster = async (format: "png" | "jpg") => {
    const sourceCanvas = canvasRef.current;

    if (!sourceCanvas) {
      throw new Error("QR canvas is not ready yet");
    }

    const sourceImage = await loadImage(sourceCanvas.toDataURL("image/png"));
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;

    const context = exportCanvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas export is not available");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, exportWidth, exportHeight);

    context.fillStyle = "#0f172a";
    context.font =
      "700 76px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    context.textAlign = "center";
    context.fillText(`@${username}`, exportWidth / 2, 140);

    context.strokeStyle = "#e2e8f0";
    context.lineWidth = 14;
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.roundRect(
      qrOffsetX - 26,
      qrOffsetY - 26,
      qrOutputSize + 52,
      qrOutputSize + 52,
      48,
    );
    context.fill();
    context.stroke();

    context.drawImage(
      sourceImage,
      0,
      0,
      qrCanvasSize,
      qrCanvasSize,
      qrOffsetX,
      qrOffsetY,
      qrOutputSize,
      qrOutputSize,
    );

    context.fillStyle = "#475569";
    context.font =
      "500 34px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    context.fillText("Scan to open this profile", exportWidth / 2, 1160);

    context.fillStyle = "#64748b";
    context.font =
      "500 28px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    context.fillText(profileUrl, exportWidth / 2, 1240);

    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const dataUrl = exportCanvas.toDataURL(mimeType, 0.92);
    const blob = await (await fetch(dataUrl)).blob();

    downloadBlob(blob, buildFileName(username, format));
  };

  const exportSvg = async () => {
    const sourceSvg = svgRef.current;

    if (!sourceSvg) {
      throw new Error("QR SVG is not ready yet");
    }

    const serializer = new XMLSerializer();
    const svgClone = sourceSvg.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute("x", String(qrOffsetX));
    svgClone.setAttribute("y", String(qrOffsetY));
    svgClone.setAttribute("width", String(qrOutputSize));
    svgClone.setAttribute("height", String(qrOutputSize));
    const qrMarkup = serializer.serializeToString(svgClone);
    const svgMarkup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 ${exportWidth} ${exportHeight}">
  <rect width="${exportWidth}" height="${exportHeight}" fill="#ffffff" />
  <text x="${exportWidth / 2}" y="140" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="76" font-weight="700" fill="#0f172a">@${username}</text>
  <rect x="${qrOffsetX - 26}" y="${qrOffsetY - 26}" width="${qrOutputSize + 52}" height="${qrOutputSize + 52}" rx="48" fill="#ffffff" stroke="#e2e8f0" stroke-width="14" />
  ${qrMarkup}
  <text x="${exportWidth / 2}" y="1160" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="34" font-weight="500" fill="#475569">Scan to open this profile</text>
  <text x="${exportWidth / 2}" y="1240" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="28" font-weight="500" fill="#64748b">${profileUrl}</text>
</svg>`;

    const blob = new Blob([svgMarkup], {
      type: "image/svg+xml;charset=utf-8",
    });

    downloadBlob(blob, buildFileName(username, "svg"));
  };

  const handleDownload = async (format: DownloadFormat) => {
    try {
      setActiveFormat(format);
      setIsDropdownOpen(false);

      if (format === "svg") {
        await exportSvg();
      } else {
        await exportRaster(format);
      }

      toast.success(`Downloaded QR code as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(error);
      toast.error("Could not download the QR code");
    } finally {
      setActiveFormat(null);
    }
  };

  return (
    <div
      className={cn(
        "w-full rounded-3xl border border-white/40 bg-white/85 p-6 text-center shadow-2xl shadow-slate-900/10 backdrop-blur-xl",
        className,
      )}
    >
      <div aria-labelledby={titleId}>
        <p id={titleId} className="text-sm font-semibold text-slate-700">
          {title}
        </p>
        <p className="mt-1 text-xs text-slate-500">{cardDescription}</p>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="rounded-2xl bg-white/90 p-4 shadow-inner">
          <QRCodeSVG
            ref={svgRef}
            value={profileUrl}
            size={180}
            marginSize={4}
            includeMargin
          />
          <QRCodeCanvas
            ref={canvasRef}
            value={profileUrl}
            size={qrCanvasSize}
            marginSize={4}
            includeMargin
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-3 rounded-full bg-slate-100/80 px-4 py-2 text-xs text-slate-600">
        {profileUrl}
      </div>

      <div ref={dropdownRef} className="relative mt-4 flex justify-center">
        <Button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          disabled={activeFormat !== null}
          className="min-w-36 text-white"
          aria-haspopup="menu"
          aria-expanded={isDropdownOpen}
          style={{ backgroundColor: accentColor, borderColor: accentColor }}
        >
          <Download className="size-4" />
          {activeFormat
            ? `Exporting ${activeFormat.toUpperCase()}...`
            : "Download QR"}
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              isDropdownOpen && "rotate-180",
            )}
          />
        </Button>

        {isDropdownOpen && (
          <div
            role="menu"
            className="absolute top-full z-20 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-lg"
          >
            {(["svg", "png", "jpg"] as const).map((format) => (
              <button
                key={format}
                type="button"
                role="menuitem"
                onClick={() => void handleDownload(format)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 uppercase transition hover:bg-slate-50"
              >
                <span>{format}</span>
                <Download className="size-4 text-slate-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileQrCard;
