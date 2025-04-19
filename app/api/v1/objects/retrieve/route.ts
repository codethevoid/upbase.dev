import { withSecretKey } from "@/lib/auth/with-secret-key";
import { restashError } from "@/lib/utils/restash-error";
import { restashResponse } from "@/lib/utils/restash-response";
import prisma from "@/db/prisma";

export const GET = withSecretKey(async ({ req, team }) => {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const key = req.nextUrl.searchParams.get("key");

    if (!id && !key) {
      return restashError("Object ID or key is required", 400);
    }

    const object = await prisma.storageObject.findFirst({
      where: { ...(id && { id }), ...(key && { key }), teamId: team.id },
      select: {
        createdAt: true,
        updatedAt: true,
        id: true,
        name: true,
        size: true,
        key: true,
        contentType: true,
        storageType: true,
      },
    });

    if (!object) {
      return restashError("Object not found", 404);
    }

    return restashResponse("ok", 200, { object: { ...object } });
  } catch (e) {
    console.error(e);
    return restashError("Failed to get object", 500);
  }
});
