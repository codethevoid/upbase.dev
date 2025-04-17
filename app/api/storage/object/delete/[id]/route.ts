import { withTeam } from "@/lib/auth/with-team";
import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/db/prisma";
import { s3Client } from "@/lib/s3/client";
import { restashError } from "@/lib/utils/restash-error";

export const DELETE = withTeam(async ({ team, params }) => {
  try {
    const { id } = await params;

    const storageObject = await prisma.storageObject.findFirst({
      where: { id, teamId: team.id },
    });

    if (!storageObject) {
      return restashError("Object not found", 404);
    }

    if (storageObject.storageType == "folder") {
      return restashError("Cannot delete folder yet", 400);
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: storageObject.key,
    });

    try {
      await s3Client.send(command);
      await prisma.storageObject.delete({ where: { id } });
    } catch (e) {
      console.error(e);
      return restashError("Failed to delete object", 500);
    }

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return restashError("Failed to delete object", 500);
  }
});
