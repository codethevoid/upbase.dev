import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { sanitizeEmail } from "@/lib/utils/santiize-email";

const createUser = async ({
  email,
  image,
  name,
  googleId,
  githubId,
}: {
  googleId?: string;
  githubId?: string;
  email: string;
  image?: string;
  name?: string | null | undefined;
}): Promise<boolean> => {
  try {
    await prisma.$transaction(async () => {
      // create user
      const user = await prisma.user.create({
        data: {
          email: sanitizeEmail(email),
          ...(name && { name }),
          ...(image && { avatar: image }),
          ...(googleId && { googleId }),
          ...(githubId && { githubId }),
        },
      });

      // create team
      const team = await prisma.team.create({
        data: {
          name: sanitizeEmail(email).split("@")[0],
          user: { connect: { id: user.id } },
        },
      });

      // create root team folder
      await prisma.storageObject.create({
        data: {
          name: "root",
          storageType: "folder",
          key: `${team.id}`,
          team: { connect: { id: team.id } },
        },
      });
    });

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github,
    Google,
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials as { email: string; password: string };

        const user = await prisma.user.findUnique({ where: { email: sanitizeEmail(email) } });
        if (!user || !user.password) return null;

        // compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (account?.provider === "github" || account?.provider === "google") {
        const id = account?.provider === "github" ? profile?.id : profile?.sub;
        const email = sanitizeEmail(profile?.email || "");
        if (!id || !email) return false;

        // check if user exists
        const user = await prisma.user.findUnique({
          where: {
            ...(account?.provider === "github" ? { githubId: String(id) } : { googleId: id }),
          },
        });

        if (!user) {
          // check if user exists by email
          const userByEmail = await prisma.user.findUnique({ where: { email } });

          if (userByEmail) {
            // update user with githubId or googleId
            await prisma.user.update({
              where: { id: userByEmail.id },
              data: {
                ...(account?.provider === "github" && { githubId: String(id) }),
                ...(account?.provider === "google" && { googleId: id }),
              },
            });

            return true;
          }

          // create user
          return await createUser({
            email: sanitizeEmail(profile?.email || ""),
            name: profile?.name,
            image: account?.provider === "github" ? profile?.avatar_url : profile?.picture,
            ...(account?.provider === "github" && { githubId: String(id) }),
            ...(account?.provider === "google" && { googleId: id }),
          });
        }
      }

      // otherwise, allow sign in
      return true;
    },
    jwt: async ({ token, user, account, profile }) => {
      // account is only available on the first sign in
      if (account) {
        if (account.provider === "github" || account.provider === "google") {
          // look up user in db
          const id = account.provider === "github" ? profile?.id : profile?.sub;
          if (!id) return {};
          const userFromDb = await prisma.user.findUnique({
            where: {
              ...(account.provider === "github" ? { githubId: String(id) } : { googleId: id }),
            },
            select: { id: true, email: true },
          });
          if (!userFromDb) return {};
          token.user_id = userFromDb.id;
          return token;
        }

        // attach user id to token if credentials provider
        token.user_id = user.id;
      }

      return token;
    },
    session: async ({ session, token }) => {
      // attach token.id to session
      if (token && session) {
        session.user.id = token.user_id as string;
      }

      console.log(session);
      return session;
    },
  },
  pages: { signIn: "/login", signOut: "/login", error: "/login" },
});
