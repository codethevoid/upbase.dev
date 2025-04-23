// Server side route for uploading files up to 4MB (most uploads will take place on the client)
import { restashError } from "@/lib/utils/restash-error";
import { withSecretKey } from "@/lib/auth/with-secret-key";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3/client";
import prisma from "@/db/prisma";
import { FREE_PLAN_STORAGE_LIMIT } from "@/lib/utils/limits";
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";

export const maxDuration = 30; // 60 seconds

const schema = z.object({
  name: z.string().min(1).max(100),
  type: z.string(),
  size: z.number().min(0),
  path: z.string().max(200).optional(),
});

type UploadRequest = {
  file: {
    name: string;
    type: string;
    size: number;
    path?: string;
  };
};

export const POST = withSecretKey(async ({ team, req }) => {
  try {
    const formData = await req.formData();
    const file = (formData.get("file") as File) || Blob;
    if (!(file instanceof Blob)) {
      return restashError("A valid file is required", 400);
    }

    const name = formData.get("name")?.toString() || file.name || randomBytes(8).toString("hex");
    let path = formData.get("path")?.toString() || "";

    if (file.size > 4 * 1024 * 1024) {
      // 4MB limit for server uploads
      return restashError("File size exceeds 4MB limit", 400);
    }

    const uploadRequest: UploadRequest = {
      file: {
        name,
        type: file.type,
        size: file.size,
        path,
      },
    };

    const parsed = schema.safeParse(uploadRequest.file);
    if (!parsed.success) {
      return restashError("Invalid request", 400);
    }

    path = path || name;

    if (path.startsWith("./")) {
      path = path.substring(2);
    } else if (path.startsWith("/")) {
      path = path.substring(1);
    }

    // append team id to path
    if (!path.startsWith(`${team.id}/`)) {
      path = `${team.id}/${path}`;
    }

    // check if path ends with file name
    if (!path.endsWith(name)) {
      if (path.endsWith("/")) {
        path += name;
      } else {
        path = `${path}/${name}`;
      }
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
      Key: path,
      Body: buffer,
      ContentType: file.type,
    });

    // upload the file to s3
    await s3Client.send(command); // this will throw if upload fails

    // Here we save the file metadata to the database and create required folders
    const parts = path.split("/");
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

    const newFile = await prisma.storageObject.upsert({
      where: { key: path },
      update: {
        name,
        size: file.size,
        contentType: file.type,
        storageType: "file",
        url: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${path}`,
      },
      create: {
        name,
        key: path,
        team: { connect: { id: team.id } },
        storageType: "file",
        size: file.size,
        contentType: file.type,
        url: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${path}`,
      },
    });

    return NextResponse.json({
      id: newFile.id,
      url: newFile.url,
      key: newFile.key,
      name: newFile.name,
      size: newFile.size,
      contentType: newFile.contentType,
    });
  } catch (e) {
    console.error(e);
    return restashError("Internal server error", 500);
  }
});
