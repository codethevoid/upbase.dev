import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import { upbaseError } from "@/lib/utils/upbase-error";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3/client";
import prisma from "@/db/prisma";
import { FREE_PLAN_FILE_SIZE_LIMIT, FREE_PLAN_STORAGE_LIMIT } from "@/lib/utils/limits";

type PresignedUrlsRequest = {
  files: {
    name: string;
    type: string;
    size: number;
    path: string;
  }[];
  baseKey: string;
};

const getFilePath = (path: string, filename: string) => {
  if (!path) return filename;
  let newPath = path;

  if (path.startsWith("./")) {
    newPath = path.substring(2);
  } else if (path.startsWith("/")) {
    newPath = path.substring(1);
  }

  return newPath;
};

export const POST = withTeam(async ({ req, team }) => {
  try {
    const body = (await req.json()) as PresignedUrlsRequest;
    const { files } = body;
    let { baseKey } = body;
    if (baseKey === "/") {
      // append team id to base key
      baseKey = `${team.id}/`;
    }

    if (!files || files.length === 0 || !Array.isArray(files)) {
      return upbaseError("Files information is required", 400);
    }

    if (!baseKey || !baseKey.endsWith("/") || !baseKey.startsWith(`${team.id}/`)) {
      return upbaseError("Base key is either invalid or not provided", 400);
    }

    // make sure no files are larger than 1GB
    const maxSize = FREE_PLAN_FILE_SIZE_LIMIT; // 1GB
    files.forEach((file) => {
      if (file.size > maxSize) {
        return upbaseError(`File ${file.name} is larger than 1GB`, 400);
      }
    });

    // get total size of all files
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    // get total size the team has used
    const storageObjects = await prisma.storageObject.aggregate({
      where: { teamId: team.id },
      _sum: { size: true },
    });

    if ((storageObjects?._sum?.size || 0) + totalSize > FREE_PLAN_STORAGE_LIMIT) {
      return upbaseError("You have exceeded your storage limit of 5GB", 400);
    }

    // generate file keys
    // replace spaces with underscores
    // replace any other problematic characters
    // keep alphanumeric characters, dashed, dots, hyphens, and underscores
    const filekeys = files.map((file) => {
      return `${baseKey}${getFilePath(file.path, file.name)}`;
    });

    const presignedUrls = await Promise.all(
      files.map(async (file, index) => {
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: filekeys[index],
          ContentType: file.type,
        });

        return {
          signedUrl: await getSignedUrl(s3Client, command, { expiresIn: 120 * 60 }),
          key: filekeys[index],
          index,
        }; // 2 hours
      }),
    );

    console.log(presignedUrls);

    return NextResponse.json(presignedUrls);
  } catch (e) {
    console.error(e);
    return upbaseError("Something went wrong", 500);
  }
});
