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

export const withTeam = (handler: WithTeamHandler) => {
  return async (req: NextRequest, { params }: Params): Promise<NextResponse> => {
    try {
      const session = await auth();

      if (!session) {
        // check for Bearer token in the request headers
        // this is for API key authentication if the user is using the API instead of the web app
        const secretKey = req.headers.get("Authorization")?.split(" ")[1];
        const publicKey = req.headers.get("x-api-key");
        if (!secretKey && !publicKey) return restashError("No API key provided.", 401);

        const key = await prisma.apiKey.findFirst({
          where: {
            ...(publicKey && { publicKey }),
            ...(secretKey && { secretKey }),
          },
          select: { teamId: true, origins: true, id: true },
        });

        if (!key) return restashError("Invalid API key.", 401);

        if (publicKey) {
          // check if the domain is authorized
          const origin = req.headers.get("origin");
          if (!origin) return restashError("No origin present.", 401);
          const isAuthorized = key.origins.some((o) => o === origin);
          if (!isAuthorized) return restashError("Origin not authorized.", 401);
        }

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
