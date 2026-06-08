"use client";

import type { CSSProperties } from "react";
import DashboardPreviewContent, {
  type DashboardPreviewContentProps,
} from "@/components/dashboard/preview/DashboardPreviewContent";
import { DashboardDevicePreviewFrame } from "@/components/dashboard/preview/shared";

export const DESKTOP_PREVIEW_XL_MEDIA_QUERY = "(min-width: 1280px)";

// Adjust these two values if you want to make the desktop phone preview
// wider or taller later. Keeping both in one place makes the phone-frame
// proportion easy to tune without hunting through Tailwind classes.
const DESKTOP_PHONE_PREVIEW_SIZE = {
  widthPx: 344,
  heightPx: 740,
} as const;

// The preview sits inside a sticky rail that also includes a small heading card.
// On shorter laptop viewports, we scale the phone frame down so the whole rail
// still fits on screen instead of clipping the bottom edge.
const DESKTOP_PHONE_PREVIEW_VIEWPORT_PADDING_REM = 10;

type DesktopFloatingPreviewProps = {
  previewBackgroundStyle: CSSProperties;
  fontFamily: string;
  contentProps: DashboardPreviewContentProps;
};

const DesktopFloatingPreview = ({
  previewBackgroundStyle,
  fontFamily,
  contentProps,
}: DesktopFloatingPreviewProps) => {
  const responsiveHeight = `min(${DESKTOP_PHONE_PREVIEW_SIZE.heightPx}px, calc(100vh - ${DESKTOP_PHONE_PREVIEW_VIEWPORT_PADDING_REM}rem))`;

  return (
    <div className="hidden xl:block">
      <DashboardDevicePreviewFrame
        className="mx-auto w-full max-w-[344px]"
        backgroundStyle={previewBackgroundStyle}
        fontFamily={fontFamily}
        style={{
          width: `${DESKTOP_PHONE_PREVIEW_SIZE.widthPx}px`,
          height: responsiveHeight,
          maxHeight: `calc(100vh - ${DESKTOP_PHONE_PREVIEW_VIEWPORT_PADDING_REM}rem)`,
        }}
      >
        <DashboardPreviewContent {...contentProps} compact />
      </DashboardDevicePreviewFrame>
    </div>
  );
};

export default DesktopFloatingPreview;
