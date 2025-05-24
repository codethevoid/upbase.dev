"use client";

import { useTeam } from "@/hooks/swr/use-team";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { ButtonLoader } from "@/components/ui/button-loader";
import { Button } from "@/components/ui/button";
import { RestashErrorResponse } from "@/types";
import { toast } from "sonner";
import { formatBytes } from "@/utils/format-bytes";
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
import { FREE_PLAN_STORAGE_LIMIT } from "@/utils/limits";
import { ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const teamNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" }),
});

type TeamNameSchema = z.infer<typeof teamNameSchema>;

export const TeamSettingsClient = () => {
  const { team, isLoading, error } = useTeam();
  const [isUpdatingTeamName, setIsUpdatingTeamName] = useState(false);
  const [isUpdatingSignature, setIsUpdatingSignature] = useState(false);
  const [isSignatureEnabled, setIsSignatureEnabled] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { handleSubmit, register, setValue } = useForm<TeamNameSchema>({
    resolver: zodResolver(teamNameSchema),
  });

  const onSubmit = async (data: TeamNameSchema) => {
    console.log(data);
    setIsUpdatingTeamName(true);
    try {
      const res = await fetch(`/api/team/edit-name/${team?.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: data.name }),
      });

      if (!res.ok) {
        const data: RestashErrorResponse = await res.json();
        toast.error(data.error.message);
        return;
      }

      toast.success("Team name updated successfully");
    } catch (e) {
      console.error(e);
      toast.error("There was an error updating your team name");
    } finally {
      setIsUpdatingTeamName(false);
    }
  };

  useEffect(() => {
    if (team) {
      setValue("name", team.name);
      setIsSignatureEnabled(team.requiresSignature);
    }
  }, [team, setValue]);

  if (isLoading) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <ButtonLoader />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <p className="text-muted-foreground text-sm">There was an error loading settings</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card className="overflow-hidden p-0">
        <div className="border-b px-4 py-3 font-medium">Team</div>
        <div className="px-4 py-6">
          <form ref={formRef} className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="name">Team name</Label>
            </div>
            <Input id="name" className="max-w-sm" placeholder="Team name" {...register("name")} />
          </form>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-smaller text-muted-foreground">Update your team name here.</p>
          <Button
            size="sm"
            className="w-[55px]"
            disabled={isUpdatingTeamName}
            onClick={() => formRef.current?.requestSubmit()}
          >
            {isUpdatingTeamName ? <ButtonLoader /> : "Save"}
          </Button>
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b px-4 py-3 font-medium">Require signatures</div>
        <div className="space-y-4 px-4 py-6">
          <div className="space-y-2">
            <div>
              <Label htmlFor="signature">Enforce signature on uploads</Label>
            </div>
            <div>
              <Switch
                id="signatures"
                checked={isSignatureEnabled}
                onCheckedChange={setIsSignatureEnabled}
              />
            </div>
          </div>
          <p className="text-smaller text-muted-foreground max-w-[70ch]">
            This will require your client-side uploads to be signed with a secure token generated on
            your backend. It’s recommended for production apps to ensure only authorized uploads are
            allowed.{" "}
            <a href="#" className="text-foreground inline-flex items-center gap-1 hover:underline">
              <span>Learn more</span> <ExternalLink className="size-3" />
            </a>
          </p>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-smaller text-muted-foreground">Update upload preferences</p>
          <Button
            size="sm"
            className="w-[55px]"
            disabled={isUpdatingSignature}
            onClick={async () => {
              setIsUpdatingSignature(true);
              try {
                const res = await fetch("/api/team/edit-signatures", {
                  method: "PATCH",
                  body: JSON.stringify({
                    requiresSignature: isSignatureEnabled,
                  }),
                });

                if (!res.ok) {
                  const data: RestashErrorResponse = await res.json();
                  toast.error(data.error.message);
                  return;
                }

                toast.success("Team signature settings updated successfully");
              } catch (e) {
                console.error(e);
                toast.error("There was an error updating your team signature settings");
              } finally {
                setIsUpdatingSignature(false);
              }
            }}
          >
            {isUpdatingSignature ? <ButtonLoader /> : "Save"}
          </Button>
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="border-b px-4 py-3 font-medium">Usage</div>
        <div className="px-4 py-6">
          <p className="text-lg font-semibold">
            {formatBytes(team.usage || 0)} / {formatBytes(FREE_PLAN_STORAGE_LIMIT)}
          </p>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-smaller text-muted-foreground">Based on total bytes stored.</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Upgrade</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upgrade your plan</DialogTitle>
                <DialogDescription>
                  Your are currently on a free plan. We will be releasing paid plans soon. Stay
                  tuned!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button size="sm">Got it!</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </>
  );
};
