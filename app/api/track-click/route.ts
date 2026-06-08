import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { api } from "@/convex/_generated/api";
import { ServerTrackingEvent, ClientTrackingData } from "@/lib/types";
import { getClient } from "@/convex/lib/client";
import {
  buildRateLimitHeaders,
  createMemoryRateLimiter,
  getRateLimitKey,
} from "@/lib/server/rateLimit";
import {
  buildTrackingVisitorCookie,
  buildTinybirdTrackingEvent,
  buildTrackingRequestContext,
  getPrivacyAwareLocation,
  getSafeGeolocation,
  hasTrackingConsent,
  isKnownBotUserAgent,
  resolveTrackingVisitorId,
  validateTrackingEventPayload,
} from "@/lib/server/tracking";
import { sendTinybirdEventWithRetryBuffer } from "@/lib/server/tinybirdBuffer";
import { isTinybirdConfigured } from "@/lib/server/tinybird";

const perSecondTrackClickRateLimiter = createMemoryRateLimiter({
  maxRequests: Number(process.env.RATE_LIMIT_TRACK_CLICK_PER_SECOND_MAX ?? 10),
  windowMs: 1000,
});
const hourlyTrackClickRateLimiter = createMemoryRateLimiter({
  maxRequests: Number(process.env.RATE_LIMIT_TRACK_CLICK_HOURLY_MAX ?? 1000),
  windowMs: 60 * 60 * 1000,
});

const createTrackingResponse = (
  body: Record<string, string | boolean>,
  rateLimitHeaders: Record<string, string>,
  status = 200,
) =>
  NextResponse.json(body, {
    status,
    headers: {
      ...rateLimitHeaders,
      "Cache-Control": "no-store",
    },
  });

const checkTrackClickRateLimit = (request: NextRequest) => {
  const rateLimitKey = getRateLimitKey({
    request,
    prefix: "track-click",
  });
  const perSecondResult = perSecondTrackClickRateLimiter.check(rateLimitKey);

  if (!perSecondResult.allowed) {
    return perSecondResult;
  }

  return hourlyTrackClickRateLimiter.check(rateLimitKey);
};

export async function POST(request: NextRequest) {
  const rateLimitResult = checkTrackClickRateLimit(request);
  const rateLimitHeaders = buildRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return createTrackingResponse(
      { error: "Too many requests" },
      rateLimitHeaders,
      429,
    );
  }

  try {
    if (isKnownBotUserAgent(request.headers.get("user-agent"))) {
      return createTrackingResponse({ success: true }, rateLimitHeaders);
    }

    let data: ClientTrackingData;
    try {
      data = validateTrackingEventPayload(await request.json());
    } catch {
      return createTrackingResponse(
        { error: "Invalid tracking payload" },
        rateLimitHeaders,
        400,
      );
    }

    const convex = getClient();

    const userId = await convex.query(api.lib.usernames.getUserIdBySlug, {
      slug: data.profileUsername,
    });

    if (!userId) {
      return createTrackingResponse(
        { error: "User not found" },
        rateLimitHeaders,
        404,
      );
    }

    const eventType = data.eventType ?? "link_click";
    const link =
      eventType === "link_click"
        ? await convex.query(api.lib.links.getTrackableLink, {
            userId,
            linkId: data.linkId!,
          })
        : {
            title: "Profile View",
            url: new URL(`/u/${data.profileUsername}`, request.url).toString(),
          };

    if (!link) {
      return createTrackingResponse(
        { error: "Link not found" },
        rateLimitHeaders,
        404,
      );
    }

    // Consent handling: without an explicit consent signal, tracking stays
    // anonymous per request and keeps only country-level location data.
    const trackingConsentGranted = hasTrackingConsent(request);
    const geo = await getSafeGeolocation(() => geolocation(request));
    const { visitorId, shouldSetCookie } = resolveTrackingVisitorId(
      request,
      data.visitorId,
      { allowPersistentVisitorId: trackingConsentGranted },
    );
    const requestContext = buildTrackingRequestContext(
      request,
      getPrivacyAwareLocation(geo, trackingConsentGranted),
    );
    const trackingEvent: ServerTrackingEvent = {
      ...data,
      eventType,
      linkId: data.linkId ?? "",
      linkTitle: link.title,
      linkUrl: link.url,
      timestamp: new Date().toISOString(),
      profileUserId: userId,
      visitorId,
      ...requestContext,
    };

    if (isTinybirdConfigured()) {
      await sendTinybirdEventWithRetryBuffer(
        buildTinybirdTrackingEvent(trackingEvent),
      );
    } else {
      console.warn("Tinybird configuration missing, skipping event send.");
    }

    const response = createTrackingResponse(
      { success: true },
      rateLimitHeaders,
    );

    if (shouldSetCookie) {
      response.cookies.set(buildTrackingVisitorCookie(visitorId));
    }

    return response;
  } catch (err) {
    console.error("Error in track-link route:", err);
    return createTrackingResponse(
      { error: "Failed to track click" },
      rateLimitHeaders,
      500,
    );
  }
}
