import { fetchWithTimeout, readResponseText } from "./http";

const TINYBIRD_TIMEOUT_MS = 5000;

const getTinybirdConfig = () => {
  const host = process.env.TINYBIRD_HOST?.trim();
  const token = process.env.TINYBIRD_TOKEN?.trim();

  if (!host || !token) {
    return null;
  }

  return { host: host.replace(/\/$/, ""), token };
};

export const isTinybirdConfigured = () => getTinybirdConfig() !== null;

export const buildTinybirdPipeUrl = (
  pipeName: string,
  params: Record<string, string | number>,
) => {
  const config = getTinybirdConfig();

  if (!config) {
    throw new Error("Tinybird is not configured");
  }

  const url = new URL(`/v0/pipes/${pipeName}.json`, config.host);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
};

export const sendTinybirdEvent = async (event: unknown) => {
  const config = getTinybirdConfig();

  if (!config) {
    return;
  }

  const response = await fetchWithTimeout(
    `${config.host}/v0/events?name=link_clicks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    },
    TINYBIRD_TIMEOUT_MS,
  );

  if (!response.ok) {
    const errorText = await readResponseText(response);
    throw new Error(
      `Tinybird response error (${response.status}): ${errorText || "Unknown error"}`,
    );
  }
};

export const getTinybirdHeaders = () => {
  const config = getTinybirdConfig();

  if (!config) {
    throw new Error("Tinybird is not configured");
  }

  return {
    Authorization: `Bearer ${config.token}`,
  };
};
