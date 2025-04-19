import { NextResponse } from "next/server";
import { withWebApp } from "@/lib/auth/with-web-app";
import prisma from "@/db/prisma";
import { restashError } from "@/lib/utils/restash-error";

type InsertObjectRequest = {
  name: string;
  key: string;
  size: number;
  type: string;
};

export const POST = withWebApp(async ({ req, team }) => {
  const { name, key, size, type } = (await req.json()) as InsertObjectRequest;

  // break the key into parts and check if subfolders exist
  // if not, create them
  // start at the base and keep adding subfolders
  if (!key.startsWith(`${team.id}/`)) {
    return restashError("Invalid base key", 400);
  }
  const parts = key.split("/");
  let currentKey = ``; // should have team id in it already

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

  const url = `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${key}`;

  await prisma.storageObject.upsert({
    where: { key },
    update: { name, size, contentType: type, url, storageType: "file" },
    create: {
      name,
      size,
      contentType: type,
      url,
      key,
      storageType: "file",
      team: { connect: { id: team.id } },
    },
  });

  return NextResponse.json({ message: "ok" }, { status: 200 });
});
