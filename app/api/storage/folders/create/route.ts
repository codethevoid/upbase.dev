import { NextResponse } from "next/server";
import { withWebApp } from "@/lib/auth/with-web-app";
import { folderSchema } from "@/lib/zod";
import prisma from "@/db/prisma";

type CreateFolderRequest = {
  name: string;
  baseKey: string;
};

const getFullKey = (baseKey: string, teamId: string, folderName: string) => {
  const prefix = `${teamId}`;
  const fullKey = baseKey === "/" ? `${prefix}/` : `${baseKey}`;

  // we need to make sure baseKey starts with the team prefix
  // to prevent directory traversal attacks
  // and also that it does not contain double slashes
  if (!fullKey.startsWith(prefix) || /\/\//.test(fullKey)) {
    // if it does not, we will just throw an error because
    // we have no idea what the user is trying to do
    throw new Error("Invalid base key");
  }

  return `${fullKey}${folderName}`;
};

export const POST = withWebApp(async ({ req, team }) => {
  try {
    const { name, baseKey } = (await req.json()) as CreateFolderRequest;
    const fullKey = getFullKey(baseKey, team.id, name);

    const parsed = folderSchema.safeParse({ name });
    if (parsed.error) {
      return NextResponse.json({ message: "Invalid folder name" }, { status: 400 });
    }

    console.log(fullKey);

    // check if the folder already exists
    const existingFolder = await prisma.storageObject.findFirst({
      where: {
        key: { startsWith: fullKey },
        teamId: team.id,
      },
    });

    if (existingFolder) {
      return NextResponse.json({ message: "Folder or key already exists" }, { status: 400 });
    }

    // create the folder
    await prisma.storageObject.create({
      data: {
        name,
        key: fullKey + "/",
        team: { connect: { id: team.id } },
        storageType: "folder",
      },
    });

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});
