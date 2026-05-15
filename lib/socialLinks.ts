import { normalizeExternalUrl } from "./externalLinks";

const normalizeWhatsAppUrl = (url: string) => {
  const digits = url.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
};

export const normalizeSocialUrl = (url: string, platform: string) => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return trimmedUrl;

  if (platform === "WhatsApp") {
    return normalizeWhatsAppUrl(trimmedUrl);
  }

  return normalizeExternalUrl(trimmedUrl) ?? "";
};
