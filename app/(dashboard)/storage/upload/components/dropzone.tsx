import { Dispatch, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileWithPath } from "@/types";
import { FREE_PLAN_FILE_SIZE_LIMIT } from "@/lib/utils/limits";
import { toast } from "sonner";

export const Dropzone = ({ setFiles }: { setFiles: Dispatch<FileWithPath[]> }) => {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // Handle file drop
    console.log(acceptedFiles);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 100,
    // multiple: false,
    onDropRejected: () => toast.error("Failed to upload files."),
    maxSize: FREE_PLAN_FILE_SIZE_LIMIT, // 1GB
  });

  return (
    <div
      className="bg-input/10 hover:border-primary/30 flex h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed p-4 transition-colors"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="pointer-events-none space-y-4">
        <div className="space-y-0.5">
          <p className="text-center text-sm font-medium">Select or drag folders or files</p>
          <p className="text-smaller text-muted-foreground">
            Upload up to 100 files at once. Max size 1GB per file.
          </p>
        </div>
      </div>
    </div>
  );
};
