import { fetchTinybirdPipe, isTinybirdConfigured } from "@/lib/server/tinybird";
import { readResponseText } from "@/lib/server/http";

export interface TinybirdConnectionStatus {
  ok: boolean;
  message: string;
}

export async function checkTinybirdConnection(
  profileUserId: string,
): Promise<TinybirdConnectionStatus> {
  if (!isTinybirdConfigured()) {
    return {
      ok: false,
      message: "Missing TINYBIRD_TOKEN or TINYBIRD_HOST",
    };
  }

  try {
    const response = await fetchTinybirdPipe("profile_summary", {
      profileUserId,
      days_back: 30,
    });

    if (!response.ok) {
      const text = await readResponseText(response);
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
