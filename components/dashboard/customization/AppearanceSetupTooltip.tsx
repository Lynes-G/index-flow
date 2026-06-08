"use client";

import { useEffect, useRef, useState } from "react";
import { CircleHelp, Eye, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type AppearanceSetupTooltipProps = {
  title: string;
  description: string;
  steps: Array<{
    key: string;
    title: string;
    description: string;
  }>;
  primaryAction?: {
    label: string;
    onClick: () => void;
  } | null;
  showMobilePreviewAction: boolean;
  onOpenMobilePreview: () => void;
};

const setupTooltipShellClassName =
  "relative rounded-lg border border-slate-200/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(255,251,239,0.95))] p-4 shadow-[0_18px_38px_rgba(15,23,42,0.06)]";

const setupTooltipPopoverClassName =
  "absolute top-[calc(100%+0.75rem)] right-0 left-0 z-20 rounded-lg border border-slate-200/80 bg-white/98 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur sm:left-auto sm:w-[28rem]";

const setupStepCardClassName =
  "rounded-lg border border-slate-200/80 bg-slate-50/70 p-3.5";

const setupReminderClassName =
  "mt-4 rounded-lg border border-slate-200/80 bg-slate-50/90 p-3.5 text-sm leading-6 text-slate-600";

const AppearanceSetupTooltip = ({
  title,
  description,
  steps,
  primaryAction,
  showMobilePreviewAction,
  onOpenMobilePreview,
}: AppearanceSetupTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={setupTooltipShellClassName}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
            Appearance setup
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>
        </div>

        <Button
          type="button"
          aria-expanded={isOpen}
          aria-label="Open appearance setup tips"
          onClick={() => setIsOpen((current) => !current)}
          variant="soft"
          size="icon"
          className="rounded-full"
        >
          <CircleHelp className="size-4" />
        </Button>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Tap the help icon for the remaining setup tips.
      </p>

      {isOpen ? (
        <div className={setupTooltipPopoverClassName}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                Appearance setup
              </p>
              <h2 className="mt-1 font-['Sora',sans-serif] text-lg font-semibold tracking-[-0.03em] text-slate-900">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close appearance setup tips"
              variant="soft"
              size="icon-sm"
              className="rounded-full"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <div key={step.key} className={setupStepCardClassName}>
                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={setupReminderClassName}>
            Start simple: add a short bio, a recognizable profile photo, and one
            visual direction before tweaking smaller design details.
          </div>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {primaryAction ? (
              <Button
                type="button"
                onClick={() => {
                  primaryAction.onClick();
                  setIsOpen(false);
                }}
                size="action"
              >
                {primaryAction.label}
                <Sparkles className="size-4" />
              </Button>
            ) : null}

            {showMobilePreviewAction ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenMobilePreview();
                  setIsOpen(false);
                }}
                size="action"
              >
                Open mobile preview
                <Eye className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AppearanceSetupTooltip;
