"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { Eye } from "lucide-react";
import DesktopFloatingPreview from "@/components/dashboard/preview/DesktopFloatingPreview";
import type { DesktopPreviewState } from "@/components/dashboard/customization/shared";

type MobilePreviewActionState = {
  hasUnsavedChanges: boolean;
  onOpen: () => void;
  triggerStyle?: CSSProperties;
} | null;

type CustomizationPreviewContextValue = {
  mobilePreviewAction: MobilePreviewActionState;
  previewState: DesktopPreviewState | null;
  setMobilePreviewAction: (state: MobilePreviewActionState) => void;
  setPreviewState: (state: DesktopPreviewState | null) => void;
};

const CustomizationPreviewContext =
  createContext<CustomizationPreviewContextValue | null>(null);

const useCustomizationPreviewContext = () =>
  useContext(CustomizationPreviewContext);

const useRequiredCustomizationPreviewContext = (
  consumerName: string,
): CustomizationPreviewContextValue => {
  const context = useCustomizationPreviewContext();

  if (!context) {
    throw new Error(
      `${consumerName} must be rendered within CustomizationPreviewProvider.`,
    );
  }

  return context;
};

const CustomizationPreviewProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [previewState, setPreviewState] = useState<DesktopPreviewState | null>(
    null,
  );
  const [mobilePreviewAction, setMobilePreviewActionState] =
    useState<MobilePreviewActionState>(null);

  const setMobilePreviewAction = useCallback(
    (state: MobilePreviewActionState) => {
      setMobilePreviewActionState(state);
    },
    [],
  );

  const value = useMemo(
    () => ({
      mobilePreviewAction,
      previewState,
      setMobilePreviewAction,
      setPreviewState,
    }),
    [mobilePreviewAction, previewState, setMobilePreviewAction],
  );

  return (
    <CustomizationPreviewContext.Provider value={value}>
      {children}
    </CustomizationPreviewContext.Provider>
  );
};

const CustomizationDesktopPreviewRail = () => {
  const { previewState } = useRequiredCustomizationPreviewContext(
    "CustomizationDesktopPreviewRail",
  );

  return (
    <div className="space-y-4">
      <div className="px-1">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
          <Eye className="size-3.5" />
          <span>Live preview</span>
        </div>
      </div>
      {previewState ? (
        <DesktopFloatingPreview
          previewBackgroundStyle={previewState.previewBackgroundStyle}
          fontFamily={previewState.fontFamily}
          contentProps={previewState.contentProps}
        />
      ) : (
        <div className="hidden rounded-4xl border border-slate-200/80 bg-slate-50/90 p-6 text-sm text-slate-500 xl:block">
          Loading preview
        </div>
      )}
    </div>
  );
};

export {
  CustomizationDesktopPreviewRail,
  CustomizationPreviewProvider,
  useCustomizationPreviewContext,
};
