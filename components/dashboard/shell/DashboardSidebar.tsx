"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AtSign,
  BarChart3,
  ChevronRight,
  CreditCard,
  Link2,
  Palette,
  Smartphone,
} from "lucide-react";

import DashboardSetupChecklistCard from "@/components/dashboard/setup/DashboardSetupChecklistCard";
import { useCustomizationPreviewContext } from "@/components/dashboard/customization/CustomizationPreviewContext";
import { dashboardSurfaceClasses } from "@/components/dashboard/styles";
import {
  DASHBOARD_DEV_PREVIEW_PARAM,
  dashboardTasks,
  getDashboardTaskFromPathname,
  type DashboardTaskId,
  withDashboardDevPreview,
} from "@/lib/frontend/dashboard/dashboardShell";
import { cn } from "@/lib/frontend/shared/utils";

type DashboardSidebarProps = {
  currentTask?: DashboardTaskId;
};

type DashboardTaskLinkProps = {
  task: (typeof dashboardTasks)[number];
  isActive: boolean;
  href: string;
};

type MobilePreviewAction = {
  hasUnsavedChanges: boolean;
  onOpen: () => void;
  triggerStyle?: CSSProperties;
} | null;

const dashboardTaskIcons: Record<
  DashboardTaskId,
  ComponentType<{ className?: string }>
> = {
  links: Link2,
  appearance: Palette,
  analytics: BarChart3,
  username: AtSign,
  billing: CreditCard,
};

const getTaskInitial = (label: string) => label.slice(0, 1);

const getDesktopLinkClassName = (isActive: boolean) =>
  cn(
    "flex items-center justify-between gap-3 rounded-lg border-2 px-3 py-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none",
    isActive
      ? "border-brand-eggplant bg-brand-eggplant text-white shadow-brand-neon-md"
      : "border-transparent text-slate-600 hover:border-brand-eggplant hover:bg-white/90 hover:text-slate-900",
  );

const getDesktopBadgeClassName = (isActive: boolean) =>
  cn(
    "inline-flex size-7 items-center justify-center rounded-md border text-[11px] font-black",
    isActive
      ? "border-white/20 bg-white/12 text-white"
      : "border-slate-200 bg-white/80 text-slate-500",
  );

const getMobileLinkClassName = (isActive: boolean) =>
  cn(
    "flex min-h-11 shrink-0 items-center gap-1 rounded-lg border-2 px-2.5 py-2 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(255,251,239,0.9)] focus-visible:outline-none min-[360px]:gap-1.5 sm:px-3 sm:py-2.5",
    isActive
      ? "border-brand-eggplant bg-brand-eggplant text-white shadow-brand-neon-sm"
      : "border-transparent text-slate-600 hover:border-brand-eggplant hover:bg-white/85 hover:text-slate-900",
  );

const getMobileIconClassName = (isActive: boolean) =>
  cn(
    "inline-flex size-8 items-center justify-center rounded-md border transition-colors sm:size-9",
    isActive
      ? "border-white/15 bg-white/12 text-white"
      : "border-slate-200 bg-white/90 text-slate-500",
  );

const getMobileLabelClassName = (isActive: boolean) =>
  cn(
    "max-w-0 overflow-hidden whitespace-nowrap text-[11px] font-semibold tracking-[0.02em] opacity-0 transition-all duration-200 min-[390px]:text-xs",
    isActive
      ? "hidden min-[390px]:block min-[390px]:max-w-20 min-[390px]:opacity-100 sm:max-w-24"
      : "max-w-0",
  );

const getMobilePreviewButtonClassName = (hasUnsavedChanges: boolean) =>
  cn(
    "flex shrink-0 items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(255,251,239,0.9)] focus-visible:outline-none sm:px-3.5",
    hasUnsavedChanges
      ? "border-brand-eggplant bg-brand-eggplant text-white shadow-brand-neon-md"
      : "border-[color:color-mix(in_srgb,var(--brand-eggplant)_46%,white)] bg-white/96 text-slate-900 shadow-[4px_4px_0_color-mix(in_srgb,var(--brand-purple)_42%,transparent)]",
  );

