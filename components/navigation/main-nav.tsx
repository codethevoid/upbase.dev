"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { useToken } from "@/hooks/swr/use-token";

export const MainNav = () => {

  const { token, isLoading } = useToken();

  return (
    <nav className={"px-4 py-2.5"}>
      <div className={"max-w-screen-lg mx-auto flex items-center justify-between"}>
        <NextLink href={"/"} className={"font-semibold text-lg"}>upbase</NextLink>
        <div className={"flex items-center gap-2"}>
          {isLoading ? <div className="h-8" /> : token ? (
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