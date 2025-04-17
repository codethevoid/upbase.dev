"use client";

import { useEffect, useState } from "react";
import { useStorage } from "@/hooks/swr/use-storage";
import { useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { Card } from "@/components/ui/card";
import { CodeXml, File, Folder, Upload } from "lucide-react";
import { formatBytes } from "@/lib/utils/format-bytes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CreateFolderDialog } from "@/components/dialogs/create-folder";
import { getFileType } from "@/lib/utils/get-file-type";

// export type Sort = "newest" | "oldest" | "name_asc" | "name_desc" | "size_asc" | "size_desc";

export const StorageClient = () => {
  // const [sortBy, setSortBy] = useState<Sort>("newest");
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "/";
  const [page, setPage] = useState(1);
  const limit = 100;
  const { objects, total, error, isLoading } = useStorage({ key, page, limit });
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsFirstLoad(false);
    }
  }, [isLoading]);

  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Storage</h1>
        <div className="flex items-center gap-2">
          <CreateFolderDialog limit={limit} page={page} />
          <Button size="sm" asChild>
            <NextLink
              href={`/storage/upload${key === "/" ? "" : "?"}${key === "/" ? "" : new URLSearchParams({ key }).toString()}`}
            >
              <Upload />
              <span>Upload</span>
            </NextLink>
          </Button>
          <Button size="sm" variant="outline">
            <CodeXml />
            <span>API</span>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {/*<ActionBar sortBy={sortBy} setSortBy={setSortBy} />*/}
        {isLoading || (objects && objects.length > 0) ? (
          <div className="max-w-full overflow-x-auto">
            <table className="border-separate border-spacing-0 border-none whitespace-nowrap">
              <thead className="bg-input/30">
                <tr>
                  <th className="text-primary border-input h-8 w-[300px] rounded-l-md border border-r-0 px-3 text-left text-xs font-medium">
                    Name
                  </th>
                  <th className="text-primary border-input h-8 w-[260px] border-y px-3 text-left text-xs font-medium">
                    Type
                  </th>
                  <th className="text-primary border-input h-8 w-[336px] border-y px-3 text-left text-xs font-medium">
                    Modified
                  </th>
                  <th className="text-primary border-input h-8 w-24 rounded-r-md border border-l-0 px-3 text-left text-xs font-medium">
                    Size
                  </th>
                </tr>
              </thead>
              {isLoading && isFirstLoad ? (
                <tbody>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index}>
                      <td className="max-w-[300px] border-b px-3 py-3.5">
                        <Skeleton className="h-2" />
                      </td>
                      <td className="max-w-[240px] border-b px-3 py-3.5">
                        <Skeleton className="h-2" />
                      </td>
                      <td className="max-w-[336px] border-b px-3 py-3.5">
                        <Skeleton className="h-2" />
                      </td>
                      <td className="max-w-24 border-b px-3 py-3.5">
                        <Skeleton className="h-2" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  {objects &&
                    objects.map((object) => (
                      <tr
                        key={object.name}
                        className={isLoading ? "pointer-events-none animate-pulse" : ""}
                      >
                        <td className="max-w-[300px] border-b px-3 py-2.5 text-sm">
                          <div className="flex items-center gap-4">
                            {/*<Checkbox />*/}
                            <div className="ring-offset-background flex size-[26px] shrink-0 items-center justify-center rounded-md bg-gradient-to-bl from-zinc-100 to-zinc-300 ring-1 ring-zinc-300 ring-offset-2 dark:from-zinc-500 dark:to-zinc-900 dark:ring-zinc-400">
                              {object.storageType === "folder" ? (
                                <Folder className="size-3.5" />
                              ) : (
                                <File className="size-3.5" />
                              )}
                            </div>
                            <NextLink
                              href={
                                object.storageType === "folder"
                                  ? `/storage?${new URLSearchParams({ key: object.key }).toString()}`
                                  : `/storage/${object.id}?${new URLSearchParams({ key: object.key }).toString()}`
                              }
                              className="hover:border-primary dark:hover:border-primary min-w-0 truncate border-b border-dashed border-zinc-400 transition-colors dark:border-zinc-600"
                            >
                              {`${object.name}${object.storageType === "folder" ? "/" : ""}`}
                            </NextLink>
                          </div>
                        </td>
                        <td className="max-w-[240px] border-b px-3 py-2.5 text-sm">
                          {object.storageType === "file"
                            ? getFileType({
                                name: object.name,
                                type: object.contentType || "",
                              })
                            : "Folder"}
                        </td>
                        <td className="max-w-[336px] border-b px-3 py-2.5 text-sm">
                          {new Date(object.updatedAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="max-w-24 border-b px-3 py-2.5 text-sm">
                          {object.size ? formatBytes(object.size) : "-"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              )}
            </table>
          </div>
        ) : (
          <Card className={"flex h-48 w-full items-center justify-center"}>
            <p>No files found</p>
          </Card>
        )}
        {objects && (total || 0) > limit && (
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">
              {(page - 1) * limit + 1} to {Math.min(page * limit, total || 0)} of {total} results
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((prev) => Math.max(prev - 1, 1));
              }}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((prev) => Math.min(prev + 1, Math.ceil((total || 0) / limit)));
              }}
              disabled={page * limit >= (total || 0)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
