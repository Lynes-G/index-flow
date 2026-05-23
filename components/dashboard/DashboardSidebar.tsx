"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  dashboardTasks,
  getDashboardTaskFromPathname,
  type DashboardTaskId,
} from "@/lib/dashboardShell";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  currentTask?: DashboardTaskId;
};

const DashboardSidebar = ({ currentTask }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const activeTask = currentTask ?? getDashboardTaskFromPathname(pathname);

  return (
    <nav
      aria-label="Dashboard sections"
      className="sticky top-28 rounded-[1.75rem] border border-[color:color-mix(in_srgb,var(--brand-eggplant)_10%,white)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,250,240,0.92))] p-4 shadow-[0_18px_48px_rgba(59,21,42,0.08)]"
    >
      <div className="space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.24em] text-slate-500 uppercase">
          Your tasks
        </p>
        {dashboardTasks.map((task) => {
          const isActive = task.id === activeTask;

          return (
            <Link
              key={task.id}
              href={task.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none",
                isActive
                  ? "bg-slate-900 text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]"
                  : "text-slate-600 hover:bg-white/90 hover:text-slate-900",
              )}
            >
              <span>{task.label}</span>
              <span
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full border text-[11px] font-semibold",
                  isActive
                    ? "border-white/20 bg-white/12 text-white"
                    : "border-slate-200 bg-white/80 text-slate-500",
                )}
              >
                {task.label.slice(0, 1)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardSidebar;
