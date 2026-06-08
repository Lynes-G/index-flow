import { fetchWithTimeout, readResponseText } from "./http";

const TINYBIRD_TIMEOUT_MS = 5000;
const LINK_CLICKS_DATASOURCE = "link_clicks";
const noStoreFetchOptions = {
  next: { revalidate: 0 },
};

const getTinybirdConfig = () => {
  const host = process.env.TINYBIRD_HOST?.trim();
  const token = process.env.TINYBIRD_TOKEN?.trim();

  if (!host || !token) {
    return null;
  }

  return { host: host.replace(/\/$/, ""), token };
};

export const isTinybirdConfigured = () => getTinybirdConfig() !== null;

const buildTinybirdPipeUrl = (
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

const buildTinybirdSqlUrl = (sql: string) => {
  const config = getTinybirdConfig();

  if (!config) {
    throw new Error("Tinybird is not configured");
  }

  const url = new URL("/v0/sql", config.host);
  url.searchParams.set("q", sql);

  return url.toString();
};

export const fetchTinybirdPipe = (
  pipeName: string,
  params: Record<string, string | number>,
) =>
  fetchWithTimeout(
    buildTinybirdPipeUrl(pipeName, params),
    {
      headers: getTinybirdHeaders(),
      ...noStoreFetchOptions,
    },
    TINYBIRD_TIMEOUT_MS,
  );

export const fetchTinybirdSql = (sql: string) =>
  fetchWithTimeout(
    buildTinybirdSqlUrl(sql),
    {
      headers: getTinybirdHeaders(),
      ...noStoreFetchOptions,
    },
    TINYBIRD_TIMEOUT_MS,
  );

export const sendTinybirdEvent = async (event: unknown) => {
  const config = getTinybirdConfig();

  if (!config) {
    return;
  }

  const response = await fetchWithTimeout(
    `${config.host}/v0/events?name=${LINK_CLICKS_DATASOURCE}&wait=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/x-ndjson",
      },
      body: `${JSON.stringify(event)}\n`,
    },
    TINYBIRD_TIMEOUT_MS,
  );

  const responseText = await readResponseText(response);

  if (!response.ok) {
    throw new Error(
      `Tinybird response error (${response.status}): ${responseText || "Unknown error"}`,
    );
  }

  try {
    const result = JSON.parse(responseText) as {
      quarantined_rows?: number;
      successful_rows?: number;
    };

    if ((result.quarantined_rows ?? 0) > 0) {
      throw new Error(
        `Tinybird quarantined ${result.quarantined_rows} row(s); successful rows: ${result.successful_rows ?? 0}`,
      );
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return;
    }

    throw error;
  }
};

const getTinybirdHeaders = () => {
  const config = getTinybirdConfig();

  if (!config) {
    throw new Error("Tinybird is not configured");
  }

  return {
    Authorization: `Bearer ${config.token}`,
  };
};
