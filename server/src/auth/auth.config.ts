import Google from "@auth/core/providers/google";
import type { AuthConfig } from "@auth/core";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authConfig: AuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user: googleUser }) {
      if (!googleUser.email) return false;
      try {
        await prisma.user.upsert({
          where: { email: googleUser.email },
          update: {
            name: googleUser.name || googleUser.email.split("@")[0],
            avatar: googleUser.image,
          },
          create: {
            email: googleUser.email,
            name: googleUser.name || googleUser.email.split("@")[0],
            avatar: googleUser.image,
          },
        });
        return true;
      } catch (err) {
        console.error("Prisma upsert error:", err);
        return true;
      }
    },
    async jwt({ token, user }) {
      if (user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
          if (dbUser) {
            token.userId = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.avatar;
          }
        } catch (err) {
          console.error("Prisma find error:", err);
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string | undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      if (url.startsWith("/")) return `${clientUrl}/auth/callback`;
      if (new URL(url).origin === new URL(clientUrl).origin) return url;
      return `${clientUrl}/auth/callback`;
    },
  },
};
