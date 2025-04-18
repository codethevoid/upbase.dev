import { NextResponse } from "next/server";
import { withWebApp } from "@/lib/auth/with-web-app";
import { restashError } from "@/lib/utils/restash-error";
import prisma from "@/db/prisma";

export const GET = withWebApp(async ({ team, params }) => {
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

    if (!key) return restashError("API key not found", 404);

    const { secretKey, ...rest } = key;

    return NextResponse.json({
      secretKey: `${secretKey.substring(0, 8)}...${secretKey.slice(-4)}`,
      ...rest,
    });
  } catch (e) {
    console.error(e);
    return restashError("Failed to get API key", 500);
  }
});
