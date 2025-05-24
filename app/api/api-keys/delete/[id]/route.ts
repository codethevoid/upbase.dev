import { NextResponse } from "next/server";
import { restashError } from "@/utils/restash-error";
import prisma from "@/db/prisma";
import { withWebApp } from "@/lib/auth/with-web-app";

export const DELETE = withWebApp(async ({ params, team }) => {
  try {
    const { id } = (await params) as { id: string };

    // delete api key
    await prisma.apiKey.delete({ where: { id, teamId: team.id } });

    return NextResponse.json({ message: "API key deleted" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return restashError("Failed to delete API key", 500);
  }
});
