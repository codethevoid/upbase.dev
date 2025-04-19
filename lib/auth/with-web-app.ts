import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { restashError } from "@/lib/utils/restash-error";

type Params = { params: Promise<Record<string, string>> };

type WithWebAppHandler = ({
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

export const withWebApp = (handler: WithWebAppHandler) => {
  return async (req: NextRequest, { params }: Params): Promise<NextResponse> => {
    try {
      const session = await auth();

      if (!session?.user) return restashError("No user found.", 401);

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        // will need to change this in the future to select default team (or current team)
        // once we add the option for multiple teams
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
