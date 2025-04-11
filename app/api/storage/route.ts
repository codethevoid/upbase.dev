import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { NextResponse } from "next/server";

export const GET = withTeam(async ({ req, team }) => {
  const key = req.nextUrl.searchParams.get("key") || "/";
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = 100;
  const prefix = `/${team.id}`;
  const fullKey = key === "/" ? `${prefix}/` : `${key}/`;
  console.log(fullKey);

  const objects = await prisma.$queryRaw`
      SELECT *
      FROM "StorageObject"
      WHERE "teamId" = ${team.id}
        AND key LIKE ${fullKey + "%"}
        AND key ~ ('^' || ${fullKey} || '[^/]+/?$')
  `;

  return NextResponse.json(objects);
});
