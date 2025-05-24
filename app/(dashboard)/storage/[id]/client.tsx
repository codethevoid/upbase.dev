"use client";

import { useObject } from "@/hooks/swr/use-object";
import { Button } from "@/components/ui/button";
import { Copy, Download, Ellipsis, Trash } from "lucide-react";
import { ButtonLoader } from "@/components/ui/button-loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { formatBytes } from "@/utils/format-bytes";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RestashErrorResponse } from "@/types";

export const StorageObjectClient = ({ id }: { id: string }) => {
  const { storageObject, isLoading, error } = useObject(id);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <ButtonLoader />
      </div>
    );
  }

  if (!storageObject || error) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <p className="text-muted-foreground text-sm">Object not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">{storageObject.name}</h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator?.clipboard?.writeText(
                  `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${storageObject.key}`,
                );
                toast.success("Copied to clipboard");
              }}
            >
              <Copy />
              <span>Copy url</span>
            </Button>
            <Button size="sm" variant="outline" className="w-[110px]" asChild>
              <a href={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${storageObject.key}`} download>
                <Download />
                <span>Download</span>
              </a>
            </Button>
            {/*<Button size="sm" variant="outline" asChild>*/}
            {/*  <a*/}
            {/*    href={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${storageObject.key}`}*/}
            {/*    target="_blank"*/}
            {/*  >*/}
            {/*    <ExternalLink />*/}
            {/*    <span>Open</span>*/}
            {/*  </a>*/}
            {/*</Button>*/}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setOpen(true)} variant="destructive">
                  <Trash />
                  Delete object
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className="space-y-4 shadow-none">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Last modified</p>
            <p className="text-muted-foreground text-sm">
              {new Date(storageObject.updatedAt).toLocaleString(undefined, {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Size</p>
            <p className="text-muted-foreground text-sm">{formatBytes(storageObject.size)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Content type</p>
            <p className="text-muted-foreground text-sm">{storageObject.contentType}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Key</p>
            <div className="flex gap-2">
              <Copy
                role="button"
                className="relative top-[3px] size-3.5 shrink-0 cursor-pointer"
                onClick={() => {
                  navigator?.clipboard?.writeText(storageObject.key);
                  toast.success("Copied to clipboard");
                }}
              />
              <p className="text-muted-foreground text-sm break-all">{storageObject.key}</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Object url</p>
            <div className="flex gap-2">
              <Copy
                role="button"
                className="relative top-[3px] size-3.5 shrink-0 cursor-pointer"
                onClick={() => {
                  navigator?.clipboard?.writeText(
                    `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${encodeURIComponent(storageObject.key)}`,
                  );
                  toast.success("Copied to clipboard");
                }}
              />
              <a
                href={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${storageObject.key}`}
                className="hover:text-foreground text-muted-foreground text-sm break-all transition-colors hover:underline"
                target="_blank"
              >
                {`${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${encodeURIComponent(storageObject.key)}`}
              </a>
            </div>
          </div>
        </Card>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete object</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this object? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={isDeleting}
              className="w-[67px]"
              onClick={async () => {
                setIsDeleting(true);
                try {
                  const res = await fetch(`/api/storage/object/delete/${id}`, {
                    method: "DELETE",
                  });

                  if (!res.ok) {
                    const data = (await res.json()) as RestashErrorResponse;
                    toast.error(data.error.message || "Failed to delete object");
                    return;
                  }

                  toast.success("Object deleted");
                  router.push("/storage");
                } catch (e) {
                  console.error(e);
                  toast.error("Failed to delete object");
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? <ButtonLoader /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
