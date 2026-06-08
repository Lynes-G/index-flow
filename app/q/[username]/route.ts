import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { api } from "@/convex/_generated/api";
import { getClient } from "@/convex/lib/client";
import type { ServerTrackingEvent } from "@/lib/types";
import {
  buildTrackingVisitorCookie,
  buildTinybirdTrackingEvent,
  buildTrackingRequestContext,
  getPrivacyAwareLocation,
  getSafeGeolocation,
  hasTrackingConsent,
  isKnownBotUserAgent,
  resolveTrackingVisitorId,
} from "@/lib/server/tracking";
import { sendTinybirdEventWithRetryBuffer } from "@/lib/server/tinybirdBuffer";
import { isTinybirdConfigured } from "@/lib/server/tinybird";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const profileUrl = new URL(`/u/${username}`, request.url);
  const response = NextResponse.redirect(profileUrl);

  if (isKnownBotUserAgent(request.headers.get("user-agent"))) {
    return response;
  }

  try {
    const convex = getClient();
    const userId = await convex.query(api.lib.usernames.getUserIdBySlug, {
      slug: username,
    });

    if (!userId) {
      return response;
    }

    const trackingConsentGranted = hasTrackingConsent(request);
    const geo = await getSafeGeolocation(() => geolocation(request));
    const { visitorId, shouldSetCookie } = resolveTrackingVisitorId(
      request,
      undefined,
      { allowPersistentVisitorId: trackingConsentGranted },
    );
    const requestContext = buildTrackingRequestContext(
      request,
      getPrivacyAwareLocation(geo, trackingConsentGranted),
    );

    if (shouldSetCookie) {
      response.cookies.set(buildTrackingVisitorCookie(visitorId));
    }

    if (isTinybirdConfigured()) {
      const trackingEvent: ServerTrackingEvent = {
        timestamp: new Date().toISOString(),
        profileUsername: username,
        profileUserId: userId,
        visitorId,
        linkId: "",
        linkTitle: "Profile QR",
        linkUrl: profileUrl.toString(),
        eventType: "qr_scan",
        ...requestContext,
      };

      await sendTinybirdEventWithRetryBuffer(
        buildTinybirdTrackingEvent(trackingEvent),
      );
    }

    return response;
  } catch (err) {
    console.error("QR tracking error:", err);
  }

  return response;
}
