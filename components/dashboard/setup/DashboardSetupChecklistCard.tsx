"use client";

import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Check, ChevronRight, Sparkles, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import { dashboardSurfaceClasses } from "@/components/dashboard/styles";
import { Button } from "@/components/ui/button";
import { getDashboardSetupAction } from "@/lib/frontend/dashboard/dashboardSetupChecklist";
import {
  createDashboardSetupChecklist,
  getDashboardSetupProgress,
} from "@/lib/frontend/dashboard/dashboardSetupChecklist";
import { cn } from "@/lib/frontend/shared/utils";

const progressRadius = 30;
const progressCircumference = 2 * Math.PI * progressRadius;
const dismissedStorageKeyPrefix = "indexflow-dashboard-setup-dismissed";
const flyoutOffset = 14;
const flyoutWidth = 320;

const loadingDotRows = [3, 3, 2];

const setupProgressRingClassName =
  "relative flex size-[72px] shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(243,232,255,0.5))]";

const setupBadgeClassName =
  "border-brand-eggplant bg-brand-accent-soft text-brand-accent-ink inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-black tracking-[0.18em] uppercase";

const setupCtaClassName =
  "shadow-brand-purple-sm border-brand-eggplant text-brand-eggplant mt-4 rounded-lg border-2 bg-[linear-gradient(135deg,var(--brand-accent),var(--brand-neon))] px-4 py-3 text-center text-xs font-black uppercase transition-transform duration-200 hover:-translate-y-0.5";

const flyoutClassName = `${dashboardSurfaceClasses.card} fixed z-[200] w-[20rem] p-4 backdrop-blur-sm`;

const getChecklistItemClassName = (isComplete: boolean) =>
  cn(
    "rounded-lg border px-3.5 py-3",
    isComplete
      ? "border-brand-eggplant bg-brand-accent-soft"
      : "border-brand-eggplant bg-white/88",
  );

const getChecklistItemIconClassName = (isComplete: boolean) =>
  cn(
    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border",
    isComplete
      ? "border-brand-eggplant bg-brand-accent text-brand-eggplant"
      : "border-brand-eggplant bg-white text-transparent",
  );

