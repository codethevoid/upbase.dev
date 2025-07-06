"use client";

import { Check, ChevronRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { Crosses } from "@/components/ui/crosses";
import { track } from "@vercel/analytics";

export const Pricing = () => {
  return (
    <div className="colorful relative">
      <Crosses />
      <div className="mx-auto max-w-screen-xl space-y-8 px-6 py-10 md:px-10 md:py-16">
        <div className="space-y-4">
          <div className="text-foreground flex items-center justify-center gap-1.5">
            <Rocket className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">Simple pricing</span>
          </div>
          <div className="space-y-3">
            <h3 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-center text-2xl font-medium text-transparent md:text-4xl dark:from-white dark:to-zinc-400">
              Power your storage
            </h3>
            <div className="mx-auto sm:max-w-[550px]">
              <p className="text-muted-foreground text-center text-sm md:text-base">
                Start with our free plan and upgrade as you grow
              </p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-3xl rounded-lg border md:grid md:grid-cols-2">
          <div className="space-y-6 border-b p-6 md:border-r md:border-b-0">
            <div className="space-y-2">
              <h4 className="text-xl font-medium">Hobby</h4>
              <p className="text-muted-foreground text-[0.925rem]">
                The perfect starting place.<br></br>
                <span className="text-foreground font-medium">Free forever.</span>
              </p>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">5GB of included storage</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">Upload files up to 1GB in size</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">Unlimited uploads and downloads</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">Fast and secure CDN</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">Folder organization</p>
              </div>
            </div>
            <Button
              className="h-10 w-full justify-between rounded-full md:h-9"
              asChild
              onClick={() => track("Start for free", { location: "pricing" })}
            >
              <NextLink href="/register">
                Start for free
                <ChevronRight />
              </NextLink>
            </Button>
          </div>
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <h4 className="text-xl font-medium">Pro</h4>
              <p className="text-muted-foreground text-[0.925rem]">
                Everything you need to build.<br></br>
                <span className="text-foreground font-medium">$20/month.</span>
              </p>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">250GB of included storage</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">Upload files up to 5TB in size</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">Unlimited uploads and downloads</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">Fast and secure CDN</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4" />
                <p className="text-muted-foreground text-sm">Folder organization</p>
              </div>
            </div>
            <Button
              className="h-10 w-full justify-between rounded-full md:h-9"
              variant="secondary"
              asChild
              onClick={() => track("Coming soon", { location: "pricing" })}
            >
              <NextLink href="/register">
                Coming soon
                <ChevronRight />
              </NextLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
