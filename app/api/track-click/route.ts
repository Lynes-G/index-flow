import { after, NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { api } from "@/convex/_generated/api";
import { ServerTrackingEvent, ClientTrackingData } from "@/lib/types";
import { getClient } from "@/convex/lib/client";
import {
  buildRateLimitHeaders,
  createMemoryRateLimiter,
  getRateLimitKey,
} from "@/lib/server/rateLimit";
import { validateTrackingEventPayload } from "@/lib/server/tracking";
import { isTinybirdConfigured, sendTinybirdEvent } from "@/lib/server/tinybird";

const trackClickRateLimiter = createMemoryRateLimiter({
  maxRequests: Number(process.env.RATE_LIMIT_TRACK_CLICK_MAX ?? 120),
  windowMs: Number(process.env.RATE_LIMIT_TRACK_CLICK_WINDOW_MS ?? 60_000),
});

export async function POST(request: NextRequest) {
  const rateLimitResult = trackClickRateLimiter.check(
    getRateLimitKey({
      request,
      prefix: "track-click",
    }),
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          ...buildRateLimitHeaders(rateLimitResult),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  try {
    let data: ClientTrackingData;
    try {
      data = validateTrackingEventPayload(await request.json());
    } catch {
      return NextResponse.json(
        { error: "Invalid tracking payload" },
        {
          status: 400,
          headers: {
            ...buildRateLimitHeaders(rateLimitResult),
            "Cache-Control": "no-store",
          },
        },
      );
    }
    const geo = await geolocation(request);
    const convex = getClient();

    // Fetch user ID based on username
    const userId = await convex.query(api.lib.usernames.getUserIdBySlug, {
      slug: data.profileUsername,
    });

    if (!userId)
      return NextResponse.json(
        { error: "User not found" },
        {
          status: 404,
          headers: {
            ...buildRateLimitHeaders(rateLimitResult),
            "Cache-Control": "no-store",
          },
        },
      );
    const link = await convex.query(api.lib.links.getTrackableLink, {
      userId,
      linkId: data.linkId,
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        {
          status: 404,
          headers: {
            ...buildRateLimitHeaders(rateLimitResult),
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const trackingEvent: ServerTrackingEvent = {
      ...data,
      eventType: "link_click",
      linkTitle: link.title,
      linkUrl: link.url,

      timestamp: new Date().toISOString(),
      profileUserId: userId,
      location: {
        ...geo,
      },
      userAgent: request.headers.get("user-agent") || "unknown",
      referrer: request.headers.get("referer") || "direct",
    };

    if (isTinybirdConfigured()) {
      const eventForTinybird = {
        timestamp: trackingEvent.timestamp,
        profileUsername: trackingEvent.profileUsername,
        profileUserId: trackingEvent.profileUserId,
        linkId: trackingEvent.linkId,
        linkTitle: trackingEvent.linkTitle,
        linkUrl: trackingEvent.linkUrl,
        eventType: trackingEvent.eventType,
        userAgent: trackingEvent.userAgent,
        referrer: trackingEvent.referrer,
        location: {
          country: trackingEvent.location.country || "unknown",
          region: trackingEvent.location.region || "unknown",
          city: trackingEvent.location.city || "unknown",
          latitude: trackingEvent.location.latitude || 0,
          longitude: trackingEvent.location.longitude || 0,
        },
      };

      after(async () => {
        try {
          await sendTinybirdEvent(eventForTinybird);
        } catch (tinybirdErr) {
          console.error("Tinybird request failed:", tinybirdErr);
        }
      });
    } else {
      console.warn("Tinybird configuration missing, skipping event send.");
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          ...buildRateLimitHeaders(rateLimitResult),
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (err) {
    console.error("Error in track-link route:", err);
    return NextResponse.json(
      { error: "Failed to track click" },
      {
        status: 500,
        headers: {
          ...buildRateLimitHeaders(rateLimitResult),
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
