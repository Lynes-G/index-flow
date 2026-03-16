import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { api } from "@/convex/_generated/api";
import { getClient } from "@/convex/lib/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const { username } = params;

  try {
    const convex = getClient();
    const geo = await geolocation(request);
    const userId = await convex.query(api.lib.usernames.getUserIdBySlug, {
      slug: username,
    });

    if (!userId) {
      return NextResponse.redirect(new URL(`/u/${username}`, request.url));
    }

    if (process.env.TINYBIRD_TOKEN && process.env.TINYBIRD_HOST) {
      const eventForTinybird = {
        timestamp: new Date().toISOString(),
        profileUsername: username,
        profileUserId: userId,
        linkId: "",
        linkTitle: "Profile QR",
        linkUrl: new URL(`/u/${username}`, request.url).toString(),
        eventType: "qr_scan",
        userAgent: request.headers.get("user-agent") || "unknown",
        referrer: request.headers.get("referer") || "direct",
        location: {
          country: geo.country || "unknown",
          region: geo.region || "unknown",
          city: geo.city || "unknown",
          latitude: geo.latitude || 0,
          longitude: geo.longitude || 0,
        },
      };

      try {
        await fetch(`${process.env.TINYBIRD_HOST}/v0/events?name=link_clicks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventForTinybird),
        });
      } catch (err) {
        console.error("Tinybird QR ingest failed:", err);
      }
    }
  } catch (err) {
    console.error("QR tracking error:", err);
  }

  return NextResponse.redirect(new URL(`/u/${username}`, request.url));
}
