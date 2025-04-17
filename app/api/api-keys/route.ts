import { withTeam } from "@/lib/auth/with-team";
import { restashError } from "@/lib/utils/restash-error";
import prisma from "@/db/prisma";
import { NextResponse } from "next/server";

export const GET = withTeam(async ({ team }) => {
  try {
    const keys = await prisma.apiKey.findMany({ where: { teamId: team.id } });

    return NextResponse.json(
      keys.map((key) => ({
        id: key.id,
        name: key.name,
        origins: key.origins,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
        publicKey: key.publicKey,
        secretKey: `${key.secretKey.substring(0, 8)}...${key.secretKey.slice(-4)}`,
      })),
    );
  } catch (e) {
    console.error(e);
    return restashError("Failed to get API keys", 500);
  }
});
