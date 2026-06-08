import { isDashboardShellPath } from "@/lib/frontend/dashboard/dashboardShell";

export function isLocalHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]"
  );
}

export function searchParamsFromObject(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const normalizedSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        normalizedSearchParams.append(key, item);
      }

      continue;
    }

    normalizedSearchParams.set(key, value);
  }

  return normalizedSearchParams;
}

export function getHostnameFromHostHeader(hostHeader: string | null) {
  if (!hostHeader) {
    return "";
  }

  try {
    return new URL(`http://${hostHeader}`).hostname;
  } catch {
    return hostHeader.split(":")[0] ?? "";
  }
}

export function isDashboardDevPreviewBypass({
  hostname,
  pathname,
  searchParams,
  nodeEnv,
}: {
  hostname: string;
  pathname: string;
  searchParams: URLSearchParams;
  nodeEnv: string | undefined;
}) {
  return (
    nodeEnv === "development" &&
    isLocalHostname(hostname) &&
    isDashboardShellPath(pathname) &&
    searchParams.get("devPreview") === "1"
  );
}

export function isDashboardDevPreviewRequest({
  hostHeader,
  pathname,
  searchParams,
  nodeEnv,
}: {
  hostHeader: string | null;
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
  nodeEnv: string | undefined;
}) {
  return isDashboardDevPreviewBypass({
    hostname: getHostnameFromHostHeader(hostHeader),
    pathname,
    searchParams: searchParamsFromObject(searchParams),
    nodeEnv,
  });
}
