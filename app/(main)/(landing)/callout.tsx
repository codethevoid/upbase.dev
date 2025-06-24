"use client";

import { Crosses } from "@/components/ui/crosses";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { track } from "@vercel/analytics";

export const Callout = () => {
  return (
    <div className="relative flex items-center justify-center gap-2 border-b px-4 py-2.5">
      <Crosses />
      <div className="flex h-[22px] items-center justify-center rounded-full bg-blue-500/15 px-2">
        <span className="text-xs font-medium text-blue-500">New</span>
      </div>
      <span className="text-foreground text-sm">Get 5GB free storage</span>
      <Button
        size="sm"
        className="h-6.5 rounded-full text-xs"
        onClick={() => track("Claim now", { location: "callout" })}
      >
        <NextLink href="/register">Claim now</NextLink>
      </Button>
    </div>
  );
};
