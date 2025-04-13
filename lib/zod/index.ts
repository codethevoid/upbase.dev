import { z } from "zod";

export const folderSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50, { message: "Folder name must be at most 50 characters long" })
    .regex(/^[a-zA-Z0-9-_.]+$/, { message: "Invalid folder name" })
    .describe(
      "Folder name must be 1-50 characters long and can only contain letters, numbers, dashes, underscores, and dots.",
    ),
});

export type FolderSchema = z.infer<typeof folderSchema>;
