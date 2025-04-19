import { after, NextRequest, NextResponse } from "next/server";
import { restashError } from "@/lib/utils/restash-error";
import prisma from "@/db/prisma";
import { ratelimit } from "@/lib/upstash/rate-limit";

type Params = { params: Promise<Record<string, string>> };

type WithSecretKeyHandler = ({
  req,
  params,
  team,
}: {
  req: NextRequest;
  params: Params["params"];
  team: { id: string; secretKey: string; publicKey: string };
}) => Promise<NextResponse>;

export const withSecretKey = (handler: WithSecretKeyHandler) => {
  return async (req: NextRequest, { params }: Params): Promise<NextResponse> => {
    try {
      // Check for Bearer token in the request headers
      const secretKey = req.headers.get("Authorization")?.split(" ")[1];
      if (!secretKey) return restashError("No API key provided.", 401);

      // validate secret key
      const key = await prisma.apiKey.findUnique({
        where: { secretKey },
        select: { id: true, teamId: true, publicKey: true },
      });

      if (!key) return restashError("Invalid API key.", 401);

      const { success } = await ratelimit({ requests: 600, duration: "1m" }).limit(
        `secret-key:${key.id}`,
      );

      if (!success) {
        return restashError("Rate limit exceeded. Try again later.", 429);
      }

      // update api key last used data
      after(async () => {
        await prisma.apiKey.update({
          where: { id: key.id },
          data: { lastUsedAt: new Date() },
        });
      });

      return handler({
        req,
        params,
        team: { id: key.teamId, secretKey, publicKey: key.publicKey },
      });
    } catch (e) {
      console.error(e);
      return restashError("Internal server error", 500);
    }
  };
};
