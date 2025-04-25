import { withSecretKey } from "@/lib/auth/with-secret-key";
import { restashError } from "@/lib/utils/restash-error";
import prisma from "@/db/prisma";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3/client";
import { NextResponse } from "next/server";

export const DELETE = withSecretKey(async ({ req, team }) => {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const key = req.nextUrl.searchParams.get("key");

    if (!id && !key) {
      return restashError("Object ID or key is required", 400);
    }

    const object = await prisma.storageObject.findFirst({
      where: { ...(id && { id }), ...(key && { key }), teamId: team.id },
    });

    if (!object) {
      return restashError("Object not found", 404);
    }

    if (object.storageType === "folder") {
      return restashError("We don't support deleting folders yet.", 400);
    }

    // Delete the object from S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: object.key,
    });

    await s3Client.send(command);

    // Delete the object from the database
    await prisma.storageObject.delete({ where: { id: object.id } });

    return NextResponse.json({ deleted: true, file: object.id });
  } catch (e) {
    console.error(e);
    return restashError("Failed to delete object", 500);
  }
});
