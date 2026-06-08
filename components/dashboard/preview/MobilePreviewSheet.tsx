"use client";

import { useCallback, useEffect, type CSSProperties } from "react";
import DashboardPreviewContent, {
  type DashboardPreviewContentProps,
} from "@/components/dashboard/preview/DashboardPreviewContent";
import { useCustomizationPreviewContext } from "@/components/dashboard/customization/CustomizationPreviewContext";
import { DashboardDevicePreviewFrame } from "@/components/dashboard/preview/shared";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type MobilePreviewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewBackgroundStyle: CSSProperties;
  fontFamily: string;
  contentProps: DashboardPreviewContentProps;
  triggerStyle?: CSSProperties;
  hasUnsavedChanges: boolean;
};

const MobilePreviewSheet = ({
  open,
  onOpenChange,
  previewBackgroundStyle,
  fontFamily,
  contentProps,
  triggerStyle,
  hasUnsavedChanges,
}: MobilePreviewSheetProps) => {
  const previewContext = useCustomizationPreviewContext();
  const setMobilePreviewAction = previewContext?.setMobilePreviewAction;
  const handleOpenPreview = useCallback(() => {
    onOpenChange(true);
  }, [onOpenChange]);

  useEffect(() => {
    setMobilePreviewAction?.({
      hasUnsavedChanges,
      onOpen: handleOpenPreview,
      triggerStyle,
    });

    return () => {
      setMobilePreviewAction?.(null);
    };
  }, [
    handleOpenPreview,
    hasUnsavedChanges,
    setMobilePreviewAction,
    triggerStyle,
  ]);

  const mobilePhonePreviewStyle: CSSProperties = {
    width: "min(100%, 360px)",
    height: "auto",
    aspectRatio: "9 / 19.5",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[calc(100dvh-0.75rem)] max-h-[calc(100dvh-0.75rem)] gap-0 rounded-t-4xl border-x-0 border-b-0 p-0 sm:h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-1rem)] sm:rounded-t-[2.4rem]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Live preview</SheetTitle>
          <SheetDescription>Live preview</SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center justify-center px-6 pt-4 pb-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2 rounded-full bg-slate-300" />
              <span className="size-2 rounded-full bg-slate-300" />
              <span className="size-2 rounded-full bg-slate-300" />
            </div>
          </div>

          <div className="px-5 pb-4 sm:px-6">
            <p className="text-sm font-semibold text-slate-900">Live preview</p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6">
            <DashboardDevicePreviewFrame
              className="max-w-full rounded-[2.35rem] shadow-[0_28px_60px_-32px_rgba(15,23,42,0.9)]"
              viewportClassName="rounded-[1.75rem]"
              contentClassName="rounded-[1.75rem]"
              backgroundStyle={previewBackgroundStyle}
              fontFamily={fontFamily}
              style={mobilePhonePreviewStyle}
            >
              <DashboardPreviewContent {...contentProps} />
            </DashboardDevicePreviewFrame>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobilePreviewSheet;
