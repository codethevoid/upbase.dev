"use client";

import NextLink from "next/link";
import { RestashIcon } from "@/components/icons/restash";
import { Button } from "@/components/ui/button";
import { useScrollPosition } from "@/hooks/utils/use-scroll-position";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics";

export const MainNav = () => {
  const scrollPos = useScrollPosition();
  return (
    <nav
      className={cn(
        "bg-background/50 sticky top-0 z-90 mx-auto w-full rounded-full border border-transparent px-4 backdrop-blur transition-all md:px-8",
        scrollPos > 10 &&
          "border-border top-3 w-[340px] px-4 shadow-xl md:w-[600px] md:px-4 dark:shadow-none",
      )}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between py-3">
        <NextLink href={"/"} className={"flex items-center gap-2 font-medium"}>
          <RestashIcon />
          <span className="relative top-[1px]">Restash</span>
        </NextLink>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="rounded-full" size="sm" asChild>
            <NextLink href="/login">Log in</NextLink>
          </Button>
          <Button
            className="rounded-full"
            size="sm"
            asChild
            onClick={() => track("Sign up", { location: "main-nav" })}
          >
            <NextLink href="/register">Sign up</NextLink>
          </Button>
        </div>
      </div>
    </nav>
  );
};
