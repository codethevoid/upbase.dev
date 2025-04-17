import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { ButtonLoader } from "@/components/ui/button-loader";
import { apiKeySchema, type ApiKeySchema } from "@/lib/zod";
import { toast } from "sonner";
import { RestashErrorResponse } from "@/types";
import { useApiKey } from "@/hooks/swr/use-api-key";

export const EditApiKeyDialog = ({
  isOpen,
  setIsOpen,
  id,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  id: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { key, mutate } = useApiKey(id);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApiKeySchema>({
    resolver: zodResolver(apiKeySchema),
  });

  useEffect(() => {
    if (key) {
      setValue("origins", key.origins?.length > 0 ? key.origins.join(",") : "");
      setValue("name", key.name);
    }
  }, [key, isOpen, setValue]);

  const onSubmit = async (data: ApiKeySchema) => {
    console.log(data);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/api-keys/edit/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...data }),
      });

      if (!res.ok) {
        const data = (await res.json()) as RestashErrorResponse;
        toast.error(data.message);
        return;
      }

      await mutate();
      toast.success("API key edited");
      setIsOpen(false);
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
          }, 1000);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit API key</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

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
              List of origins allowed to use this API key. Comma separated. Only applies if you are
              using the public API key in the browser.{" "}
              <a
                href="#"
                className="text-foreground inline-flex items-center gap-1 hover:underline"
              >
                <span>Learn more</span> <ExternalLink className="size-3" />
              </a>
            </p>
          </div>
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
            className="w-[55px]"
          >
            {isLoading ? <ButtonLoader /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
