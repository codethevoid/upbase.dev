import { NextResponse } from "next/server";
import { z } from "zod";
import { withTeam } from "@/lib/auth/with-team";
import { restashError } from "@/lib/utils/restash-error";
import prisma from "@/db/prisma";

const teamNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" }),
});

export const PATCH = withTeam(async ({ req, params, team }) => {
  try {
    const { id } = (await params) as { id: string };
    const { name }: { name: string } = await req.json();

    if (teamNameSchema.safeParse({ name }).error) {
      return restashError("Invalid team name", 400);
    }

    if (team.id !== id) {
      return restashError("You are not authorized to edit this team", 403);
    }

    // update the team name
    await prisma.team.update({
      where: { id },
      data: { name: name.trim() },
    });

    return NextResponse.json({ message: "Team name updated successfully" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return restashError("Failed to update team name", 500);
  }
});
