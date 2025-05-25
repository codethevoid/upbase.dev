import { z } from "zod";

export const folderSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please provide a folder name" })
    .max(50, { message: "Folder name must be at most 50 characters long" })
    .regex(/^[a-zA-Z0-9-_.]+$/, { message: "Invalid folder name" })
    .describe(
      "Folder name must be 1-50 characters long and can only contain letters, numbers, dashes, underscores, and dots.",
    ),
});

export type FolderSchema = z.infer<typeof folderSchema>;

// api key schema
export const apiKeySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please provide a key name" })
    .max(50, { message: "Key name must be at most 50 characters long" }),
  origins: z.string().regex(/^\S*$/, { message: "No spaces allowed" }).optional(),
});

export type ApiKeySchema = z.infer<typeof apiKeySchema>;

// feedback schema
export const feedbackSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Please provide a feedback message" })
    .max(500, { message: "Feedback message must be at most 500 characters long" }),
  emotion: z.enum(["happy", "sad"]).optional(),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;
