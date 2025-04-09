import { withTeam } from "@/lib/auth/with-team";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const GET = withTeam(async ({ req, team }) => {
  const key = req.nextUrl.searchParams.get("key") || "/";
  const prefix = `/${team.id}`;
  const fullKey = key === "/" ? prefix : `${prefix}${key}`;

  const objects = await prisma.storageObject.findMany({
    where: {
      teamId: team.id,
    },
  });

  return NextResponse.json({ objects });
});
