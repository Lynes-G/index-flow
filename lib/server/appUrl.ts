const LOCALHOST_APP_URL = "http://localhost:3000";

const normalizeConfiguredUrl = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const candidate = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
};

export function getAppUrl() {
  const configuredUrl =
    normalizeConfiguredUrl(process.env.NEXT_PUBLIC_APP_URL ?? "") ??
    normalizeConfiguredUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "") ??
    normalizeConfiguredUrl(process.env.VERCEL_URL ?? "");

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV !== "production") {
    return LOCALHOST_APP_URL;
  }

  throw new Error(
    "No valid app URL found. Set NEXT_PUBLIC_APP_URL for production deployments.",
  );
}
