"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToken } from "@/hooks/swr/use-token";
import { ButtonLoader } from "@/components/ui/button-loader";

export const ProfileClient = () => {
  const { token, isLoading, error } = useToken();

  if (isLoading) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <ButtonLoader />
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <p className="text-muted-foreground text-sm">There was an error loading your profile</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <Card className="overflow-hidden p-0">
        <div className="border-b px-4 py-3 font-medium">Email</div>
        <div className="px-4 py-6">
          <div className="space-y-2">
            <div>
              <Label htmlFor="name">Email</Label>
            </div>
            <Input
              id="name"
              className="max-w-sm"
              placeholder="Email"
              readOnly
              value={token?.user?.email || ""}
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-smaller text-muted-foreground">Email associated with your account.</p>
          {/*<Button*/}
          {/*  size="sm"*/}
          {/*  className="w-[55px]"*/}
          {/*  disabled={isUpdatingTeamName}*/}
          {/*  onClick={() => formRef.current?.requestSubmit()}*/}
          {/*>*/}
          {/*  {isUpdatingTeamName ? <ButtonLoader /> : "Save"}*/}
          {/*</Button>*/}
        </div>
      </Card>
    </>
  );
};
