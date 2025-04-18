import { NextResponse } from "next/server";

export const restashResponse = (message: string, status: number) => {
  return NextResponse.json(
    { message, success: true, timestamp: new Date().toISOString() },
    { status },
  );
};
