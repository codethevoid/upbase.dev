"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { useToken } from "@/hooks/swr/use-token";

export const MainNav = () => {
  const { token, isLoading } = useToken();

  return (
    <nav className={"sticky top-0 px-4 py-2.5"}>
      <div className={"mx-auto flex max-w-screen-lg items-center justify-between"}>
        <NextLink href={"/"} className={"text-lg font-semibold"}>
          upbase
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
              <Button asChild variant="outline" size="sm">
                <NextLink href={"/login"}>Login</NextLink>
              </Button>
              <Button asChild size="sm">
                <NextLink href={"/register"}>Register</NextLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
