type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

type MemoryRateLimiterOptions = {
  maxRequests: number;
  windowMs: number;
  now?: () => number;
};

const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
};

export const createMemoryRateLimiter = ({
  maxRequests,
  windowMs,
  now = Date.now,
}: MemoryRateLimiterOptions) => {
  const entries = new Map<string, RateLimitEntry>();

  return {
    check(key: string): RateLimitResult {
      const currentTime = now();
      const existingEntry = entries.get(key);

      if (!existingEntry || existingEntry.resetAt <= currentTime) {
        const resetAt = currentTime + windowMs;
        entries.set(key, { count: 1, resetAt });

        return {
          allowed: true,
          limit: maxRequests,
          remaining: Math.max(maxRequests - 1, 0),
          resetAt,
          retryAfterSeconds: Math.ceil(windowMs / 1000),
        };
      }

      if (existingEntry.count >= maxRequests) {
        return {
          allowed: false,
          limit: maxRequests,
          remaining: 0,
          resetAt: existingEntry.resetAt,
          retryAfterSeconds: Math.max(
            Math.ceil((existingEntry.resetAt - currentTime) / 1000),
            1,
          ),
        };
      }

      existingEntry.count += 1;
      entries.set(key, existingEntry);

      return {
        allowed: true,
        limit: maxRequests,
        remaining: Math.max(maxRequests - existingEntry.count, 0),
        resetAt: existingEntry.resetAt,
        retryAfterSeconds: Math.max(
          Math.ceil((existingEntry.resetAt - currentTime) / 1000),
          1,
        ),
      };
    },
  };
};

export const buildRateLimitHeaders = (result: RateLimitResult) => ({
  "X-RateLimit-Limit": String(result.limit),
  "X-RateLimit-Remaining": String(result.remaining),
  "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  "Retry-After": String(result.retryAfterSeconds),
});

export const getRateLimitKey = ({
  request,
  prefix,
  suffix,
}: {
  request: Request;
  prefix: string;
  suffix?: string | null;
}) => {
  const ip = getClientIp(request);
  return [prefix, ip, suffix?.trim() || null].filter(Boolean).join(":");
};
