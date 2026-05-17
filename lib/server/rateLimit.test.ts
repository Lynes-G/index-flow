import assert from "node:assert/strict";
import test from "node:test";

import { createMemoryRateLimiter } from "@/lib/server/rateLimit";

test("memory rate limiter blocks requests beyond the configured limit", () => {
  const nowValues = [1_000, 1_100, 1_200];
  const rateLimiter = createMemoryRateLimiter({
    maxRequests: 2,
    windowMs: 60_000,
    now: () => nowValues.shift() ?? 1_200,
  });

  const firstAttempt = rateLimiter.check("user:123");
  const secondAttempt = rateLimiter.check("user:123");
  const thirdAttempt = rateLimiter.check("user:123");

  assert.equal(firstAttempt.allowed, true);
  assert.equal(secondAttempt.allowed, true);
  assert.equal(thirdAttempt.allowed, false);
  assert.equal(thirdAttempt.remaining, 0);
  assert.equal(thirdAttempt.retryAfterSeconds, 60);
});

test("memory rate limiter resets after the window expires", () => {
  const nowValues = [1_000, 1_100, 62_000];
  const rateLimiter = createMemoryRateLimiter({
    maxRequests: 2,
    windowMs: 60_000,
    now: () => nowValues.shift() ?? 62_000,
  });

  rateLimiter.check("user:123");
  rateLimiter.check("user:123");
  const resetAttempt = rateLimiter.check("user:123");

  assert.equal(resetAttempt.allowed, true);
  assert.equal(resetAttempt.remaining, 1);
});
