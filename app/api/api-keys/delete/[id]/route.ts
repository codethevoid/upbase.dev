import { NextResponse } from "next/server";
import { upbaseError } from "@/lib/utils/upbase-error";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const DELETE = withTeam(async ({ params, team }) => {
  try {
    const { id } = (await params) as { id: string };

    // delete api key
    await prisma.apiKey.delete({ where: { id, teamId: team.id } });

    return NextResponse.json({ message: "API key deleted" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return upbaseError("Failed to delete API key", 500);
  }
});
