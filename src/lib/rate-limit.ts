import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { logger } from "./logger";

let cachedRedis: Redis | null = null;

function getRedis(): Redis | null {
  if (cachedRedis) return cachedRedis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  cachedRedis = new Redis({ url, token });
  return cachedRedis;
}

/**
 * Build a rate limiter keyed by identifier (typically IP).
 * Returns null if Upstash is not configured — callers should treat
 * absence as "rate limiting disabled" (do not block in dev).
 */
export function buildRateLimiter(opts: {
  prefix: string;
  limit: number;
  window: `${number} ${"s" | "m" | "h" | "d"}`;
}): Ratelimit | null {
  const redis = getRedis();
  if (!redis) {
    logger.warn(
      { prefix: opts.prefix },
      "Upstash not configured — rate limiting disabled",
    );
    return null;
  }
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(opts.limit, opts.window),
    prefix: `yy:${opts.prefix}`,
    analytics: true,
  });
}

// Pre-built limiters used across the app
export const adminLoginLimiter = buildRateLimiter({
  prefix: "admin-login",
  limit: 5,
  window: "15 m",
});

export const newsletterSubscribeLimiter = buildRateLimiter({
  prefix: "newsletter",
  limit: 3,
  window: "1 h",
});

export const contactFormLimiter = buildRateLimiter({
  prefix: "contact",
  limit: 3,
  window: "1 h",
});

export const trackClickLimiter = buildRateLimiter({
  prefix: "track-click",
  limit: 60,
  window: "1 m",
});
