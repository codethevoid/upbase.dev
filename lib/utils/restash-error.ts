import { NextResponse } from "next/server";

const statusToCode = {
  400: "bad_request",
  401: "unauthorized",
  403: "forbidden",
  404: "not_found",
  409: "conflict",
  429: "rate_limit_exceeded",
  500: "internal_server_error",
};

export const restashError = (message: string, status: keyof typeof statusToCode) => {
  return NextResponse.json(
    {
      error: {
        code: statusToCode[status as keyof typeof statusToCode],
        message,
      },
      timestamp: new Date().toISOString(),
    },
    { status },
  );
};
