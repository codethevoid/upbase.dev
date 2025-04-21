import { StorageClient } from "@/app/(dashboard)/storage/client";
import { Suspense } from "react";

export default function Storage() {
  return (
    <div className="space-y-8">
      <Suspense>
        <StorageClient />
      </Suspense>
    </div>
  );
}
