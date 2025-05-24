import { withWebApp } from "@/lib/auth/with-web-app";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { restashError } from "@/utils/restash-error";

export const GET = withWebApp(async ({ team }) => {
  const teamInfo = await prisma.team.findUnique({
    where: { id: team.id },
    select: {
      name: true,
      requiresSignature: true,
      storageObjects: { select: { size: true, storageType: true } },
    },
  });

  if (!teamInfo) return restashError("Team not found", 404);

  const usage = teamInfo.storageObjects.reduce((acc, obj) => acc + ((obj.size as number) || 0), 0);

  return NextResponse.json({
    id: team.id,
    name: teamInfo.name,
    usage,
    requiresSignature: teamInfo.requiresSignature,
  });
});
