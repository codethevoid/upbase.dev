import { NextResponse } from "next/server";

export const restashResponse = (
  message: string,
  status: number,
  data: Record<string, unknown> = {},
) => {
  return NextResponse.json(
    { message, success: true, timestamp: new Date().toISOString(), ...data },
    { status },
  );
};
