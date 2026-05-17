import {
  buildTinybirdPipeUrl,
  getTinybirdHeaders,
  isTinybirdConfigured,
} from "@/lib/server/tinybird";
import { fetchWithTimeout, readResponseText } from "@/lib/server/http";

export interface AnalyticsData {
  totalClicks: number;
  uniqueVisitors: number;
  countriesReached: number;
  totalLinksClicked: number;
  qrScans: number;
  topLinkTitle: string | null;
  topReferrer: string | null;
  firstClick: string | null;
  lastClick: string | null;
}

export async function fetchAnalytics(
  userId: string,
  daysBack: number = 30,
): Promise<AnalyticsData> {
  if (!isTinybirdConfigured()) {
    return {
      totalClicks: 0,
      uniqueVisitors: 0,
      countriesReached: 0,
      totalLinksClicked: 0,
      qrScans: 0,
      topLinkTitle: null,
      topReferrer: null,
      firstClick: null,
      lastClick: null,
    };
  }

  try {
    const tinybirdResponse = await fetchWithTimeout(
      buildTinybirdPipeUrl("profile_summary", {
        profileUserId: userId,
        days_back: daysBack,
      }),
      {
        headers: getTinybirdHeaders(),
        next: { revalidate: 0 },
      },
      5000,
    );

    if (!tinybirdResponse.ok) {
      console.error(
        "Tinybird response not ok:",
        await readResponseText(tinybirdResponse),
      );
      throw new Error("Failed to fetch analytics data from Tinybird");
    }

    const data = await tinybirdResponse.json();

    // Handle empty response
    if (data.data.length === 0 || !data.data[0] || !data.data) {
      return {
        totalClicks: 0,
        uniqueVisitors: 0,
        countriesReached: 0,
        totalLinksClicked: 0,
        qrScans: 0,
        topLinkTitle: null,
        topReferrer: null,
        firstClick: null,
        lastClick: null,
      };
    }

    const analytics = data.data[0];

    return {
      totalClicks: analytics.total_clicks || 0,
      uniqueVisitors: analytics.unique_visitors || 0,
      countriesReached: analytics.countries_reached || 0,
      totalLinksClicked: analytics.total_links_clicked || 0,
      qrScans: analytics.total_qr_scans || 0,
      topLinkTitle: analytics.top_link_title?.[0] || null,
      topReferrer: analytics.top_referrer?.[0] || null,
      firstClick: analytics.first_click || null,
      lastClick: analytics.last_click || null,
    };
  } catch (err) {
    console.error("Error fetching analytics data:", err);

    return {
      totalClicks: 0,
      uniqueVisitors: 0,
      countriesReached: 0,
      totalLinksClicked: 0,
      qrScans: 0,
      topLinkTitle: null,
      topReferrer: null,
      firstClick: null,
      lastClick: null,
    };
  }
}
