import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { restashError } from "@/lib/utils/restash-error";

export const GET = withTeam(async ({ params, team }) => {
  const { id } = await params;
  const object = await prisma.storageObject.findFirst({
    where: { id, teamId: team.id },
  });

  if (!object) {
    return restashError("Object not found", 404);
  }

  if (object.storageType === "folder") {
    return restashError("Object is a folder", 400);
  }

  return NextResponse.json(object);
});
