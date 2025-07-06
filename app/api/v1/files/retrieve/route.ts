import { withSecretKey } from "@/lib/auth/with-secret-key";
import { restashError } from "@/utils/restash-error";
import prisma from "@/db/prisma";
import { NextResponse } from "next/server";

export const GET = withSecretKey(async ({ req, team }) => {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const key = req.nextUrl.searchParams.get("key");

    if (!id && !key) {
      return restashError("File ID or key is required", 400);
    }

    const object = await prisma.storageObject.findFirst({
      where: { ...(id && { id }), ...(key && { key }), teamId: team.id, storageType: "file" },
      select: {
        createdAt: true,
        updatedAt: true,
        id: true,
        name: true,
        size: true,
        key: true,
        url: true,
        contentType: true,
        metadata: true,
      },
    });

    if (!object) {
      return restashError("File not found", 404);
    }

    return NextResponse.json(object);
  } catch (e) {
    console.error(e);
    return restashError("Internal server error", 500);
  }
});
