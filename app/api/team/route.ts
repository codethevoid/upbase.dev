import { withTeam } from "@/lib/auth/with-team";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { upbaseError } from "@/lib/utils/upbase-error";

export const GET = withTeam(async ({ team }) => {
  const teamInfo = await prisma.team.findUnique({
    where: { id: team.id },
    select: { name: true, storageObjects: { select: { size: true, storageType: true } } },
  });

  if (!teamInfo) return upbaseError("Team not found", 404);

  const usage = teamInfo.storageObjects.reduce((acc, obj) => acc + ((obj.size as number) || 0), 0);

  return NextResponse.json({ id: team.id, name: teamInfo.name, usage });
});
