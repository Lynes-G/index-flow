import type { Geo } from "@vercel/functions";
import type { NextRequest } from "next/server";
import { z } from "zod";
import type { ServerTrackingEvent } from "@/lib/types";

export const TRACKING_VISITOR_ID_COOKIE_NAME = "indexflow_visitor_id";
export const TRACKING_CONSENT_COOKIE_NAME = "indexflow_tracking_consent";
const TRACKING_VISITOR_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const TRACKING_CONSENT_GRANTED_VALUES = new Set([
  "1",
  "true",
  "granted",
  "yes",
]);
const KNOWN_BOT_USER_AGENT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /preview/i,
  /slurp/i,
  /facebookexternalhit/i,
  /linkedinbot/i,
  /twitterbot/i,
  /whatsapp/i,
];

const trackingEventSchema = z.object({
  profileUsername: z.string().trim().min(1).max(100),
  linkId: z.string().trim().min(1).max(128),
  eventType: z.literal("link_click").optional(),
  visitorId: z.string().trim().min(1).max(128).optional(),
});

export const validateTrackingEventPayload = (payload: unknown) =>
  trackingEventSchema.parse(payload);

export const getSafeGeolocation = async (
  resolveGeo: () => Geo | Promise<Geo>,
): Promise<Geo> => {
  try {
    return await resolveGeo();
  } catch {
    return {};
  }
};

export const buildTrackingRequestContext = (
  request: NextRequest,
  geo: Geo,
) => ({
  location: geo,
  userAgent: request.headers.get("user-agent") || "unknown",
  referrer: request.headers.get("referer") || "direct",
});

const getCookieValue = (request: NextRequest, cookieName: string) =>
  request.cookies?.get(cookieName)?.value?.trim() ||
  request.headers
    .get("cookie")
    ?.split("; ")
    .find((entry) => entry.startsWith(`${cookieName}=`))
    ?.split("=", 2)[1]
    ?.trim();

const decodeCookieValue = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const hasTrackingConsent = (request: NextRequest) => {
  const consentValue =
    request.headers.get("x-indexflow-tracking-consent")?.trim() ||
    getCookieValue(request, TRACKING_CONSENT_COOKIE_NAME);

  return TRACKING_CONSENT_GRANTED_VALUES.has(
    decodeCookieValue(consentValue ?? "").toLowerCase(),
  );
};

export const isKnownBotUserAgent = (userAgent: string | null | undefined) => {
  if (!userAgent?.trim()) {
    return false;
  }

  return KNOWN_BOT_USER_AGENT_PATTERNS.some((pattern) =>
    pattern.test(userAgent),
  );
};

export const getPrivacyAwareLocation = (
  geo: Geo,
  trackingConsentGranted: boolean,
): Geo => ({
  country: geo.country,
  city: trackingConsentGranted ? geo.city : undefined,
});

export const resolveTrackingVisitorId = (
  request: NextRequest,
  fallback?: string,
  options: { allowPersistentVisitorId?: boolean } = {},
) => {
  const allowPersistentVisitorId = options.allowPersistentVisitorId ?? true;
  const cookieVisitorId = allowPersistentVisitorId
    ? getCookieValue(request, TRACKING_VISITOR_ID_COOKIE_NAME)
    : null;
  const fallbackVisitorId = allowPersistentVisitorId ? fallback?.trim() : null;
  const visitorId = cookieVisitorId || fallbackVisitorId || crypto.randomUUID();

  return {
    visitorId,
    shouldSetCookie: allowPersistentVisitorId && cookieVisitorId !== visitorId,
  };
};

export const buildTrackingVisitorCookie = (visitorId: string) => ({
  name: TRACKING_VISITOR_ID_COOKIE_NAME,
  value: visitorId,
  httpOnly: false,
  maxAge: TRACKING_VISITOR_ID_MAX_AGE_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
});

const formatTinybirdTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString().slice(0, 19).replace("T", " ");
};

export const buildTinybirdTrackingEvent = (
  trackingEvent: ServerTrackingEvent,
) => ({
  timestamp: formatTinybirdTimestamp(trackingEvent.timestamp),
  profileUsername: trackingEvent.profileUsername,
  profileUserId: trackingEvent.profileUserId,
  visitorId: trackingEvent.visitorId,
  linkId: trackingEvent.linkId,
  linkTitle: trackingEvent.linkTitle,
  linkUrl: trackingEvent.linkUrl,
  eventType: trackingEvent.eventType,
  userAgent: trackingEvent.userAgent,
  referrer: trackingEvent.referrer,
  location: {
    country: trackingEvent.location.country || "unknown",
    city: trackingEvent.location.city || "unknown",
  },
});
