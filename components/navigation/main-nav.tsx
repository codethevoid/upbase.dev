"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { useToken } from "@/hooks/swr/use-token";
import { ChevronRight } from "lucide-react";

export const MainNav = () => {
  const { token, isLoading } = useToken();

  return (
    <nav className={"px-6 py-2.5"}>
      <div className={"mx-auto flex max-w-screen-lg items-center justify-between"}>
        <NextLink href={"/"} className={"text-lg font-semibold"}>
          Restash
        </NextLink>
        <div className={"flex items-center gap-2"}>
          {isLoading ? (
            <div className="h-8" />
          ) : token ? (
            <Button size="sm" asChild>
              <NextLink href={"/storage"}>Dashboard</NextLink>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <NextLink href={"/login"}>Sign in</NextLink>
              </Button>
              <Button asChild size="sm">
                <NextLink href={"/register"}>
                  Get started <ChevronRight />
                </NextLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
