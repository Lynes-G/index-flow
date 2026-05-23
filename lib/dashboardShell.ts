export type DashboardTaskId =
  | "links"
  | "appearance"
  | "analytics"
  | "username"
  | "billing";

export type DashboardRailMode =
  | "preview-compact"
  | "preview-full"
  | "analytics-summary"
  | "username-summary"
  | "billing-summary";

export const dashboardTasks: Array<{
  id: DashboardTaskId;
  href: string;
  label: string;
}> = [
  { id: "links", href: "/dashboard", label: "Links" },
  { id: "appearance", href: "/dashboard/appearance", label: "Appearance" },
  { id: "analytics", href: "/dashboard/analytics", label: "Analytics" },
  { id: "username", href: "/dashboard/username", label: "Username" },
  { id: "billing", href: "/dashboard/billing", label: "Billing" },
];

export function getDashboardTaskFromPathname(pathname: string): DashboardTaskId {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/link/")) {
    return "links";
  }

  if (pathname.startsWith("/dashboard/appearance")) {
    return "appearance";
  }

  if (pathname.startsWith("/dashboard/analytics")) {
    return "analytics";
  }

  if (pathname.startsWith("/dashboard/username")) {
    return "username";
  }

  if (pathname.startsWith("/dashboard/billing")) {
    return "billing";
  }

  return "links";
}

export function getRailModeForTask(task: DashboardTaskId): DashboardRailMode {
  switch (task) {
    case "links":
      return "preview-compact";
    case "appearance":
      return "preview-full";
    case "analytics":
      return "analytics-summary";
    case "username":
      return "username-summary";
    case "billing":
      return "billing-summary";
  }
}
