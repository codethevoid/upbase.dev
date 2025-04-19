// Server side route for uploading files up to 4MB (most uploads will take place on the client)
import { restashResponse } from "@/lib/utils/restash-response";
import { restashError } from "@/lib/utils/restash-error";
import { withSecretKey } from "@/lib/auth/with-secret-key";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3/client";
import prisma from "@/db/prisma";
import { FREE_PLAN_STORAGE_LIMIT } from "@/lib/utils/limits";

export const maxDuration = 60; // 60 seconds

export const POST = withSecretKey(async ({ team, req }) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    let key = formData.get("key")?.toString();
    if (!file) {
      return restashError("File is required", 400);
    }

    if (file.size > 4 * 1024 * 1024) {
      return restashError("File size exceeds 4MB limit", 400);
    }

    if (!key) {
      key = `${team.id}/${file.name}`;
    }

    if (key.startsWith("./")) {
      key = key.substring(1);
    } else if (key.startsWith("/")) {
      key = key.substring(1);
    }

    if (!key.startsWith(`${team.id}/`)) {
      key = `${team.id}/${key}`;
    }

    const storageObjects = await prisma.storageObject.aggregate({
      where: { teamId: team.id },
      _sum: { size: true },
    });

    if ((storageObjects?._sum.size || 0) + file.size > FREE_PLAN_STORAGE_LIMIT) {
      return restashError(`Total storage size exceeds the ${FREE_PLAN_STORAGE_LIMIT} limit`, 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    // upload the file to s3
    await s3Client.send(command); // this will throw if upload fails

    // Here we save the file metadata to the database and create required folders
    const parts = key.split("/");
    let currentKey = "";

    for (let i = 0; i < parts.length - 1; i++) {
      currentKey += parts[i] + "/";
      const existingFolder = await prisma.storageObject.findFirst({
        where: {
          key: currentKey,
          teamId: team.id,
          storageType: "folder",
        },
      });

      if (!existingFolder) {
        await prisma.storageObject.create({
          data: {
            name: parts[i],
            key: currentKey,
            team: { connect: { id: team.id } },
            storageType: "folder",
          },
        });
      }
    }

    await prisma.storageObject.upsert({
      where: { key },
      update: {
        name: file.name,
        size: file.size,
        contentType: file.type,
        storageType: "file",
        url: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${key}`,
      },
      create: {
        name: file.name,
        key,
        team: { connect: { id: team.id } },
        storageType: "file",
        size: file.size,
        contentType: file.type,
        url: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${key}`,
      },
    });

    return restashResponse("File upload successful", 200, {
      url: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${key}`,
      key,
      name: file.name,
      size: file.size,
      contentType: file.type,
    });
  } catch (e) {
    console.error(e);
    return restashError("Internal server error", 500);
  }
});
