import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = async () => {
  const token = await auth();
  return NextResponse.json(token);
};