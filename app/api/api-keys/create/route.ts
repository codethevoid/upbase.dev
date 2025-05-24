import { NextResponse } from "next/server";
import { withWebApp } from "@/lib/auth/with-web-app";
import { restashError } from "@/utils/restash-error";
import { apiKeySchema } from "@/lib/zod";
import { nanoid } from "@/utils/alphabet";
import prisma from "@/db/prisma";

type CreateApiKeyRequest = {
  name: string;
  origins?: string;
};

export const POST = withWebApp(async ({ req, team }) => {
  try {
    const { name, origins }: CreateApiKeyRequest = await req.json();

    if (apiKeySchema.safeParse({ name, origins }).error) {
      return restashError("Invalid request", 400);
    }

    if (await prisma.apiKey.findFirst({ where: { name: name.trim(), teamId: team.id } })) {
      return restashError("API key with this name already exists", 400);
    }

    let secretKey = `sk_${nanoid(48)}`;
    while (await prisma.apiKey.findUnique({ where: { secretKey } })) {
      secretKey = `sk_${nanoid(48)}`;
    }

    let publicKey = `pk_${nanoid(48)}`;
    while (await prisma.apiKey.findUnique({ where: { publicKey } })) {
      publicKey = `pk_${nanoid(48)}`;
    }

    await prisma.apiKey.create({
      data: {
        name: name.trim(),
        secretKey,
        publicKey,
        ...(origins && { origins: origins.split(",").filter((origin) => origin) }),
        team: { connect: { id: team.id } },
      },
    });

    return NextResponse.json({ message: "API key created", secretKey }, { status: 200 });
  } catch (e) {
    console.error(e);
    return restashError("Failed to create API key", 500);
  }
});
