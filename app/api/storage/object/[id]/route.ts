import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { upbaseError } from "@/lib/utils/upbase-error";

export const GET = withTeam(async ({ params, team }) => {
  const { id } = await params;
  const object = await prisma.storageObject.findFirst({
    where: { id, teamId: team.id },
  });

  if (!object) {
    return upbaseError("Object not found", 404);
  }

  if (object.storageType === "folder") {
    return upbaseError("Object is a folder", 400);
  }

  return NextResponse.json(object);
});
