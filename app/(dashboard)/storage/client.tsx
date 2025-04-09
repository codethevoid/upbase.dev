"use client";

import { ActionBar } from "@/app/(dashboard)/storage/action-bar";
import { useState } from "react";
import { useStorage } from "@/hooks/swr/use-storage";
import { ButtonLoader } from "@/components/ui/button-loader";
import { Card } from "@/components/ui/card";

export type Sort = "newest" | "oldest" | "name_asc" | "name_desc" | "size_asc" | "size_desc";

export const StorageClient = () => {
  const [sortBy, setSortBy] = useState<Sort>("newest");
  const [key, setKey] = useState<string>("/");
  const [search, setSearch] = useState<string>(""); // only search for files in the current path
  const { storage, isLoading, error } = useStorage({ key });

  return (
    <div className="space-y-4">
      <ActionBar sortBy={sortBy} setSortBy={setSortBy} />
      {isLoading ? (
        <div className="flex h-48 w-full items-center justify-center">
          <ButtonLoader />
        </div>
      ) : storage && storage.length > 0 ? (
        <div>files</div>
      ) : (
        <Card className={"flex h-48 w-full items-center justify-center"}>
          <p>No files found</p>
        </Card>
      )}
    </div>
  );
};
