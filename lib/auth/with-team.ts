import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { upbaseError } from "@/lib/utils/upbase-error";

type Params = { params: Promise<Record<string, string>> };

type WithTeamHandler = ({
  req,
  params,
  user,
  team,
}: {
  req: NextRequest;
  params: Params["params"];
  user?: { id: string; email: string };
  team: { id: string };
}) => Promise<NextResponse>;

export const withTeam = (handler: WithTeamHandler) => {
  return async (req: NextRequest, { params }: Params): Promise<NextResponse> => {
    try {
      const session = await auth();

      if (!session) {
        // check for Bearer token in the request headers
        // this is for API key authentication if the user is using the API instead of the web app
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return upbaseError("No API key provided.", 401);

        // need to add logic to look up api key and get team id
        const key = await prisma.apiKey.findUnique({
          where: { key: token },
          select: { teamId: true, expires: true },
        });

        if (!key) return upbaseError("Invalid API key.", 401);

        // make sure key is not expired
        const now = new Date();
        if (key.expires) {
          if (new Date(key.expires).getTime() < now.getTime()) {
            return upbaseError("API key has expired.", 401);
          }
        }

        // continue to handler with the team id
        return handler({ req, params, team: { id: key.teamId } });
      }

      if (!session?.user) return upbaseError("No user found.", 401);

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, teams: { select: { id: true } } },
      });

      if (!user) return upbaseError("No user found.", 401);

      const { teams, ...rest } = user;

      return handler({ req, params, user: { ...rest }, team: teams[0] });
    } catch (e) {
      console.error("Authentication error: ", e);
      return upbaseError("Internal server error", 500);
    }
  };
};
