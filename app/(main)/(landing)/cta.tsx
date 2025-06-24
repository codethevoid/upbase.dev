"use client";

import { Crosses } from "@/components/ui/crosses";
import { Ripple } from "@/components/magicui/ripple";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import NextLink from "next/link";

export const Cta = () => {
  return (
    <>
      <div className="relative flex h-[450px] items-center justify-center overflow-hidden border-t px-6 py-10 md:px-10 md:py-16">
        <Ripple mainCircleSize={150} mainCircleOpacity={0.18} className="absolute" />
        <div className="w-full max-w-md space-y-5 md:space-y-6">
          {/*<div className="text-foreground flex items-center justify-center gap-1.5 md:justify-start">*/}
          {/*  <Cloud className="size-4" />*/}
          {/*  <span className="text-muted-foreground text-[0.825rem]">5GB free storage</span>*/}
          {/*</div>*/}
          <h2 className="bg-gradient-to-br from-black to-zinc-600 bg-clip-text text-center text-4xl font-medium text-transparent md:text-5xl md:leading-13 dark:from-white dark:to-zinc-400">
            Global storage
            <br /> for developers
          </h2>
          <p className="text-muted-foreground mx-auto max-w-[440px] text-center text-base md:mx-0">
            The storage layer that doesn’t slow you down. <br></br> Simple to integrate. Powerful
            when it counts.
          </p>
          <div className="flex flex-col justify-center gap-3 md:flex-row">
            <Button
              asChild
              onClick={() => track("Start for free", { location: "final-cta" })}
              className="h-10 rounded-full md:h-9 md:w-[170px]"
            >
              <NextLink href="/register">
                Start for free <ChevronRight />
              </NextLink>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="h-10 rounded-full backdrop-blur md:h-9"
              onClick={() => track("Star on Github", { location: "final-cta" })}
            >
              <a href="https://github.com/restashio/restash" target="_blank" rel="noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"></path>
                </svg>
                Star on Github <ChevronRight />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="relative">
        <Crosses />
      </div>
    </>
  );
};
