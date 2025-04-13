"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

export const DashboardNav = () => {
  return (
    <div className="border-b px-4 py-2.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground" />
          <Breadcrumbs />
        </div>
        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline">
            Feedback
          </Button>
          <NextLink
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Help
          </NextLink>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Docs
          </a>
        </div>
      </div>
    </div>
  );
};
