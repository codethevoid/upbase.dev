import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import { upbaseError } from "@/lib/utils/upbase-error";
import prisma from "@/db/prisma";

export const GET = withTeam(async ({ team, params }) => {
  try {
    const { id } = (await params) as { id: string };

    const key = await prisma.apiKey.findFirst({
      where: { id, teamId: team.id },
      select: {
        id: true,
        name: true,
        origins: true,
        createdAt: true,
        lastUsedAt: true,
        publicKey: true,
        secretKey: true,
      },
    });

    if (!key) return upbaseError("API key not found", 404);

    const { secretKey, ...rest } = key;

    return NextResponse.json({
      secretKey: `${secretKey.substring(0, 8)}...${secretKey.slice(-4)}`,
      ...rest,
    });
  } catch (e) {
    console.error(e);
    return upbaseError("Failed to get API key", 500);
  }
});
