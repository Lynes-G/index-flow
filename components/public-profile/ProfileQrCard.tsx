"use client";

import type { ComponentType, CSSProperties } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Share2,
} from "lucide-react";
import {
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getAccentForeground } from "@/lib/frontend/shared/accentColor";
import { cn } from "@/lib/frontend/shared/utils";

type DownloadFormat = "svg" | "png" | "jpg";

type ProfileQrCardProps = {
  username: string;
  profileUrl: string;
  accentColor: string;
  title?: string;
  description?: string;
  className?: string;
};

type SocialShareOption = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
};

const qrCanvasSize = 1024;
const exportWidth = 1200;
const exportHeight = 1520;
const qrOutputSize = 820;
const qrOffsetX = (exportWidth - qrOutputSize) / 2;
const qrOffsetY = 250;
const qrAccentButtonClassName = "focus-visible:ring-[var(--accent-ring)]";
const qrSectionEyebrowClassName =
  "text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase";
const downloadFormats = ["svg", "png", "jpg"] as const;
const sheetHandleDots = [0, 1, 2];

const mobilePrimaryShareButtonClassName = `${qrAccentButtonClassName} h-11 rounded-full`;
const sheetPrimaryShareButtonClassName = `${qrAccentButtonClassName} h-11 w-full rounded-full`;
const desktopDownloadButtonClassName = `${qrAccentButtonClassName} min-w-36`;

const copiedSecondaryButtonClassName =
  "border-[var(--accent-color)] text-[var(--accent-color)]";

const desktopCopyButtonClassName =
  "absolute top-1/2 right-1 size-8 -translate-y-1/2 rounded-full border-[var(--accent-color)] bg-white/90 p-0 text-[var(--accent-color)] shadow-none transition-all duration-300 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-color)] focus-visible:ring-[var(--accent-ring)]";

const desktopCopiedButtonClassName =
  "bg-[var(--accent-color)] text-[var(--accent-foreground)] shadow-[0_0_0_6px_var(--accent-soft)]";

const compactSocialShareLinkClassName =
  "public-qr-share-link rounded-full px-3 py-2 text-xs hover:-translate-y-0.5";

const sheetSocialShareLinkClassName =
  "public-qr-share-link rounded-[1.1rem] px-3 py-3 text-sm hover:bg-slate-50";

const getQrActionShadowColor = (accentColor: string) =>
  `color-mix(in srgb, ${accentColor} 68%, black)`;

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

