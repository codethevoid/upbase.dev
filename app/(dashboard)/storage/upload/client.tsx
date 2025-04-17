"use client";

import { Button } from "@/components/ui/button";
import { CodeXml, Link2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeam } from "@/hooks/swr/use-team";
import { Card } from "@/components/ui/card";
import { Dropzone } from "@/app/(dashboard)/storage/upload/components/dropzone";
import { useState } from "react";
import type { FileWithPath } from "@/types";
import { formatBytes } from "@/lib/utils/format-bytes";
import { getFileType } from "@/lib/utils/get-file-type";
import NextLink from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { UploadProgress } from "@/components/dialogs/upload-progress";
import { ButtonLoader } from "@/components/ui/button-loader";

const getPath = (str: string | undefined, fileName: string) => {
  if (!str) return "-";
  let path = str;
  if (str.startsWith(".")) path = str.substring(1);
  const matches = str.match(/\//g);
  if (matches && matches.length === 1) {
    return "-"; // no subfolder
  }

  return path.replace(`${fileName}`, "").substring(1);
};

export const UploadClient = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "/";
  const { team, isLoading: isLoadingTeam } = useTeam();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState<Record<string, number>>({});

  const onUpload = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/storage/upload/get-presigned-urls", {
        method: "POST",
        body: JSON.stringify({
          baseKey: key,
          files: files.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            path: file.path,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      const presignedData = (await res.json()) as {
        key: string;
        signedUrl: string;
        index: number;
      }[];
      // set initial upload progress
      setUploads(
        presignedData.reduce(
          (acc, item) => {
            acc[`${files[item.index].name}-${item.index}`] = 0;
            return acc;
          },
          {} as Record<string, number>,
        ),
      );

      setIsUploading(true);
      setIsLoading(false);
      // upload files and track progress;
      await Promise.all(
        presignedData.map(async (item) => {
          const { signedUrl, index, key } = item;
          const file = files[index];

          await axios.put(signedUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
              setUploads((prev) => ({
                ...prev,
                [`${file.name}-${index}`]: percent,
              }));
            },
          });

          // insert the file into our db
          // once the upload is complete on a per file basis
          await fetch("/api/storage/upload/insert", {
            method: "POST",
            body: JSON.stringify({
              name: file.name,
              key: key,
              size: file.size,
              type: file.type,
            }),
          });
        }),
      );
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Upload</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <CodeXml />
              <span>API</span>
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Card className="space-y-4 shadow-none">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Destination</p>
              <p className="text-muted-foreground text-sm">
                Add folders and files to upload to Restash. They will be uploaded to the current
                directory.
              </p>
            </div>
            {key === "/" ? (
              <a
                href={`/storage`}
                target="_blank"
                className="flex items-center gap-2 text-sm underline"
              >
                <Link2 className="text-muted-foreground size-4 shrink-0" />
                <span className="break-all">storage/</span>
              </a>
            ) : (
              <>
                {isLoadingTeam ? (
                  <div className="flex h-[19.8px] items-center gap-2">
                    <Link2 className="text-muted-foreground size-4" />
                    <Skeleton className="h-2 w-36" />
                  </div>
                ) : (
                  <a
                    target="_blank"
                    href={`/storage?${new URLSearchParams({ key })}`}
                    className="flex items-center gap-2 text-sm underline"
                  >
                    <Link2 className="text-muted-foreground size-4 shrink-0" />
                    <span className="break-all">storage/{key.replace(`/${team?.id}/`, "")}</span>
                  </a>
                )}
              </>
            )}
          </Card>
          <Dropzone setFiles={setFiles} />
          {files.length > 0 && (
            <div className="max-w-full overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 border-none whitespace-nowrap">
                <thead className="bg-input/30">
                  <tr>
                    <th className="text-primary border-input h-8 w-[300px] rounded-l-md border border-r-0 px-3 text-left text-xs font-medium">
                      Name
                    </th>
                    <th className="text-primary border-input h-8 w-[260px] border-y px-3 text-left text-xs font-medium">
                      Subfolder
                    </th>
                    <th className="text-primary border-input h-8 w-[336px] border-y px-3 text-left text-xs font-medium">
                      Type
                    </th>
                    <th className="text-primary border-input h-8 w-24 rounded-r-md border border-l-0 px-3 text-left text-xs font-medium">
                      Size
                    </th>
                  </tr>
                </thead>
                {files.length > 0 && (
                  <tbody>
                    {files.map((file) => (
                      <tr key={`${file.name}-${file.path}`}>
                        <td className="max-w-[300px] truncate border-b px-3 py-2.5 text-left text-sm">
                          {file.name}
                        </td>
                        <td className="max-w-[240px] truncate border-b px-3 py-2.5 text-left text-sm">
                          {getPath(file.path, file.name)}
                        </td>
                        <td className="max-w-[336px] border-b px-3 py-2.5 text-left text-sm">
                          {getFileType(file)}
                        </td>
                        <td className="w-24 border-b px-3 py-2.5 text-left text-sm">
                          {formatBytes(file.size)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          )}
          {/*{files.length === 0 && (*/}
          {/*  <div className="flex h-24 items-center justify-center">*/}
          {/*    <div className="space-y-0.5">*/}
          {/*      <p className="text-center text-sm font-medium">No folders or files selected.</p>*/}
          {/*      <p className="text-smaller text-muted-foreground">*/}
          {/*        You have not selected any folders or files to upload.*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*)}*/}
          {files.length > 0 && (
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" variant="ghost" asChild>
                <NextLink href={`/storage?${new URLSearchParams({ key })}`}>Cancel</NextLink>
              </Button>
              <Button size="sm" onClick={onUpload} disabled={isLoading} className="w-[71px]">
                {isLoading ? <ButtonLoader /> : "Upload"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <UploadProgress isOpen={isUploading} setIsOpen={setIsUploading} uploads={uploads} />
    </>
  );
};
