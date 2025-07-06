import { restashError } from "@/utils/restash-error";
import { withPublicKey } from "@/lib/auth/with-public-key";
import { redis } from "@/lib/upstash/redis";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3/client";
import prisma from "@/db/prisma";
import { NextResponse } from "next/server";

type ConfirmUploadRequest = {
  confirmToken: string;
};

export const POST = withPublicKey(async ({ team, req }) => {
  try {
    const { confirmToken }: ConfirmUploadRequest = await req.json();
    if (!confirmToken) {
      return restashError("Confirm token is required", 400);
    }

    // check if the token is valid
    const session = await redis.get(`pending_upload:${team.id}:${confirmToken}`);
    if (!session) {
      return restashError("Invalid or expired confirm token", 400);
    }

    const {
      teamId,
      name,
      size,
      type,
      key,
      metadata = {},
    } = session as {
      teamId: string;
      name: string;
      size: number;
      type?: string;
      key: string;
      metadata: Record<string, string>;
    };

    if (!teamId || !name || !size || !key) {
      return restashError("Invalid session data", 400);
    }

    // get file information directly from s3 to make sure it matched redis data

    const command = new HeadObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    try {
      const fileInfo = await s3Client.send(command);
      if (!fileInfo) {
        return restashError("File not found", 404);
      }
    } catch (e) {
      console.error(e);
      return restashError("File not found", 404);
    }

    // delete the session from redis
    await redis.del(`pending_upload:${team.id}:${confirmToken}`);

    // break the key into parts and check if subfolders exist
    // if not, create them
    // start at the base and keep adding subfolders
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

    const newFile = await prisma.storageObject.upsert({
      where: { key },
      update: {
        name,
        size,
        contentType: type,
        storageType: "file",
        url: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${key}`,
        ...(Object.keys(metadata)?.length > 0 && { metadata }),
      },
      create: {
        name,
        size,
        contentType: type,
        url: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${key}`,
        ...(Object.keys(metadata)?.length > 0 && { metadata }),
        key,
        storageType: "file",
        team: { connect: { id: teamId } },
      },
    });

    return NextResponse.json({
      id: newFile.id,
      name: newFile.name,
      url: newFile.url,
      size: newFile.size,
      contentType: newFile.contentType,
      key: newFile.key,
      metadata: newFile.metadata,
    });
  } catch (e) {
    console.error(e);
    return restashError("An error occurred while confirming the upload", 500);
  }
});
