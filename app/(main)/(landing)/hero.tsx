"use client";

import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { ChevronRight } from "lucide-react";
import { ThemedGlobe } from "@/components/magicui/themed-globe";
import { track } from "@vercel/analytics";

export const Hero = () => {
  return (
    <section className="h-full min-h-fit px-6 py-6 md:py-20">
      <div className="mx-auto grid max-w-md grid-cols-1 gap-2 md:h-full md:min-h-fit md:max-w-screen-lg md:grid-cols-2 md:items-center md:gap-0">
        <div className="order-2 space-y-5 md:order-1 md:space-y-6">
          <div className="mx-auto w-fit rounded-full bg-gradient-to-b from-orange-100 to-orange-500 md:mx-0 dark:from-orange-950">
            <span className="m-[1px] inline-flex items-center gap-1 rounded-full bg-gradient-to-b from-white to-white/80 px-2.5 py-1 text-sm whitespace-nowrap dark:from-black dark:to-black/80">
              5GB free storage
            </span>
          </div>
          <h1 className="bg-gradient-to-b from-black to-zinc-600 bg-clip-text text-center text-4xl font-medium text-transparent md:text-left md:text-5xl lg:text-7xl dark:from-white dark:to-zinc-300">
            Global storage
            <br /> for developers
          </h1>
          <p className="text-muted-foreground mx-auto max-w-[300px] text-center text-base md:mx-0 md:max-w-full md:text-left lg:text-lg">
            {/*Restash is a global storage solution that allows you to store and distribute data*/}
            {/*anywhere in the world.*/}
            Object storage that works where you need it. Skip the complex setup and get back to
            building what matters.
          </p>
          <div className="flex flex-col gap-2 md:flex-row">
            <Button size="lg" asChild onClick={() => track("Get started", { location: "hero" })}>
              <NextLink href="/register">
                Get started <ChevronRight />
              </NextLink>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              asChild
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
          <div className="mx-auto max-w-[260px] md:max-w-full">
            <ThemedGlobe />
          </div>
        </div>
      </div>
    </section>
  );
};
