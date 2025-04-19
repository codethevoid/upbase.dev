import { after, NextRequest, NextResponse } from "next/server";
import { restashError } from "@/lib/utils/restash-error";
import prisma from "@/db/prisma";
import { ratelimit } from "@/lib/upstash/rate-limit";

type Params = { params: Promise<Record<string, string>> };

type WithPublicKeyHandler = ({
  req,
  params,
  team,
}: {
  req: NextRequest;
  params: Params["params"];
  team: { id: string; requiresSignature: boolean; publicKey: string; secretKey: string };
}) => Promise<NextResponse>;

export const withPublicKey = (handler: WithPublicKeyHandler) => {
  return async (req: NextRequest, { params }: Params): Promise<NextResponse> => {
    try {
      // Check for Bearer token in the request headers
      const publicKey = req.headers.get("x-api-key");
      if (!publicKey) return restashError("No API key provided.", 401);

      // validate public key
      const key = await prisma.apiKey.findUnique({
        where: { publicKey },
        select: {
          id: true,
          teamId: true,
          origins: true,
          secretKey: true,
          team: { select: { requiresSignature: true } },
        },
      });

      if (!key) return restashError("Invalid API key.", 401);

      // validate origin
      const origin = req.headers.get("origin");
      if (!origin) return restashError("Invalid request", 401);

      const isValidOrigin = key.origins.some((o) => o === origin);
      if (!isValidOrigin) {
        return restashError(
          `Requests are not allowed from ${origin}. Please add it to your authorized origins.`,
          401,
        );
      }

      const { success } = await ratelimit({ requests: 100, duration: "1m" }).limit(
        `public-key:${key.id}`,
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
        team: {
          id: key.teamId,
          requiresSignature: key.team.requiresSignature,
          publicKey,
          secretKey: key.secretKey,
        },
      });
    } catch (e) {
      console.error(e);
      return restashError("Internal server error", 500);
    }
  };
};
