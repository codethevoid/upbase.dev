"use client";

import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { ChevronRight, Cloud } from "lucide-react";
import { ThemedGlobe } from "@/components/magicui/themed-globe";
import { track } from "@vercel/analytics";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

export const Hero = () => {
  return (
    <section className="relative px-6 py-10 md:px-10 md:py-16">
      <div className="absolute inset-0 z-[-1]">
        <div className="from-background to-background absolute inset-0 z-10 bg-gradient-to-b via-transparent"></div>
        <div className="from-background to-background absolute inset-0 z-10 bg-gradient-to-r via-transparent"></div>
        <AnimatedGridPattern maxOpacity={0.07} className="z-[-1]" />
      </div>
      <div className="mx-auto grid max-w-md grid-cols-1 gap-2 md:max-w-none md:grid-cols-2 md:items-center md:gap-0">
        <div className="order-2 space-y-5 md:order-1 md:space-y-6">
          {/*<div className="mx-auto w-fit rounded-full bg-gradient-to-b from-orange-100 to-orange-500 md:mx-0 dark:from-orange-950">*/}
          {/*  <span className="m-[1px] inline-flex items-center gap-1 rounded-full bg-gradient-to-b from-white to-white/80 px-2.5 py-1 text-sm whitespace-nowrap dark:from-black dark:to-black/80">*/}
          {/*    5GB free storage*/}
          {/*  </span>*/}
          {/*</div>*/}
          <div className="text-foreground flex items-center justify-center gap-1.5 md:justify-start">
            <Cloud className="size-4" />
            <span className="text-muted-foreground text-[0.825rem]">5GB free storage</span>
          </div>
          <h1 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-center text-4xl font-medium text-transparent md:text-left md:text-5xl md:leading-13 dark:from-white dark:to-zinc-400">
            Global storage
            <br /> for developers
          </h1>
          <p className="text-muted-foreground mx-auto max-w-[300px] text-center text-base md:mx-0 md:max-w-[440px] md:text-left">
            {/*Restash is a global storage solution that allows you to store and distribute data*/}
            {/*anywhere in the world.*/}
            Object storage that works where you need it. Skip the complex setup and get back to
            building what matters.
          </p>
          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              asChild
              onClick={() => track("Get started", { location: "hero" })}
              sharp
              className="h-10 uppercase md:h-9"
            >
              <NextLink href="/register">
                Start building <ChevronRight />
              </NextLink>
            </Button>
            <Button
              variant="outline"
              asChild
              sharp
              className="uppercase max-md:h-9"
              onClick={() => track("docs", { location: "hero" })}
            >
              <a href="https://docs.restash.io" target={"_blank"}>
                Documentation
                <ChevronRight />
              </a>
            </Button>
          </div>
        </div>
        <div className="relative left-0 order-1 md:left-6 md:order-2">
          <div className="mx-auto max-w-[260px] md:max-w-[500px]">
            <ThemedGlobe />
          </div>
        </div>
      </div>
    </section>
  );
};
