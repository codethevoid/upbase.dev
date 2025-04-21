"use client";

import { useApiKey } from "@/hooks/swr/use-api-key";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/ui/button-loader";
import { CodeXml, Copy, Ellipsis, ExternalLink, PencilLine, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { EditApiKeyDialog } from "@/components/dialogs/edit-api-key";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RestashErrorResponse } from "@/types";
import { useRouter } from "next/navigation";

export const ApiKeyClient = ({ id }: { id: string }) => {
  const { key, isLoading, error } = useApiKey(id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <ButtonLoader />
      </div>
    );
  }

  if (!key || error) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <p className="text-muted-foreground text-sm">API key not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">{key.name}</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <CodeXml />
              <span>API</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                  <PencilLine />
                  Edit API key
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => setIsDeleteOpen(true)}>
                  <Trash />
                  Delete API key
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Card className="space-y-4 shadow-none">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Secret key</p>
            <p className="text-muted-foreground text-sm">{key.secretKey}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Public key</p>
            <div className="flex gap-2">
              <Copy
                role="button"
                className="relative top-[3px] size-3.5 shrink-0 cursor-pointer"
                onClick={() => {
                  navigator?.clipboard?.writeText(key.publicKey);
                  toast.success("Copied to clipboard");
                }}
              />
              <p className="text-muted-foreground text-sm break-all">{key.publicKey}</p>
            </div>
          </div>
          <div className={cn("", key.origins.length > 0 ? "space-y-1" : "space-y-0.5")}>
            <p className="text-sm font-medium">Authorized origins</p>
            {key.origins.length > 0 ? (
              <div className="flex gap-1">
                {key.origins.map((origin) => (
                  <Badge
                    variant="secondary"
                    key={origin}
                    className="text-muted-foreground text-smaller font-normal"
                  >
                    {origin}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No origins authorized.{" "}
                <a
                  href="#"
                  className="text-foreground inline-flex items-center gap-1 hover:underline"
                >
                  <span>Learn more</span> <ExternalLink className="size-3" />
                </a>
              </p>
            )}
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Last used</p>
            <p className="text-muted-foreground text-sm">
              {key.lastUsedAt ? key.lastUsedAt.toString() : "Never"}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Created</p>
            <p className="text-muted-foreground text-sm break-all">
              {new Date(key.createdAt).toLocaleString(undefined, { dateStyle: "long" })}
            </p>
          </div>
        </Card>
      </div>
      <EditApiKeyDialog isOpen={isEditOpen} setIsOpen={setIsEditOpen} id={id} />
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="w-[67px]"
              disabled={isDeleting}
              onClick={async () => {
                try {
                  setIsDeleting(true);
                  const res = await fetch(`/api/api-keys/delete/${id}`, {
                    method: "DELETE",
                  });

                  if (!res.ok) {
                    const data: RestashErrorResponse = await res.json();
                    toast.error(data.error.message);
                    return;
                  }

                  toast.success("API key deleted");
                  setIsDeleteOpen(false);
                  router.push("/api-keys");
                } catch (e) {
                  console.error(e);
                  toast.error("Failed to delete API key");
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
