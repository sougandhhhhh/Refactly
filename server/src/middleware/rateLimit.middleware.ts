import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import { config } from "../config";

let redis: Redis | null = null;

try {
  if (config.upstash.redisUrl) {
    redis = new Redis(config.upstash.redisUrl, {
      password: config.upstash.redisToken,
      enableOfflineQueue: false,
      maxRetriesPerRequest: null,
    });
  }
} catch {
  console.warn("Redis not available, rate limiting disabled");
}

export function rateLimit(maxRequests: number = 10, windowSeconds: number = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!redis) return next();

    const key = `rate:${req.ip || req.socket.remoteAddress}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (current > maxRequests) {
      return res.status(429).json({
        error: "Too many requests, please try again later",
        retryAfter: windowSeconds,
      });
    }

    next();
  };
}
