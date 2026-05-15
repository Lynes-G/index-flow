import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { api } from "@/convex/_generated/api";
import { ServerTrackingEvent, ClientTrackingData } from "@/lib/types";
import { getClient } from "@/convex/lib/client";
import { z } from "zod";

const trackingEventSchema = z.object({
  profileUsername: z.string().trim().min(1).max(100),
  linkId: z.string().trim().min(1).max(128),
  eventType: z.literal("link_click").optional(),
});

export async function POST(request: NextRequest) {
  try {
    let data: ClientTrackingData;
    try {
      data = trackingEventSchema.parse(await request.json());
    } catch {
      return NextResponse.json(
        { error: "Invalid tracking payload" },
        { status: 400 },
      );
    }
    const geo = await geolocation(request);
    const convex = getClient();

    // Fetch user ID based on username
    const userId = await convex.query(api.lib.usernames.getUserIdBySlug, {
      slug: data.profileUsername,
    });

    if (!userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const link = await convex.query(api.lib.links.getTrackableLink, {
      userId,
      linkId: data.linkId,
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
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

    if (process.env.TINYBIRD_TOKEN && process.env.TINYBIRD_HOST) {
      try {
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

        const tinybirdResponse = await fetch(
          `${process.env.TINYBIRD_HOST}/v0/events?name=link_clicks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventForTinybird),
          },
        );

        if (!tinybirdResponse.ok) {
          const errorText = await tinybirdResponse.text();
          console.error(
            "Tinybird response error:",
            tinybirdResponse.status,
            errorText,
          );
        }
      } catch (tinybirdErr) {
        console.error("Tinybird request failed:", tinybirdErr);
      }
    } else {
      console.warn("Tinybird configuration missing, skipping event send.");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in track-link route:", err);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 },
    );
  }
}
