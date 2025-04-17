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
import { Copy, ExternalLink, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { ButtonLoader } from "@/components/ui/button-loader";
import { apiKeySchema, ApiKeySchema } from "@/lib/zod";
import { toast } from "sonner";
import { RestashErrorResponse } from "@/types";
import { useApiKeys } from "@/hooks/swr/use-api-keys";

export const CreateApiKeyDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const { mutate } = useApiKeys();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ApiKeySchema>({
    resolver: zodResolver(apiKeySchema),
  });

  const onSubmit = async (data: ApiKeySchema) => {
    console.log(data);
    setIsLoading(true);

    try {
      const res = await fetch("/api/api-keys/create", {
        method: "POST",
        body: JSON.stringify({ ...data }),
      });

      if (!res.ok) {
        const data = (await res.json()) as RestashErrorResponse;
        toast.error(data.message);
        return;
      }

      // mutate
      const { secretKey }: { secretKey: string } = await res.json();
      setCreatedKey(secretKey);
      await mutate();
      toast.success("API key created");
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Failed to create API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setTimeout(() => {
            reset();
            setCreatedKey(null);
          }, 1000);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          <span>Create API key</span>
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => (createdKey ? e.preventDefault() : undefined)}>
        <DialogHeader>
          <DialogTitle>{createdKey ? "API key created" : "Create API key"}</DialogTitle>
          <DialogDescription>
            {createdKey ? "Your API key has been created." : "Create a new API key for your team."}
          </DialogDescription>
        </DialogHeader>
        {createdKey ? (
          <div className="space-y-2">
            <div className="relative">
              <Input readOnly value={createdKey} className="pr-9" />
              <Button
                onClick={() => {
                  navigator.clipboard?.writeText(createdKey);
                  toast.success("Copied to clipboard");
                }}
                size="icon"
                className="absolute top-1/2 right-1 size-7 -translate-y-1/2 rounded-md"
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
            <p className="text-[0.8rem] text-amber-500">
              Please copy your secret key and store it in a safe spot. You will not be able to view
              it again.
            </p>
          </div>
        ) : (
          <form ref={formRef} className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <div>
                <Label htmlFor="key-name">Name</Label>
              </div>
              <Input
                autoComplete="off"
                id="key-name"
                placeholder="API key name"
                {...register("name")}
              />
              {errors.name && <p className="text-[0.8rem] text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <div>
                <Label htmlFor="origins">Authorized origins (optional)</Label>
              </div>
              <Input
                autoComplete="off"
                id="origins"
                placeholder="Authorized origins"
                {...register("origins")}
              />
              {errors.origins && (
                <p className="text-[0.8rem] text-red-500">{errors.origins.message}</p>
              )}
              <p className="text-muted-foreground text-[0.8rem]">
                List of origins allowed to use this API key. Comma separated. Only applies if you
                are using the public API key in the browser.{" "}
                <a
                  href="#"
                  className="text-foreground inline-flex items-center gap-1 hover:underline"
                >
                  <span>Learn more</span> <ExternalLink className="size-3" />
                </a>
              </p>
            </div>
          </form>
        )}
        <DialogFooter>
          {createdKey ? (
            <DialogClose asChild>
              <Button size="sm" variant="outline">
                I have my key stored
              </Button>
            </DialogClose>
          ) : (
            <>
              <DialogClose asChild>
                <Button size="sm" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                disabled={isLoading}
                size="sm"
                onClick={() => formRef.current?.requestSubmit()}
                className="w-[93px]"
              >
                {isLoading ? <ButtonLoader /> : "Create key"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
