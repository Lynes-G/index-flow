import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/frontend/shared/utils";

type DashboardDevicePreviewFrameProps = {
  backgroundStyle: CSSProperties;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  fontFamily: string;
  maxHeight?: string;
  style?: CSSProperties;
  viewportClassName?: string;
};

const previewPhoneShellClassName =
  "mx-auto w-full h-full rounded-[2.35rem] bg-slate-950 p-[3px] shadow-[0_24px_60px_-30px_rgba(15,23,42,0.85)]";

const previewPhoneInnerFrameClassName =
  "h-full rounded-[2.05rem] bg-slate-900 p-[3px]";

const previewPhoneViewportClassName =
  "relative h-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-white";

const previewPhoneContentClassName =
  "h-full overflow-y-auto overscroll-contain rounded-[1.8rem] [scrollbar-width:thin] [scrollbar-color:rgba(100,116,139,0.55)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/70";

const DashboardDevicePreviewFrame = ({
  backgroundStyle,
  children,
  className,
  contentClassName,
  fontFamily,
  maxHeight,
  style,
  viewportClassName,
}: DashboardDevicePreviewFrameProps) => (
  <div className={cn(previewPhoneShellClassName, className)} style={style}>
    <div className={previewPhoneInnerFrameClassName}>
      <div className={cn(previewPhoneViewportClassName, viewportClassName)}>
        <div
          className={cn(previewPhoneContentClassName, contentClassName)}
          style={{
            ...(maxHeight ? { maxHeight } : null),
            ...backgroundStyle,
            fontFamily,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  </div>
);

export { DashboardDevicePreviewFrame };
