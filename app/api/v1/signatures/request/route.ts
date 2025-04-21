import { withSecretKey } from "@/lib/auth/with-secret-key";
import { restashError } from "@/lib/utils/restash-error";
import { nanoid } from "@/lib/utils/alphabet";
import { createHmac } from "crypto";
import { restashResponse } from "@/lib/utils/restash-response";

export const GET = withSecretKey(async ({ team }) => {
  try {
    const { secretKey } = team;
    const timestamp = Date.now();
    const requestId = nanoid(32);
    const payload = `${requestId}:${timestamp}`;
    const signature = createHmac("sha256", secretKey).update(payload).digest("hex");

    return restashResponse("Signature generated", 200, { payload, signature });
  } catch (e) {
    console.error(e);
    return restashError("Failed to generate signature", 500);
  }
});
