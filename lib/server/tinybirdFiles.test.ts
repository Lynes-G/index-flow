import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readProjectFile = (path: string) => readFileSync(path, "utf8");

test("link analytics pipes honor the dashboard days_back parameter", () => {
  for (const pipePath of [
    "tinybird/pipes/fast_link_analytics.pipe",
    "tinybird/pipes/link_analytics.pipe",
    "tinybird/pipes/link_country_analytics.pipe",
  ]) {
    assert.match(readProjectFile(pipePath), /Int32\(days_back, 30\)/);
  }
});

test("link clicks datasource keeps only allowed geo fields", () => {
  const datasource = readProjectFile(
    "tinybird/datasources/link_clicks.datasource",
  );

  assert.match(datasource, /location_country/);
  assert.match(datasource, /location_city/);
  assert.doesNotMatch(datasource, /location_region/);
  assert.doesNotMatch(datasource, /location_latitude/);
  assert.doesNotMatch(datasource, /location_longitude/);
});

test("local Tinybird credentials are ignored by Git", () => {
  assert.match(readProjectFile(".gitignore"), /tinybird\/\.tinyb/);
});