const buildSocialShareOptions = ({
  profileUrl,
  shareMessage,
}: {
  profileUrl: string;
  shareMessage: string;
}): SocialShareOption[] => {
  const encodedUrl = encodeURIComponent(profileUrl);
  const encodedMessage = encodeURIComponent(shareMessage);

  return [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      icon: FaWhatsapp,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      icon: FaXTwitter,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FaFacebook,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: FaLinkedin,
    },
  ];
};

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
  const [activeFormat, setActiveFormat] = useState<DownloadFormat | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const titleId = useId();
  const cardDescription = description || `Scan to open ${username}'s link hub`;
  const accentForeground = getAccentForeground(accentColor);
  const accentShadow = getQrActionShadowColor(accentColor);
  const accentButtonStyle = {
    "--accent-color": accentColor,
    "--accent-foreground": accentForeground,
    "--accent-soft": `${accentColor}12`,
    "--accent-ring": `${accentColor}55`,
    "--accent-shadow": accentShadow,
  } as CSSProperties;
  const shareMessage = `Check out @${username} on IndexFlow`;
  const socialShareOptions = useMemo(
    () => buildSocialShareOptions({ profileUrl, shareMessage }),
    [profileUrl, shareMessage],
  );
  const supportsNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

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

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      toast.success("Profile URL copied to clipboard");
    } catch (error) {
      console.error(error);
      toast.error("Could not copy the profile URL");
    }
  };

  const handleNativeShare = async () => {
    if (!supportsNativeShare || isSharing) {
      setIsShareSheetOpen(true);
      return;
    }

    try {
      setIsSharing(true);
      await navigator.share({
        title: `@${username} on IndexFlow`,
        text: shareMessage,
        url: profileUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      if (error instanceof DOMException && error.name === "InvalidStateError") {
        setIsShareSheetOpen(true);
        return;
      }
      console.error(error);
      setIsShareSheetOpen(true);
      toast.error("Opened extra share options instead");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className={cn("w-full", className)} style={accentButtonStyle}>
      <div className="sm:hidden">
        <div className="public-qr-card public-qr-card-mobile p-4">
          <div aria-labelledby={titleId} className="text-left">
            <p id={titleId} className={qrSectionEyebrowClassName}>
              Share profile
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-900">
              Make this page easy to pass around
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Share with your phone, copy the link, or post it straight to
              social media.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2.5">
            <Button
              type="button"
              variant="accent"
              onClick={() => void handleNativeShare()}
              disabled={isSharing}
              className={mobilePrimaryShareButtonClassName}
            >
              <Share2 className="size-4" />
              {isSharing ? "Opening share..." : "Share profile"}
            </Button>

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsShareSheetOpen(true)}
                className="public-qr-secondary-button"
                style={accentButtonStyle}
              >
                <ExternalLink className="size-4" />
                More options
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleCopyUrl()}
                className={cn(
                  "public-qr-secondary-button",
                  isCopied && copiedSecondaryButtonClassName,
                )}
              >
                {isCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Link2 className="size-4" />
                )}
                {isCopied ? "Copied" : "Copy link"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "public-qr-card hidden rounded-3xl p-6 text-center sm:block",
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

        <div className="mt-4 grid grid-cols-2 gap-2">
          {socialShareOptions.map((option) => {
            const Icon = option.icon;

            return (
              <a
                key={option.label}
                href={option.href}
                target="_blank"
                rel="noreferrer"
                className={compactSocialShareLinkClassName}
              >
                <Icon className="size-3.5" />
                {option.label}
              </a>
            );
          })}
        </div>

        <div className="relative mt-3 rounded-full bg-slate-100/80 px-12 py-2 text-xs text-slate-600">
          <span className="block truncate text-center" title={profileUrl}>
            {profileUrl}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleCopyUrl()}
            className={cn(
              desktopCopyButtonClassName,
              isCopied && desktopCopiedButtonClassName,
            )}
            aria-label={isCopied ? "URL copied" : "Copy URL to clipboard"}
          >
            {isCopied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>

        <div className="mt-4 flex justify-center">
          <DropdownMenu
            modal={false}
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="accent"
                disabled={activeFormat !== null}
                className={desktopDownloadButtonClassName}
                aria-label="Download QR code"
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
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="center"
              className="w-44 border-slate-200/80"
            >
              {downloadFormats.map((format) => (
                <DropdownMenuItem
                  key={format}
                  onClick={() => void handleDownload(format)}
                  className="justify-between uppercase"
                >
                  <span>{format}</span>
                  <Download className="size-4 text-slate-400" />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Sheet open={isShareSheetOpen} onOpenChange={setIsShareSheetOpen}>
        <SheetContent
          side="bottom"
          className="h-auto max-h-[85dvh] gap-0 rounded-t-[2rem] border-x-0 border-b-0 px-5 pt-4 pb-6 sm:hidden"
          style={accentButtonStyle}
        >
          <div
            className="mx-auto mb-4 flex justify-center gap-1.5"
            aria-hidden="true"
          >
            {sheetHandleDots.map((dot) => (
              <span key={dot} className="size-2 rounded-full bg-slate-300" />
            ))}
          </div>
          <SheetHeader className="gap-1">
            <SheetTitle>Share @{username}</SheetTitle>
            <SheetDescription>
              Pick the fastest way to get your profile in front of people.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-5 space-y-5">
            {supportsNativeShare ? (
              <Button
                type="button"
                variant="accent"
                onClick={() => void handleNativeShare()}
                disabled={isSharing}
                className={sheetPrimaryShareButtonClassName}
              >
                <Share2 className="size-4" />
                {isSharing ? "Opening share..." : "Share to other apps"}
              </Button>
            ) : null}

            <div>
              <p className={qrSectionEyebrowClassName}>Social share</p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {socialShareOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <a
                      key={option.label}
                      href={option.href}
                      target="_blank"
                      rel="noreferrer"
                      className={sheetSocialShareLinkClassName}
                    >
                      <Icon className="size-4" />
                      {option.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <p className={qrSectionEyebrowClassName}>QR code</p>
              <div className="public-share-panel mt-3 p-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsQrVisible((current) => !current)}
                  className="public-qr-secondary-button w-full"
                >
                  <Download className="size-4" />
                  {isQrVisible ? "Hide QR code" : "Show QR code"}
                </Button>

                {isQrVisible ? (
                  <div className="mt-3 rounded-[1.15rem] bg-slate-50 px-3 py-4 text-center">
                    <div className="inline-flex rounded-[1.1rem] bg-white p-3 shadow-inner">
                      <QRCodeSVG
                        value={profileUrl}
                        size={176}
                        marginSize={4}
                        includeMargin
                      />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Best when someone nearby wants to scan your profile from
                      another device.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <p className={qrSectionEyebrowClassName}>Direct link</p>
              <div className="public-share-panel mt-3 p-3">
                <p className="truncate text-sm text-slate-600">{profileUrl}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleCopyUrl()}
                  className="public-qr-secondary-button mt-3 w-full"
                >
                  {isCopied ? (
                    <Check className="size-4 text-[var(--accent-color)]" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {isCopied ? "Copied to clipboard" : "Copy profile link"}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProfileQrCard;
