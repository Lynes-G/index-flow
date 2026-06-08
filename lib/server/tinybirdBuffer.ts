import { sendTinybirdEvent } from "@/lib/server/tinybird";

const TINYBIRD_BUFFER_TTL_MS = 5 * 60 * 1000;
const TINYBIRD_BUFFER_MAX_EVENTS = 500;
const TINYBIRD_RETRY_DELAY_MS = 10_000;

type TinybirdBufferEntry = {
  event: unknown;
  queuedAt: number;
  expiresAt: number;
};

const bufferedEvents: TinybirdBufferEntry[] = [];
let retryTimer: NodeJS.Timeout | null = null;
let isFlushing = false;

const logTinybirdBufferError = (
  message: string,
  metadata: Record<string, unknown> = {},
) => {
  console.error(message, {
    severity: "error",
    ...metadata,
  });
};

const pruneExpiredEvents = (now = Date.now()) => {
  for (let index = bufferedEvents.length - 1; index >= 0; index -= 1) {
    if (bufferedEvents[index].expiresAt <= now) {
      bufferedEvents.splice(index, 1);
      logTinybirdBufferError("Tinybird buffered event expired before retry.", {
        bufferSize: bufferedEvents.length,
      });
    }
  }
};

const scheduleTinybirdRetry = () => {
  if (retryTimer || bufferedEvents.length === 0) {
    return;
  }

  retryTimer = setTimeout(() => {
    retryTimer = null;
    void flushTinybirdBuffer();
  }, TINYBIRD_RETRY_DELAY_MS);

  retryTimer.unref?.();
};

export const enqueueTinybirdEventForRetry = (event: unknown) => {
  const now = Date.now();
  pruneExpiredEvents(now);

  while (bufferedEvents.length >= TINYBIRD_BUFFER_MAX_EVENTS) {
    bufferedEvents.shift();
    logTinybirdBufferError("Tinybird retry buffer full; dropped oldest event.", {
      bufferSize: bufferedEvents.length,
    });
  }

  bufferedEvents.push({
    event,
    queuedAt: now,
    expiresAt: now + TINYBIRD_BUFFER_TTL_MS,
  });
  scheduleTinybirdRetry();
};

export const flushTinybirdBuffer = async () => {
  if (isFlushing) {
    return;
  }

  isFlushing = true;

  try {
    pruneExpiredEvents();

    for (let index = 0; index < bufferedEvents.length; ) {
      const entry = bufferedEvents[index];

      try {
        await sendTinybirdEvent(entry.event);
        bufferedEvents.splice(index, 1);
      } catch (error) {
        if (entry.expiresAt <= Date.now()) {
          bufferedEvents.splice(index, 1);
          logTinybirdBufferError(
            "Tinybird buffered event expired after retry failure.",
            {
              queuedForMs: Date.now() - entry.queuedAt,
              error,
            },
          );
          continue;
        }

        logTinybirdBufferError("Tinybird buffered event retry failed.", {
          queuedForMs: Date.now() - entry.queuedAt,
          error,
        });
        break;
      }
    }
  } finally {
    isFlushing = false;
  }

  scheduleTinybirdRetry();
};

export const sendTinybirdEventWithRetryBuffer = async (event: unknown) => {
  try {
    await flushTinybirdBuffer();
    await sendTinybirdEvent(event);
  } catch (error) {
    logTinybirdBufferError("Tinybird request failed; buffering for retry.", {
      error,
    });
    enqueueTinybirdEventForRetry(event);
  }
};
