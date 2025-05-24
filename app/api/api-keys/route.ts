import { withWebApp } from "@/lib/auth/with-web-app";
import { restashError } from "@/utils/restash-error";
import prisma from "@/db/prisma";
import { NextResponse } from "next/server";

export const GET = withWebApp(async ({ team }) => {
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
