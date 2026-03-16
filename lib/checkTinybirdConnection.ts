export interface TinybirdConnectionStatus {
  ok: boolean;
  message: string;
}

export async function checkTinybirdConnection(
  profileUserId: string,
): Promise<TinybirdConnectionStatus> {
  if (!process.env.TINYBIRD_TOKEN || !process.env.TINYBIRD_HOST) {
    return {
      ok: false,
      message: "Missing TINYBIRD_TOKEN or TINYBIRD_HOST",
    };
  }

  try {
    const response = await fetch(
      `${process.env.TINYBIRD_HOST}/v0/pipes/profile_summary.json?profileUserId=${profileUserId}&days_back=30`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
        },
        next: { revalidate: 0 },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return {
        ok: false,
        message: `Tinybird error ${response.status}: ${text}`,
      };
    }

    return { ok: true, message: "Tinybird connected" };
  } catch (error) {
    return {
      ok: false,
      message: `Tinybird request failed: ${String(error)}`,
    };
  }
}
