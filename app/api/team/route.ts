import { withTeam } from "@/lib/auth/with-team";
import { NextResponse } from "next/server";

export const GET = withTeam(async ({ team }) => {
  return NextResponse.json(team);
});
