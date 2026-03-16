import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { api } from "@/convex/_generated/api";
import { ServerTrackingEvent, ClientTrackingData } from "@/lib/types";
import { getClient } from "@/convex/lib/client";

export async function POST(request: NextRequest) {
  try {
    let data: ClientTrackingData;
    try {
      data = await request.json();
    } catch (jsonErr) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
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

    const trackingEvent: ServerTrackingEvent = {
      ...data, // Client data
      eventType: data.eventType || "link_click",

      // Server data
      timestamp: new Date().toISOString(),
      profileUserId: userId,
      location: {
        ...geo,
      },
      userAgent:
        data.userAgent || request.headers.get("user-agent") || "unknown",
    };

    // Send to Tinybird Events API
    console.log("Sending event to Tinybird:", trackingEvent);

    if (process.env.TINYBIRD_TOKEN && process.env.TINYBIRD_HOST) {
      try {
        // Send location as nested object to match schema json paths
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
        console.log(
          "Sending event to Tinybird",
          JSON.stringify(eventForTinybird, null, 2),
        );

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
        } else {
          const responseBody = await tinybirdResponse.text();
          console.log("Tinybird response body:", responseBody);
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
