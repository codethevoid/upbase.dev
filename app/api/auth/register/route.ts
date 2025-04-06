import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {

  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};