const mobilePreviewDividerClassName =
  "mx-1 h-8 w-px shrink-0 bg-[linear-gradient(180deg,rgba(148,163,184,0),rgba(148,163,184,0.6),rgba(148,163,184,0))]";

const mobilePreviewIconClassName =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white shadow-[0_12px_24px_-14px_rgba(15,23,42,0.8)]";

const mobileScrollFadeClassName =
  "flex h-full w-full items-center justify-end bg-[linear-gradient(90deg,rgba(255,244,216,0),rgba(255,244,216,0.78)_40%,rgba(255,244,216,0.98)_100%)] pr-2 transition-opacity duration-200";

const inactivePreviewIconStyle = {
  background:
    "linear-gradient(135deg,var(--brand-eggplant),color-mix(in srgb,var(--brand-eggplant) 72%, white))",
};

const DashboardDesktopTaskLink = ({
  task,
  isActive,
  href,
}: DashboardTaskLinkProps) => (
  <Link
    href={href}
    aria-current={isActive ? "page" : undefined}
    className={getDesktopLinkClassName(isActive)}
  >
    <span>{task.label}</span>
    <span className={getDesktopBadgeClassName(isActive)}>
      {getTaskInitial(task.label)}
    </span>
  </Link>
);

const DashboardMobileTaskLink = ({
  task,
  isActive,
  href,
}: DashboardTaskLinkProps) => {
  const Icon = dashboardTaskIcons[task.id];

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={getMobileLinkClassName(isActive)}
    >
      <span className={getMobileIconClassName(isActive)}>
        <Icon className="size-3.5 sm:size-4" />
      </span>
      <span className={getMobileLabelClassName(isActive)}>{task.label}</span>
    </Link>
  );
};

const DashboardMobilePreviewAction = ({
  hasUnsavedChanges,
  onOpen,
  triggerStyle,
}: {
  hasUnsavedChanges: boolean;
  onOpen: () => void;
  triggerStyle?: CSSProperties;
}) => (
  <>
    <div aria-hidden="true" className={mobilePreviewDividerClassName} />
    <button
      type="button"
      onClick={onOpen}
      className={getMobilePreviewButtonClassName(hasUnsavedChanges)}
      aria-label="Open live preview"
    >
      <span
        className={cn(
          mobilePreviewIconClassName,
          hasUnsavedChanges && "ring-1 ring-white/15",
        )}
        style={hasUnsavedChanges ? triggerStyle : inactivePreviewIconStyle}
      >
        <Smartphone className="size-4" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "text-[10px] font-semibold tracking-[0.22em] uppercase",
            hasUnsavedChanges ? "text-white/72" : "text-slate-500",
          )}
        >
          Preview
        </span>
        <span className="text-sm leading-tight font-semibold">Live</span>
      </span>
      {hasUnsavedChanges ? (
        <span className="rounded-full bg-white/14 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
          Live
        </span>
      ) : null}
    </button>
  </>
);

const DashboardDesktopNav = ({
  activeTask,
  isDevPreviewEnabled,
}: {
  activeTask: DashboardTaskId;
  isDevPreviewEnabled: boolean;
}) => (
  <div className="relative hidden xl:block">
    <div className="space-y-4">
      <div className={dashboardSurfaceClasses.flatNavHeader}>
        <p className="text-brand-purple text-[11px] font-black tracking-[0.2em] uppercase">
          Workspace
        </p>
        <div className="mt-1.5">
          <p className="font-['Sora',sans-serif] text-lg font-black tracking-normal text-slate-900">
            IndexFlow
          </p>
          <p className="text-sm text-slate-600">Dashboard navigation</p>
        </div>
      </div>

      <div className="space-y-1">
        {dashboardTasks.map((task) => (
          <DashboardDesktopTaskLink
            key={task.id}
            task={task}
            href={withDashboardDevPreview(task.href, isDevPreviewEnabled)}
            isActive={task.id === activeTask}
          />
        ))}
      </div>
    </div>

    <div className="mt-5">
      <DashboardSetupChecklistCard />
    </div>
  </div>
);

