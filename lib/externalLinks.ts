const ABSOLUTE_URL_SCHEME_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
const ALLOWED_EXTERNAL_PROTOCOLS = new Set(["http:", "https:"]);

const addDefaultProtocol = (value: string) => {
  if (ABSOLUTE_URL_SCHEME_REGEX.test(value)) {
    return value;
  }

  return `https://${value}`;
};

export const normalizeExternalUrl = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    const normalizedUrl = new URL(addDefaultProtocol(trimmedValue));

    if (!ALLOWED_EXTERNAL_PROTOCOLS.has(normalizedUrl.protocol)) {
      return null;
    }

    return normalizedUrl.toString();
  } catch {
    return null;
  }
};

export const isSafeExternalUrl = (value: string) =>
  normalizeExternalUrl(value) !== null;
