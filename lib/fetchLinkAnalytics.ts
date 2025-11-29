export interface LinkAnalyticsData {
  linkId: string;
  linkTitle: string;
  linkUrl: string;
  totalClicks: number;
  uniqueUsers: number;
  countriesReached: number;
  dailyData: Array<{
    date: string;
    clicks: number;
    uniqueUsers: number;
    countries: number;
  }>;
  countryData: Array<{
    country: string;
    clicks: number;
    percentage: number;
  }>;
}

interface TinybirdLinkAnalyticsRow {
  date: string;
  linkTitle: string;
  linkUrl: string;
  total_clicks: number;
  total_users: number;
  countries_reached: number;
}

interface TinybirdLinkCountryDataRow {
  country: string;
  total_clicks: number;
  unique_users: number;
  percentage: number;
}

export async function fetchLinkAnalytics(
  userId: string,
  linkId: string,
  daysBack: number = 30,
): Promise<LinkAnalyticsData> {
  if (!process.env.TINYBIRD_TOKEN || !process.env.TINYBIRD_HOST) {
    return {
      linkId,
      linkTitle: "Sample Link",
      linkUrl: "https://example.com",
      totalClicks: 0,
      uniqueUsers: 0,
      countriesReached: 0,
      dailyData: [],
      countryData: [],
    };
  }

  try {
    // Try fast materialized endpoint first
    let tinybirdResponse = await fetch(
      `${process.env.TINYBIRD_HOST}/v0/pipes/fast_link_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=${daysBack}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
        },
        next: { revalidate: 0 },
      },
    );

    // Fallback to original endpoint if fast one fails
    if (!tinybirdResponse.ok) {
      tinybirdResponse = await fetch(
        `${process.env.TINYBIRD_HOST}/v0/pipes/link_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=${daysBack}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
          },
          next: { revalidate: 0 },
        },
      );
    }
    if (!tinybirdResponse.ok) {
      console.error("Tinybird response not ok:", await tinybirdResponse.text());
      throw new Error("Failed to fetch link analytics data from Tinybird");
    }

    const data = await tinybirdResponse.json();

    if (data.data.length === 0 || !data.data[0] || !data.data) {
      return {
        linkId,
        linkTitle: "This link has no analytics",
        linkUrl:
          "Please wait for analytics to be generated or check back later.",
        totalClicks: 0,
        uniqueUsers: 0,
        countriesReached: 0,
        dailyData: [],
        countryData: [],
      };
    }

    // Get link info from the first row
    const firstRow = data.data[0];

    // Process the daily data
    const dailyData = data.data.map((row: TinybirdLinkAnalyticsRow) => ({
      date: row.date,
      clicks: row.total_clicks || 0,
      uniqueUsers: row.total_users || 0,
      countries: row.countries_reached || 0,
    }));

    // Calculate totals
    const totalClicks = dailyData.reduce(
      (sum: number, day: { clicks: number }) => sum + day.clicks,
      0,
    );
    const uniqueUsers = Math.max(
      ...dailyData.map((day: { uniqueUsers: number }) => day.uniqueUsers),
      0,
    );
    const countriesReached = Math.max(
      ...dailyData.map((day: { countries: number }) => day.countries),
      0,
    );

    let countryData: Array<{
      country: string;
      clicks: number;
      percentage: number;
    }> = [];

    try {
      const countryResponse = await fetch(
        `${process.env.TINYBIRD_HOST}/v0/pipes/link_country_analytics.json?profileUserId=${userId}&linkId=${linkId}&days_back=${daysBack}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
          },
          next: { revalidate: 0 },
        },
      );

      if (countryResponse.ok) {
        const countryDataJson = await countryResponse.json();

        if (countryDataJson.data && countryDataJson.data.length > 0) {
          countryData = countryDataJson.data.map(
            (row: TinybirdLinkCountryDataRow) => ({
              country: row.country || "Unknown",
              clicks: row.total_clicks || 0,
              percentage: row.percentage || 0,
            }),
          );
        }
      }
    } catch (countryErr) {
      console.error("Error fetching country data:", countryErr);
    }
    return {
      linkId,
      linkTitle: firstRow.linkTitle || "Unknown Link",
      linkUrl: firstRow.linkUrl || "",
      totalClicks,
      uniqueUsers,
      countriesReached,
      dailyData: dailyData.reverse(), // Reverse to have oldest first
      countryData,
    };
  } catch (tinybirdErr) {
    console.error("Error fetching link analytics data:", tinybirdErr);
    return {
      linkId,
      linkTitle: "Unknown Link",
      linkUrl: "",
      totalClicks: 0,
      uniqueUsers: 0,
      countriesReached: 0,
      dailyData: [],
      countryData: [],
    };
  }
}
