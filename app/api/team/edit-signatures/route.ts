import { withWebApp } from "@/lib/auth/with-web-app";
import { restashError } from "@/utils/restash-error";
import prisma from "@/db/prisma";
import { restashResponse } from "@/utils/restash-response";

export const PATCH = withWebApp(async ({ req, team }) => {
  try {
    const { requiresSignature }: { requiresSignature: boolean } = await req.json();

    await prisma.team.update({
      where: { id: team.id },
      data: { requiresSignature },
    });

    return restashResponse("Updated team signatures", 200);
  } catch (e) {
    console.error(e);
    return restashError("Failed to update team signatures", 500);
  }
});
