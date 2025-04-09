import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { sanitizeEmail } from "@/lib/utils/santiize-email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials as { email: string; password: string };

        const user = await prisma.user.findUnique({ where: { email: sanitizeEmail(email) } });
        if (!user) return null;

        // compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account) {
        // attach user id to token
        token.user_id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // attach token.id to session
      if (token && session) {
        session.user.id = token.user_id as string;
      }

      return session;
    },
  },
  pages: { signIn: "/login", signOut: "/login", error: "/login" },
});
