import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { NextResponse } from "next/server";

export const GET = withTeam(async ({ req, team }) => {
  const key = req.nextUrl.searchParams.get("key") || "/";
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "100";
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const prefix = `${team.id}`;
  const fullKey = key === "/" ? `${prefix}/` : `${key}`;

  if (!fullKey.startsWith(prefix)) {
    // if it does not, we will just throw an error because
    // we dont want the user accessing other teams data
    return NextResponse.json({ message: "Invalid base key", objects: [] }, { status: 400 });
  }

  const count: [{ count: number }] = await prisma.$queryRaw`
      SELECT COUNT(*) as "count"
      FROM "StorageObject"
      WHERE "teamId" = ${team.id}
        AND key LIKE ${fullKey + "%"}
        AND key ~ ('^' || ${fullKey} || '[^/]+/?$')
  `;

  const objects = await prisma.$queryRaw`
      SELECT *
      FROM "StorageObject"
      WHERE "teamId" = ${team.id}
        AND key LIKE ${fullKey + "%"}
        AND key ~ ('^' || ${fullKey} || '[^/]+/?$')
      ORDER BY "updatedAt" DESC
          LIMIT ${parseInt(limit)}
      OFFSET ${offset}
  `;

  return NextResponse.json({ objects, total: Number(count[0].count) });
});
