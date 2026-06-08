import { fetchTinybirdPipe, isTinybirdConfigured } from "@/lib/server/tinybird";
import {
  normalizeAnalyticsDateString,
  normalizeAnalyticsText,
} from "@/lib/frontend/analytics/analyticsFormatting";
import { readResponseText } from "@/lib/server/http";

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

const emptyAnalytics = (): AnalyticsData => ({
  totalClicks: 0,
  uniqueVisitors: 0,
  countriesReached: 0,
  totalLinksClicked: 0,
  qrScans: 0,
  topLinkTitle: null,
  topReferrer: null,
  firstClick: null,
  lastClick: null,
});

export const normalizeAnalyticsData = (
  analytics: Partial<Record<string, unknown>> | null | undefined,
): AnalyticsData => {
  if (!analytics) {
    return emptyAnalytics();
  }

  return {
    totalClicks: Number(analytics.total_clicks) || 0,
    uniqueVisitors: Number(analytics.unique_visitors) || 0,
    countriesReached: Number(analytics.countries_reached) || 0,
    totalLinksClicked: Number(analytics.total_links_clicked) || 0,
    qrScans: Number(analytics.total_qr_scans) || 0,
    topLinkTitle: normalizeAnalyticsText(
      Array.isArray(analytics.top_link_title)
        ? String(analytics.top_link_title[0] ?? "")
        : typeof analytics.top_link_title === "string"
          ? analytics.top_link_title
          : null,
    ),
    topReferrer: normalizeAnalyticsText(
      Array.isArray(analytics.top_referrer)
        ? String(analytics.top_referrer[0] ?? "")
        : typeof analytics.top_referrer === "string"
          ? analytics.top_referrer
          : null,
    ),
    firstClick: normalizeAnalyticsDateString(
      typeof analytics.first_click === "string" ? analytics.first_click : null,
    ),
    lastClick: normalizeAnalyticsDateString(
      typeof analytics.last_click === "string" ? analytics.last_click : null,
    ),
  };
};

export async function fetchAnalytics(
  userId: string,
  daysBack: number = 30,
): Promise<AnalyticsData> {
  if (!isTinybirdConfigured()) {
    return emptyAnalytics();
  }

  try {
    const tinybirdResponse = await fetchTinybirdPipe("profile_summary", {
      profileUserId: userId,
      days_back: daysBack,
    });

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
      return emptyAnalytics();
    }

    return normalizeAnalyticsData(data.data[0]);
  } catch (err) {
    console.error("Error fetching analytics data:", err);

    return emptyAnalytics();
  }
}
