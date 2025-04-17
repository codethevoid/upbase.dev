import { NextResponse } from "next/server";

export const restashError = (message: string, status: number) => {
  return NextResponse.json(
    { message, success: false, timestamp: new Date().toISOString() },
    { status },
  );
};
