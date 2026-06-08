export type DashboardTaskId =
  | "links"
  | "appearance"
  | "analytics"
  | "username"
  | "billing";

export const dashboardTasks: Array<{
  id: DashboardTaskId;
  href: string;
  label: string;
}> = [
  { id: "links", href: "/dashboard", label: "Profile" },
  { id: "appearance", href: "/dashboard/appearance", label: "Appearance" },
  { id: "analytics", href: "/dashboard/analytics", label: "Analytics" },
  { id: "billing", href: "/dashboard/billing", label: "Billing" },
];

export const DASHBOARD_DEV_PREVIEW_PARAM = "devPreview";

function matchesDashboardSegment(pathname: string, segment: string): boolean {
  return pathname === segment || pathname.startsWith(`${segment}/`);
}

export function isDashboardShellPath(pathname: string): boolean {
  return (
    pathname === "/dashboard" ||
    matchesDashboardSegment(pathname, "/dashboard/appearance") ||
    matchesDashboardSegment(pathname, "/dashboard/analytics") ||
    matchesDashboardSegment(pathname, "/dashboard/username") ||
    matchesDashboardSegment(pathname, "/dashboard/billing")
  );
}

export function withDashboardDevPreview(
  href: string,
  isDevPreviewEnabled: boolean,
): string {
  if (!isDevPreviewEnabled) {
    return href;
  }

  const url = new URL(href, "https://indexflow.local");
  url.searchParams.set(DASHBOARD_DEV_PREVIEW_PARAM, "1");

  return `${url.pathname}${url.search}${url.hash}`;
}

export function getDashboardTaskFromPathname(
  pathname: string,
): DashboardTaskId {
  if (
    pathname === "/dashboard" ||
    matchesDashboardSegment(pathname, "/dashboard/link")
  ) {
    return "links";
  }

  if (matchesDashboardSegment(pathname, "/dashboard/appearance")) {
    return "appearance";
  }

  if (matchesDashboardSegment(pathname, "/dashboard/analytics")) {
    return "analytics";
  }

  if (matchesDashboardSegment(pathname, "/dashboard/username")) {
    return "username";
  }

  if (matchesDashboardSegment(pathname, "/dashboard/billing")) {
    return "billing";
  }

  return "links";
}