const DashboardMobileDockContent = ({
  activeTask,
  isDevPreviewEnabled,
  mobilePreviewAction,
}: {
  activeTask: DashboardTaskId;
  isDevPreviewEnabled: boolean;
  mobilePreviewAction: MobilePreviewAction;
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const node = scrollRef.current;

    if (!node) {
      return;
    }

    const updateOverflowState = () => {
      const canScroll = node.scrollWidth > node.clientWidth + 8;
      const hasMoreRight =
        node.scrollLeft + node.clientWidth < node.scrollWidth - 8;

      setIsScrollable(canScroll);
      setShowScrollIndicator(canScroll && hasMoreRight);
    };

    updateOverflowState();

    const resizeObserver = new ResizeObserver(updateOverflowState);
    resizeObserver.observe(node);
    window.addEventListener("resize", updateOverflowState);
    node.addEventListener("scroll", updateOverflowState, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOverflowState);
      node.removeEventListener("scroll", updateOverflowState);
    };
  }, [mobilePreviewAction]);

  return (
    <div className="relative mx-auto max-w-full overflow-hidden rounded-lg">
      <div
        ref={scrollRef}
        className={`${dashboardSurfaceClasses.flatToolbar} pointer-events-auto flex w-fit max-w-full items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {dashboardTasks.map((task) => (
          <DashboardMobileTaskLink
            key={task.id}
            task={task}
            href={withDashboardDevPreview(task.href, isDevPreviewEnabled)}
            isActive={task.id === activeTask}
          />
        ))}

        {mobilePreviewAction ? (
          <DashboardMobilePreviewAction
            hasUnsavedChanges={mobilePreviewAction.hasUnsavedChanges}
            onOpen={mobilePreviewAction.onOpen}
            triggerStyle={mobilePreviewAction.triggerStyle}
          />
        ) : null}
      </div>

      {isScrollable ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex w-20 items-center justify-end rounded-r-[2rem]">
          <div
            className={cn(
              mobileScrollFadeClassName,
              showScrollIndicator ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="shadow-brand-neon-xs border-brand-eggplant rounded-md border bg-white/70 p-1 text-slate-500">
              <ChevronRight className="size-3.5" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const DashboardSidebar = ({ currentTask }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTask = currentTask ?? getDashboardTaskFromPathname(pathname);
  const isDevPreviewEnabled =
    searchParams.get(DASHBOARD_DEV_PREVIEW_PARAM) === "1";

  return (
    <nav
      aria-label="Dashboard sections"
      className={`${dashboardSurfaceClasses.flatCard} relative z-20`}
    >
      <DashboardDesktopNav
        activeTask={activeTask}
        isDevPreviewEnabled={isDevPreviewEnabled}
      />
    </nav>
  );
};

const DashboardMobileDock = ({ currentTask }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previewContext = useCustomizationPreviewContext();
  const activeTask = currentTask ?? getDashboardTaskFromPathname(pathname);
  const isDevPreviewEnabled =
    searchParams.get(DASHBOARD_DEV_PREVIEW_PARAM) === "1";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <nav
      aria-label="Dashboard sections"
      className="pointer-events-none fixed bottom-[max(env(safe-area-inset-bottom),0.75rem)] left-1/2 z-50 w-fit max-w-[calc(100vw_-_0.75rem)] -translate-x-1/2 sm:max-w-[calc(100vw_-_1rem)] xl:hidden"
    >
      <DashboardMobileDockContent
        activeTask={activeTask}
        isDevPreviewEnabled={isDevPreviewEnabled}
        mobilePreviewAction={previewContext?.mobilePreviewAction ?? null}
      />
    </nav>,
    document.body,
  );
};

export { DashboardMobileDock };
export default DashboardSidebar;
