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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl?.trim()) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL");
  }

  const configuredUrl = normalizeConfiguredUrl(appUrl);

  if (!configuredUrl) {
    throw new Error("Invalid NEXT_PUBLIC_APP_URL");
  }

  return configuredUrl;
}
