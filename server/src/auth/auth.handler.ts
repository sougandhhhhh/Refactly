import { Auth } from "@auth/core";
import type { AuthConfig } from "@auth/core";
import type { Request, Response } from "express";

export function createAuthHandler(config: AuthConfig) {
  return async (req: Request, res: Response) => {
    try {
      const proto = req.get("x-forwarded-proto") || req.protocol;
      const host = req.get("x-forwarded-host") || req.get("host") || "localhost:5000";
      const url = new URL(req.originalUrl || req.url, `${proto}://${host}`);

      const headers = new Headers();
      if (req.headers.cookie) headers.set("cookie", req.headers.cookie as string);
      if (req.headers["content-type"]) headers.set("content-type", req.headers["content-type"] as string);
      if (req.headers["accept"]) headers.set("accept", req.headers["accept"] as string);

      const init: RequestInit & { headers: Headers } = {
        method: req.method,
        headers,
      };

      if (req.method === "POST" && req.body) {
        init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      }

      config.basePath = "/api/auth";

      const authResponse = await Auth(new globalThis.Request(url.toString(), init), config);

      res.status(authResponse.status);
      authResponse.headers.forEach((value, key) => {
        if (key !== "set-cookie") {
          res.setHeader(key, value);
        }
      });

      const cookies = authResponse.headers.getSetCookie();
      if (cookies) {
        for (const cookie of cookies) {
          res.append("Set-Cookie", cookie);
        }
      }

      const text = await authResponse.text();
      if (text) res.send(text);
      else res.end();
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(500).json({ error: String(error) });
    }
  };
}
