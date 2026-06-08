import {
  fetchTinybirdPipe,
  fetchTinybirdSql,
  isTinybirdConfigured,
} from "@/lib/server/tinybird";
import {
  normalizeAnalyticsDateString,
  normalizeAnalyticsText,
} from "@/lib/frontend/analytics/analyticsFormatting";
import { readResponseText } from "@/lib/server/http";

export interface AnalyticsData {
  profileViews: number;
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
  profileViews: 0,
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
    profileViews: Number(analytics.total_profile_views) || 0,
    totalClicks: Number(analytics.total_clicks) || 0,
    uniqueVisitors:
      Number(analytics.unique_visitors ?? analytics.unique_users) || 0,
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

const escapeTinybirdSqlString = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

const fetchProfileViews = async (userId: string, daysBack: number) => {
  const escapedUserId = escapeTinybirdSqlString(userId);
  const safeDaysBack = Math.max(1, Math.min(365, Math.floor(daysBack)));
  const response = await fetchTinybirdSql(`
    SELECT countIf(event_type = 'profile_view') AS total_profile_views
    FROM link_clicks
    WHERE profileUserId = '${escapedUserId}'
      AND timestamp >= now() - INTERVAL ${safeDaysBack} DAY
  `);

  if (!response.ok) {
    console.error(
      "Tinybird profile view response not ok:",
      await readResponseText(response),
    );
    return 0;
  }

  const data = (await response.json()) as {
    data?: Array<{ total_profile_views?: unknown }>;
  };

  return Number(data.data?.[0]?.total_profile_views) || 0;
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

    const analytics = normalizeAnalyticsData(data.data[0]);

    if (analytics.profileViews > 0) {
      return analytics;
    }

    return {
      ...analytics,
      profileViews: await fetchProfileViews(userId, daysBack),
    };
  } catch (err) {
    console.error("Error fetching analytics data:", err);

    return emptyAnalytics();
  }
}
