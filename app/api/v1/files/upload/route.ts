// Server side route for uploading files up to 4MB (most uploads will take place on the client)
import { restashError } from "@/utils/restash-error";
import { withSecretKey } from "@/lib/auth/with-secret-key";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3/client";
import prisma from "@/db/prisma";
import { FREE_PLAN_STORAGE_LIMIT } from "@/utils/limits";
import { NextResponse } from "next/server";
import { z } from "zod";
import { fileTypeFromBuffer } from "file-type";

export const maxDuration = 30; // 60 seconds

const schema = z.object({
  name: z.string().min(1).max(100),
  type: z.string(),
  size: z.number().min(0),
  path: z.string().max(200).optional(),
});

const metadataSchema = z.record(z.string().max(100), z.string().max(1000)).optional();

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

    const metadataString = formData.get("metadata");
    let metadata = {};

    if (metadataString && typeof metadataString === "string") {
      try {
        metadata = JSON.parse(metadataString);
      } catch {
        return restashError("Metadata is invalid", 400);
      }
      const parsedMetadata = metadataSchema.safeParse(metadata);
      if (!parsedMetadata.success) {
        return restashError("Metadata is invalid", 400);
      }
    }

    const name = formData.get("name")?.toString() || file.name;
    let path = formData.get("path")?.toString() || "";

    const arrayBuffer = await file.arrayBuffer();
    const fileType = await fileTypeFromBuffer(arrayBuffer);

    if (file.size > 4 * 1024 * 1024) {
      // 4MB limit for server uploads
      return restashError("File size exceeds 4MB limit", 400);
    }

    const uploadRequest: UploadRequest = {
      file: {
        name,
        type: fileType?.mime || file.type,
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

    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: path,
      Body: buffer,
      ContentType: fileType?.mime || file.type,
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

    const hasMetadata = Object.keys(metadata).length > 0;

    const newFile = await prisma.storageObject.upsert({
      where: { key: path },
      update: {
        name,
        size: file.size,
        contentType: fileType?.mime || file.type,
        storageType: "file",
        url: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${path}`,
        ...(hasMetadata && { metadata }),
      },
      create: {
        name,
        key: path,
        team: { connect: { id: team.id } },
        storageType: "file",
        size: file.size,
        contentType: fileType?.mime || file.type,
        url: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${path}`,
        ...(hasMetadata && { metadata }),
      },
    });

    return NextResponse.json({
      id: newFile.id,
      url: newFile.url,
      key: newFile.key,
      name: newFile.name,
      size: newFile.size,
      contentType: newFile.contentType,
      metadata: newFile.metadata || null,
    });
  } catch (e) {
    console.error(e);
    return restashError("Internal server error", 500);
  }
});
