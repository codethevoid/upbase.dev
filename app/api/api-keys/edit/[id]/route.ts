import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import { upbaseError } from "@/lib/utils/upbase-error";
import { apiKeySchema } from "@/lib/zod";
import prisma from "@/db/prisma";

type EditApiKeyRequest = {
  name: string;
  origins?: string;
};

export const PATCH = withTeam(async ({ req, team, params }) => {
  try {
    const { name, origins }: EditApiKeyRequest = await req.json();
    const { id } = await params;

    if (apiKeySchema.safeParse({ name, origins }).error) {
      return upbaseError("Invalid request", 400);
    }

    const exists = await prisma.apiKey.findFirst({
      where: { name: name.trim(), teamId: team.id, id: { not: id } },
    });

    if (exists) {
      return upbaseError("API key with this name already exists", 400);
    }

    await prisma.apiKey.update({
      where: { id, teamId: team.id },
      data: {
        name: name.trim(),
        ...(origins ? { origins: origins.split(",").filter((origin) => origin) } : { origins: [] }),
      },
    });

    return NextResponse.json({ message: "API key edited" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return upbaseError("Failed to create API key", 500);
  }
});
