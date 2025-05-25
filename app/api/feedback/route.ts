import { after, NextResponse } from "next/server";
import { withWebApp } from "@/lib/auth/with-web-app";
import { restashError } from "@/utils/restash-error";
import { feedbackSchema } from "@/lib/zod";
import { sendEmail } from "@/lib/resend/send-email";

export const POST = withWebApp(async ({ req, user }) => {
  try {
    const { message, emotion } = await req.json();
    const { error } = feedbackSchema.safeParse({ message, emotion });
    if (error) return restashError("Invalid feedback", 400);

    after(async () => {
      await sendEmail({
        from: process.env.SENDER_EMAIL!,
        to: process.env.RECIEVER_EMAIL!,
        subject: `Feedback from ${user.email}`,
        text: `Message: ${message} ${emotion ? `\n\nEmoji: ${emotion}` : ""}`,
      });
    });

    return NextResponse.json({ message: "Feedback received" });
  } catch (e) {
    console.error(e);
    return restashError("Failed to send feedback", 500);
  }
});
