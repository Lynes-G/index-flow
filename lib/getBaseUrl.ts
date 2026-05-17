import { getAppUrl } from "@/lib/server/appUrl";

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;

  return getAppUrl();
}
