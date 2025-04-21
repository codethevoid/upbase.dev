import { withPublicKey } from "@/lib/auth/with-public-key";
import { restashError } from "@/lib/utils/restash-error";
import { FREE_PLAN_FILE_SIZE_LIMIT, FREE_PLAN_STORAGE_LIMIT } from "@/lib/utils/limits";
import { formatBytes } from "@/lib/utils/format-bytes";
import prisma from "@/db/prisma";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "@/lib/s3/client";
import { NextResponse } from "next/server";
import { redis } from "@/lib/upstash/redis";
import { nanoid } from "@/lib/utils/alphabet";
import { z } from "zod";
import { createHmac } from "crypto";

const schema = z.object({
  name: z.string().min(1),
  type: z.string().optional(),
  size: z.number().min(0),
  path: z.string().optional(),
});

type GeneratePresignedUrlRequest = {
  file: {
    name: string;
    type: string;
    size: number;
    path?: string;
  };
  signature?: string;
  payload?: string;
};

export const POST = withPublicKey(async ({ team, req }) => {
  try {
    const { file, signature, payload }: GeneratePresignedUrlRequest = await req.json();
    if (!file) {
      return restashError("File information is required", 400);
    }

    // verify signature if required
    if (team.requiresSignature) {
      // TODO: verify signature
      if (!signature || !payload) {
        return restashError("Signature is required", 400);
      }

      // verify payload with users secret key
      const expectedSignature = createHmac("sha256", team.secretKey).update(payload).digest("hex");
      if (expectedSignature !== signature) {
        return restashError("Invalid signature", 401);
      }
    }

    const parsed = schema.safeParse(file);
    if (!parsed.success) {
      return restashError("File information is invalid", 400);
    }

    let { path } = file;
    path = path || file.name;

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
    if (!path.endsWith(file.name)) {
      if (path.endsWith("/")) {
        path += file.name;
      } else {
        path = `${path}/${file.name}`;
      }
    }

    // check size limit
    if (file.size > FREE_PLAN_FILE_SIZE_LIMIT) {
      return restashError(
        `File size is larger than the ${formatBytes(FREE_PLAN_FILE_SIZE_LIMIT)} limit`,
        400,
      );
    }

    // check total storage of the team
    const storageObjects = await prisma.storageObject.aggregate({
      where: { teamId: team.id },
      _sum: { size: true },
    });

    const currentStorageSize = storageObjects._sum.size || 0;

    if (currentStorageSize + file.size > FREE_PLAN_STORAGE_LIMIT) {
      return restashError(
        `You cannot exceed the ${formatBytes(FREE_PLAN_STORAGE_LIMIT)} storage limit.`,
        400,
      );
    }

    // generate presigned URL
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.S3_BUCKET!,
      Key: path,
      Conditions: [
        { bucket: process.env.S3_BUCKET! },
        ["content-length-range", 0, Math.ceil(file.size * 1.05)],
        ["starts-with", "$key", `${team.id}/`],
      ],
      Expires: 300, // 300 seconds or 5 minutes
    });

    const confirmToken = nanoid(32);
    // insert confirmation record in redis
    await redis.set(
      `pending_upload:${team.id}:${confirmToken}`,
      JSON.stringify({
        teamId: team.id,
        name: file.name,
        size: file.size,
        type: file.type,
        key: path,
      }),
      { ex: 3600 * 2 }, // 24 hours just in case the upload takes a long time
    );

    return NextResponse.json({ url, fields, confirmToken });
  } catch (e) {
    console.error(e);
    return restashError("Failed to generate presigned URL", 500);
  }
});