const DashboardSetupChecklistCard = () => {
  const { sessionId } = useAuth();
  const { user } = useUser();
  const customization = useQuery(
    api.lib.userCustomization.getUserCustomizations,
    user?.id ? { userId: user.id } : "skip",
  );
  const linkCount = useQuery(
    api.lib.links.getLinkCountByUserId,
    user?.id ? { userId: user.id } : "skip",
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [flyoutStyle, setFlyoutStyle] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const flyoutRef = useRef<HTMLDivElement | null>(null);

  const loading = customization === undefined || linkCount === undefined;

  const checklist = useMemo(() => {
    if (loading) {
      return [];
    }

    return createDashboardSetupChecklist({
      customization,
      linkCount,
    });
  }, [customization, linkCount, loading]);

  const progress = useMemo(
    () => getDashboardSetupProgress(checklist),
    [checklist],
  );
  const nextStep = progress.remainingItems[0] ?? null;
  const nextAction = nextStep ? getDashboardSetupAction(nextStep.key) : null;
  const progressSignature = `${progress.completedCount}-${progress.totalCount}`;
  const strokeDashoffset =
    progressCircumference -
    (progress.progressPercent / 100) * progressCircumference;
  const dismissStorageKey = user
    ? `${dismissedStorageKeyPrefix}:${user.id}:${sessionId ?? "no-session"}:${progressSignature}`
    : null;

  useEffect(() => {
    if (!dismissStorageKey || typeof window === "undefined") {
      return;
    }

    setIsDismissed(window.sessionStorage.getItem(dismissStorageKey) === "true");
  }, [dismissStorageKey]);

  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isExpanded || typeof window === "undefined") {
      return;
    }

    const updateFlyoutPosition = () => {
      const cardElement = cardRef.current;

      if (!cardElement) {
        return;
      }

      const rect = cardElement.getBoundingClientRect();
      const maxLeft = Math.max(16, window.innerWidth - flyoutWidth - 16);
      const nextLeft = Math.min(rect.right + flyoutOffset, maxLeft);
      const nextTop = Math.min(
        Math.max(16, rect.top),
        Math.max(16, window.innerHeight - 520),
      );

      setFlyoutStyle({
        top: nextTop,
        left: nextLeft,
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        cardRef.current?.contains(target) ||
        flyoutRef.current?.contains(target)
      ) {
        return;
      }

      setIsExpanded(false);
    };

    updateFlyoutPosition();
    window.addEventListener("resize", updateFlyoutPosition);
    window.addEventListener("scroll", updateFlyoutPosition, true);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", updateFlyoutPosition);
      window.removeEventListener("scroll", updateFlyoutPosition, true);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isExpanded]);

  const dismissChecklist = () => {
    if (dismissStorageKey && typeof window !== "undefined") {
      window.sessionStorage.setItem(dismissStorageKey, "true");
    }

    setIsExpanded(false);
    setIsDismissed(true);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <section className={`${dashboardSurfaceClasses.card} p-4`}>
        <div className="flex items-center gap-3">
          <div className="size-18 animate-pulse rounded-lg border border-slate-300 bg-slate-200" />
          <div className="min-w-0 flex-1 space-y-2" aria-hidden="true">
            {loadingDotRows.map((dotCount, rowIndex) => (
              <div key={rowIndex} className="flex gap-1.5">
                {Array.from({ length: dotCount }).map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={cn(
                      "animate-pulse rounded-full bg-slate-200",
                      rowIndex === 1 ? "size-3" : "size-2.5",
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          className="mt-4 flex h-11 animate-pulse items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-200"
          aria-hidden="true"
        >
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
        </div>
      </section>
    );
  }

  if (progress.progressPercent >= 100 || isDismissed) {
    return null;
  }

  const flyout =
    isExpanded && isMounted && flyoutStyle
      ? createPortal(
          <div ref={flyoutRef} className={flyoutClassName} style={flyoutStyle}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                  Setup steps
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  Finish the remaining basics
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setIsExpanded(false)}
                variant="outline"
                size="icon-sm"
                className="rounded-md"
                aria-label="Close setup checklist"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.key}
                  className={getChecklistItemClassName(item.complete)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={getChecklistItemIconClassName(item.complete)}
                    >
                      <Check className="size-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              {nextAction ? (
                <div className="space-y-2.5">
                  <Button
                    asChild
                    size="action"
                    className="w-full font-black uppercase"
                  >
                    <Link href={nextAction.href}>
                      {nextAction.label}
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    onClick={dismissChecklist}
                    variant="secondary"
                    size="action"
                    className="w-full font-black uppercase"
                  >
                    Dismiss for now
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-3.5 py-3 text-sm font-semibold text-emerald-950">
                  Core setup is done. Next, share your page and watch analytics.
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <section
        ref={cardRef}
        className={`${dashboardSurfaceClasses.card} relative overflow-visible p-4`}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          aria-expanded={isExpanded}
          aria-label="Open setup checklist details"
          className="focus-visible:ring-brand-accent block w-full text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3">
            <div className={setupProgressRingClassName}>
              <svg
                viewBox="0 0 72 72"
                className="size-[72px] -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="36"
                  cy="36"
                  r={progressRadius}
                  className="fill-none stroke-[#e7def8]"
                  strokeWidth="6"
                />
                <circle
                  cx="36"
                  cy="36"
                  r={progressRadius}
                  className="fill-none stroke-[url(#setup-checklist-gradient)] transition-[stroke-dashoffset] duration-300"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={progressCircumference}
                  strokeDashoffset={strokeDashoffset}
                />
                <defs>
                  <linearGradient
                    id="setup-checklist-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="var(--brand-accent)" />
                    <stop offset="58%" stopColor="var(--brand-neon)" />
                    <stop offset="100%" stopColor="var(--brand-purple)" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-brand-eggplant absolute text-sm font-semibold">
                {progress.progressPercent}%
              </span>
            </div>

            <div className="min-w-0">
              <div className={setupBadgeClassName}>
                <Sparkles className="size-3" />
                Setup
              </div>
              <p className="mt-2 text-base leading-5 font-semibold text-slate-900">
                Checklist
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {progress.completedCount} of {progress.totalCount} complete
              </p>
            </div>
          </div>

          <div className={setupCtaClassName}>Finish setup</div>
        </button>
      </section>
      {flyout}
    </>
  );
};

export default DashboardSetupChecklistCard;
