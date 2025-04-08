import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { sanitizeEmail } from "@/lib/utils/santiize-email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials as { email: string, password: string };

        const user = await prisma.user.findUnique({ where: { email: sanitizeEmail(email) } });
        if (!user) return null;

        // compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return { email: user.email };
      }
    })
  ]
});