import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";

type CreateFolderRequest = {
  name: string;
  baseKey: string;
};

export const POST = withTeam(async ({ req, team }) => {
  try {
    const { name, baseKey } = (await req.json()) as CreateFolderRequest;
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});
