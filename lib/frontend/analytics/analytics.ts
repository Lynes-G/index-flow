import { ClientTrackingData } from "@/lib/types";

const VISITOR_ID_STORAGE_KEY = "indexflow_visitor_id";
const VISITOR_ID_COOKIE_NAME = "indexflow_visitor_id";
const TRACKING_CONSENT_COOKIE_NAME = "indexflow_tracking_consent";
const VISITOR_ID_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const TRACKING_CONSENT_GRANTED_VALUES = new Set([
  "1",
  "true",
  "granted",
  "yes",
]);

const persistVisitorId = (visitorId: string) => {
  try {
    window.localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
  } catch {
    // Ignore storage failures so analytics never block navigation.
  }

  document.cookie = [
    `${VISITOR_ID_COOKIE_NAME}=${encodeURIComponent(visitorId)}`,
    "Path=/",
    `Max-Age=${VISITOR_ID_COOKIE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    location.protocol === "https:" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
};

const getCookieValue = (cookieName: string) => {
  const cookieEntry = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${cookieName}=`));

  if (!cookieEntry) {
    return null;
  }

  const [, rawValue = ""] = cookieEntry.split("=", 2);

  return rawValue ? decodeURIComponent(rawValue) : null;
};

const hasTrackingConsent = () => {
  const consentValue = getCookieValue(TRACKING_CONSENT_COOKIE_NAME);

  return TRACKING_CONSENT_GRANTED_VALUES.has(
    (consentValue ?? "").trim().toLowerCase(),
  );
};

const getVisitorId = () => {
  const localStorageVisitorId = (() => {
    try {
      return window.localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    } catch {
      return null;
    }
  })();

  const existingVisitorId =
    localStorageVisitorId || getCookieValue(VISITOR_ID_COOKIE_NAME);

  if (existingVisitorId) {
    persistVisitorId(existingVisitorId);
    return existingVisitorId;
  }

  const generatedVisitorId = crypto.randomUUID();
  persistVisitorId(generatedVisitorId);
  return generatedVisitorId;
};

const trackProfileEvent = async (event: ClientTrackingData) => {
  try {
    const trackingConsentGranted = hasTrackingConsent();
    const trackingData = {
      profileUsername: event.profileUsername,
      linkId: event.linkId,
      eventType: event.eventType || "link_click",
      visitorId: trackingConsentGranted
        ? event.visitorId || getVisitorId()
        : undefined,
    };

    await fetch("/api/track-click", {
      method: "POST",
      cache: "no-store",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "x-indexflow-tracking-consent": trackingConsentGranted
          ? "granted"
          : "denied",
      },
      body: JSON.stringify(trackingData),
    });

    return trackingData;
  } catch (err) {
    console.error("Failed to track analytics event:", err);
  }
};

const trackLinkClick = (event: ClientTrackingData) =>
  trackProfileEvent({ ...event, eventType: "link_click" });

const trackProfileView = (profileUsername: string) =>
  trackProfileEvent({ profileUsername, eventType: "profile_view" });

export { trackLinkClick, trackProfileView };
