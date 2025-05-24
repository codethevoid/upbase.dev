import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/db/prisma";
import bcrypt from "bcryptjs";
import { sanitizeEmail } from "@/utils/santiize-email";
import { restashError } from "@/utils/restash-error";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password }: { email: string; password: string } = body;

    const { error } = schema.safeParse({ email, password });
    if (error) {
      return restashError("Invalid request", 400);
    }

    if (await prisma.user.findUnique({ where: { email: sanitizeEmail(email) } })) {
      return restashError("User already exists", 409);
    }

    await prisma.$transaction(async () => {
      // create user
      const user = await prisma.user.create({
        data: { email: sanitizeEmail(email), password: await bcrypt.hash(password, 10) },
      });

      // create team
      const team = await prisma.team.create({
        data: {
          name: sanitizeEmail(email).split("@")[0],
          user: { connect: { id: user.id } },
        },
      });

      // create root team folder
      await prisma.storageObject.create({
        data: {
          name: "root",
          storageType: "folder",
          key: `${team.id}/`,
          team: { connect: { id: team.id } },
        },
      });
    });

    return NextResponse.json({ message: "Account created successfully" });
  } catch (e) {
    console.error(e);
    return restashError("Failed to create account", 500);
  }
};
