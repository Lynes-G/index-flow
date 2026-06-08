import assert from "node:assert/strict";
import test from "node:test";
import {
  buildTrackingVisitorCookie,
  buildTinybirdTrackingEvent,
  buildTrackingRequestContext,
  getPrivacyAwareLocation,
  getSafeGeolocation,
  hasTrackingConsent,
  isKnownBotUserAgent,
  resolveTrackingVisitorId,
  validateTrackingEventPayload,
} from "./tracking";

test("tracking payload validation accepts a valid click payload", () => {
  const result = validateTrackingEventPayload({
    profileUsername: "indexflow",
    linkId: "abc123",
    visitorId: "visitor_123",
  });

  assert.deepEqual(result, {
    profileUsername: "indexflow",
    linkId: "abc123",
    visitorId: "visitor_123",
  });
});

test("tracking payload validation rejects malformed payloads", () => {
  assert.throws(() =>
    validateTrackingEventPayload({
      profileUsername: "",
      linkId: "abc123",
      visitorId: "visitor_123",
    }),
  );

  assert.throws(() =>
    validateTrackingEventPayload({
      profileUsername: "indexflow",
      linkId: "",
      visitorId: "visitor_123",
    }),
  );
});

test("tracking payload validation accepts visitor ids when provided", () => {
  const result = validateTrackingEventPayload({
    profileUsername: "indexflow",
    linkId: "abc123",
    visitorId: "visitor_123",
  });

  assert.equal(result.visitorId, "visitor_123");
});

test("tracking request context falls back when headers are missing", () => {
  const request = new Request(
    "https://indexflow.app/api/track-click",
  ) as unknown as Parameters<typeof buildTrackingRequestContext>[0];
  const context = buildTrackingRequestContext(request, {});

  assert.deepEqual(context, {
    location: {},
    userAgent: "unknown",
    referrer: "direct",
  });
});

test("safe geolocation returns an empty object when lookup fails", async () => {
  const geo = await getSafeGeolocation(() => {
    throw new Error("geo lookup failed");
  });

  assert.deepEqual(geo, {});
});

test("privacy-aware location keeps city only when tracking consent is granted", () => {
  assert.deepEqual(
    getPrivacyAwareLocation(
      {
        country: "US",
        city: "New York",
        region: "NY",
        latitude: "40.7128",
        longitude: "-74.006",
      },
      true,
    ),
    {
      country: "US",
      city: "New York",
    },
  );

  assert.deepEqual(
    getPrivacyAwareLocation(
      {
        country: "US",
        city: "New York",
        region: "NY",
        latitude: "40.7128",
        longitude: "-74.006",
      },
      false,
    ),
    {
      country: "US",
      city: undefined,
    },
  );
});

test("tracking consent is explicit", () => {
  const requestWithoutConsent = new Request(
    "https://indexflow.app/api/track-click",
  ) as unknown as Parameters<typeof hasTrackingConsent>[0];
  const requestWithConsent = new Request(
    "https://indexflow.app/api/track-click",
    {
      headers: {
        cookie: "indexflow_tracking_consent=granted",
      },
    },
  ) as unknown as Parameters<typeof hasTrackingConsent>[0];

  assert.equal(hasTrackingConsent(requestWithoutConsent), false);
  assert.equal(hasTrackingConsent(requestWithConsent), true);
});

test("tracking consent tolerates malformed cookie encoding", () => {
  const request = new Request("https://indexflow.app/api/track-click", {
    headers: {
      cookie: "indexflow_tracking_consent=%",
    },
  }) as unknown as Parameters<typeof hasTrackingConsent>[0];

  assert.equal(hasTrackingConsent(request), false);
});

test("known bot user agents are ignored by tracking callers", () => {
  assert.equal(isKnownBotUserAgent("Googlebot/2.1"), true);
  assert.equal(isKnownBotUserAgent("Mozilla/5.0 Safari/605.1.15"), false);
});

test("tinybird tracking events keep only country and city location fields", () => {
  const event = buildTinybirdTrackingEvent({
    profileUsername: "indexflow",
    profileUserId: "user_123",
    visitorId: "visitor_123",
    linkId: "link_123",
    linkTitle: "Portfolio",
    linkUrl: "https://example.com",
    timestamp: "2026-05-23T12:00:00.000Z",
    eventType: "link_click",
    userAgent: "Mozilla/5.0",
    referrer: "direct",
    location: {},
  });

  assert.deepEqual(event.location, {
    country: "unknown",
    city: "unknown",
  });
});

test("tinybird tracking events convert ISO timestamps to Tinybird DateTime format", () => {
  const event = buildTinybirdTrackingEvent({
    profileUsername: "indexflow",
    profileUserId: "user_123",
    visitorId: "visitor_123",
    linkId: "link_123",
    linkTitle: "Portfolio",
    linkUrl: "https://example.com",
    timestamp: "2026-05-23T08:02:42.123Z",
    eventType: "link_click",
    userAgent: "Mozilla/5.0",
    referrer: "direct",
    location: {},
  });

  assert.equal(event.timestamp, "2026-05-23 08:02:42");
});

test("tracking visitor resolution prefers request cookies", () => {
  const request = new Request("https://indexflow.app/api/track-click", {
    headers: {
      cookie: "indexflow_visitor_id=cookie_visitor",
    },
  }) as unknown as Parameters<typeof resolveTrackingVisitorId>[0];

  const result = resolveTrackingVisitorId(request, "body_visitor");

  assert.deepEqual(result, {
    visitorId: "cookie_visitor",
    shouldSetCookie: false,
  });
});

test("tracking visitor resolution falls back to payload ids", () => {
  const request = new Request(
    "https://indexflow.app/api/track-click",
  ) as unknown as Parameters<typeof resolveTrackingVisitorId>[0];

  const result = resolveTrackingVisitorId(request, "body_visitor");

  assert.deepEqual(result, {
    visitorId: "body_visitor",
    shouldSetCookie: true,
  });
});

test("tracking visitor resolution avoids persistent ids without consent", () => {
  const request = new Request("https://indexflow.app/api/track-click", {
    headers: {
      cookie: "indexflow_visitor_id=cookie_visitor",
    },
  }) as unknown as Parameters<typeof resolveTrackingVisitorId>[0];

  const result = resolveTrackingVisitorId(request, "body_visitor", {
    allowPersistentVisitorId: false,
  });

  assert.notEqual(result.visitorId, "cookie_visitor");
  assert.notEqual(result.visitorId, "body_visitor");
  assert.equal(result.shouldSetCookie, false);
});

test("tracking visitor cookies persist anonymous ids for future requests", () => {
  const cookie = buildTrackingVisitorCookie("visitor_123");

  assert.deepEqual(cookie, {
    name: "indexflow_visitor_id",
    value: "visitor_123",
    httpOnly: false,
    maxAge: 31536000,
    path: "/",
    sameSite: "lax",
    secure: false,
  });
});
