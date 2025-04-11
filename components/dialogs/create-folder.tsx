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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const schema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9-_.]+$/),
});

export const CreateFolderDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log(data);
    setIsLoading(true);
    const key = searchParams.get("key") || "/";

    try {
      const res = await fetch("/api/storage/folders/create", {
        method: "POST",
        body: JSON.stringify({ ...data, baseKey: key }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message);
        return;
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
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
          <Button size="sm" onClick={() => formRef.current?.requestSubmit()}>
            Create folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
