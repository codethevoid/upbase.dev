"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Suspense } from "react";

export const DashboardNav = () => {
  return (
    <div className="border-b px-4 py-2.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <SidebarTrigger className="text-muted-foreground" />
          <Suspense>
            <Breadcrumbs />
          </Suspense>
        </div>
        <div className="flex items-center gap-4">
          {/*<Button size="sm" variant="outline">*/}
          {/*  Feedback*/}
          {/*</Button>*/}
          {/*<NextLink*/}
          {/*  href="/"*/}
          {/*  className="text-muted-foreground hover:text-foreground text-sm transition-colors"*/}
          {/*>*/}
          {/*  Help*/}
          {/*</NextLink>*/}
          <a
            href="https://docs.restash.io"
            target="_blank"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Docs
          </a>
        </div>
      </div>
    </div>
  );
};
