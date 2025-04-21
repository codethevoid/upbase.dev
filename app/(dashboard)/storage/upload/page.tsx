import { UploadClient } from "@/app/(dashboard)/storage/upload/client";
import { Suspense } from "react";

export default function Upload() {
  return (
    <>
      <Suspense>
        <UploadClient />
      </Suspense>
    </>
  );
}
