"use client";

import { ActionBar } from "@/app/(dashboard)/storage/action-bar";
import { useState } from "react";

export type Sort = "newest" | "oldest" | "name_asc" | "name_desc" | "size_asc" | "size_desc";

export const StorageClient = () => {
  const [sortBy, setSortBy] = useState<Sort>("newest");

  return (
    <div className="space-y-4">
      <ActionBar sortBy={sortBy} setSortBy={setSortBy} />
    </div>
  );
};
