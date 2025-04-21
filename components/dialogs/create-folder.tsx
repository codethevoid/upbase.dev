"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { FolderSchema } from "@/lib/zod";
import { folderSchema } from "@/lib/zod";
import { useStorage } from "@/hooks/swr/use-storage";
import { ButtonLoader } from "@/components/ui/button-loader";
import { useSearchParams } from "next/navigation";
import { RestashErrorResponse } from "@/types";

export const CreateFolderDialog = ({ page, limit }: { page: number; limit: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "/";
  const { mutate } = useStorage({ key, page, limit });
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FolderSchema>({
    resolver: zodResolver(folderSchema),
  });

  const onSubmit = async (data: FolderSchema) => {
    console.log(data);
    setIsLoading(true);

    try {
      const res = await fetch("/api/storage/folders/create", {
        method: "POST",
        body: JSON.stringify({ ...data, baseKey: key }),
      });

      if (!res.ok) {
        const data = (await res.json()) as RestashErrorResponse;
        toast.error(data.error.message);
        return;
      }

      await mutate();
      toast.success("Folder created");
      setIsOpen(false);
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          <span>Create folder</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
          <DialogDescription>
            This will create a new folder in the current directory.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="folder-name">Folder name</Label>
          </div>
          <Input
            autoComplete="off"
            id="folder-name"
            placeholder="Folder name..."
            {...register("name")}
          />
          {errors.name && <p className="text-[0.8rem] text-red-500">{errors.name.message}</p>}
          <p className="text-muted-foreground text-[0.8rem]">
            Can only contain letters, numbers, hyphens, underscores, and periods.
          </p>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            size="sm"
            onClick={() => formRef.current?.requestSubmit()}
            className="w-[110px]"
          >
            {isLoading ? <ButtonLoader /> : "Create folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
