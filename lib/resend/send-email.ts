import { ReactNode } from "react";
import { resend } from "@/lib/resend/resend";

export const sendEmail = async ({
  from,
  to,
  replyTo,
  subject,
  text,
  react,
}: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  react?: ReactNode;
}) => {
  return await resend.emails.send({
    from,
    to,
    subject,
    text,
    ...(replyTo && { replyTo }),
    ...(react && { react }),
  });
};
