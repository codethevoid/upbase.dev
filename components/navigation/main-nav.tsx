"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";

export const MainNav = () => {

  return (
    <nav className={"px-4 py-2.5"}>
      <div className={"max-w-screen-lg mx-auto flex items-center justify-between"}>
        <NextLink href={"/"} className={"font-semibold text-lg"}>Upbase</NextLink>
        <div className={"flex items-center gap-2"}>
          <Button asChild variant="outline" size="sm">
            <NextLink href={"/login"}>Login</NextLink>
          </Button>
          <Button asChild size="sm">
            <NextLink href={"/register"}>Register</NextLink>
          </Button>
        </div>
      </div>
    </nav>
  );
};