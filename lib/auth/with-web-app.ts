import { after, NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { restashError } from "@/lib/utils/restash-error";

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

export const withWebApp = (handler: WithTeamHandler) => {
  return async (req: NextRequest, { params }: Params): Promise<NextResponse> => {
    try {
      const session = await auth();

      if (!session) {
        // check for Bearer token in the request headers
        // this is for API key authentication if the user is using the API instead of the web app
        const secretKey = req.headers.get("Authorization")?.split(" ")[1];
        if (!secretKey) return restashError("No API key provided.", 401);

        const key = await prisma.apiKey.findFirst({
          where: { secretKey },
          select: { teamId: true, id: true },
        });

        if (!key) return restashError("Invalid API key.", 401);

        // update api key last used data
        after(async () => {
          await prisma.apiKey.update({
            where: { id: key.id },
            data: { lastUsedAt: new Date() },
          });
        });

        // continue to handler with the team id
        return handler({ req, params, team: { id: key.teamId } });
      }

      if (!session?.user) return restashError("No user found.", 401);

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, teams: { select: { id: true } } },
      });

      if (!user) return restashError("No user found.", 401);

      const { teams, ...rest } = user;

      return handler({ req, params, user: { ...rest }, team: teams[0] });
    } catch (e) {
      console.error("Authentication error: ", e);
      return restashError("Internal server error", 500);
    }
  };
};
