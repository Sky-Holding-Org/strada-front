import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limit configurations from environment variables
const RATE_LIMIT_HEAVY = parseInt(process.env.RATE_LIMIT_HEAVY || "10");
const RATE_LIMIT_LIGHT = parseInt(process.env.RATE_LIMIT_LIGHT || "50");
const RATE_LIMIT_DEFAULT = parseInt(process.env.RATE_LIMIT_DEFAULT || "20");

// Heavy routes (pagination, loops)
export const heavyRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(RATE_LIMIT_HEAVY, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit/heavy",
});

// Light routes (single fetches)
export const lightRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(RATE_LIMIT_LIGHT, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit/light",
});

// Default routes
export const defaultRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(RATE_LIMIT_DEFAULT, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit/default",
});
