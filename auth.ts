import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { sanitizeEmail } from "@/lib/utils/santiize-email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials;
        console.log("auth request");
        console.log(email, password);
        return { email: email as string };
      }
    })
  ]
});