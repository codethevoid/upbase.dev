import { NextResponse } from "next/server";
import { withWebApp } from "@/lib/auth/with-web-app";
import { folderSchema } from "@/lib/zod";
import prisma from "@/db/prisma";
import { restashError } from "@/utils/restash-error";

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
      return restashError("Invalid folder name", 400);
    }

    console.log(fullKey);

    // check if the folder already exists
    const existingFolder = await prisma.storageObject.findFirst({
      where: {
        key: fullKey,
        teamId: team.id,
      },
    });

    if (existingFolder) {
      return restashError("Folder or file with this key already exists", 400);
    }

    // create the folder
    await prisma.storageObject.create({
      data: {
        name,
        key: fullKey.endsWith("/") ? fullKey : `${fullKey}/`,
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
