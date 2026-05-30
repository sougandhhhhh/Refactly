import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "your-super-secret-key",
  supabase: {
    url: process.env.SUPABASE_URL || "",
    serviceKey: process.env.SUPABASE_SERVICE_KEY || "",
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || "",
  },
  google: {
    apiKey: process.env.GOOGLE_AI_API_KEY || "",
  },
  upstash: {
    redisUrl: process.env.UPSTASH_REDIS_URL || "",
    redisToken: process.env.UPSTASH_REDIS_TOKEN || "",
  },
  database: {
    url: process.env.DATABASE_URL || "",
    directUrl: process.env.DIRECT_URL || "",
  },
  auth: {
    secret: process.env.AUTH_SECRET || "",
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },
} as const;
