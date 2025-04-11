import { Button } from "@/components/ui/button";
import { CodeXml, Upload } from "lucide-react";
import { StorageClient } from "@/app/(dashboard)/storage/client";
import { CreateFolderDialog } from "@/components/dialogs/create-folder";

export default function Storage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Storage</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <CodeXml />
            <span>API</span>
          </Button>
          <CreateFolderDialog />
          <Button size="sm">
            <Upload />
            <span>Upload</span>
          </Button>
        </div>
      </div>
      <StorageClient />
    </div>
  );
}
