"use client";

import { useState } from "react";
import NextLink from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTeam } from "@/hooks/swr/use-team";

const ITEMS_TO_DISPLAY = 3;

export const Breadcrumbs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "/";
  const items = key
    .split("/")
    .filter((item) => item)
    .slice(1);

  const { team } = useTeam();

  if (!path.includes("/storage")) return null;

  const getKey = (item: string) => {
    const index = items.indexOf(item);
    return `${team?.id}/${items.slice(0, index + 1).join("/")}/`;
  };

  return (
    <nav>
      <div className="flex items-center gap-1.5">
        <NextLink
          href="/storage"
          className="hover:text-foreground text-smaller text-muted-foreground transition-colors"
        >
          storage
        </NextLink>

        {items.length > 0 && <span className="text-muted-foreground text-sm">/</span>}
        {items.length >= ITEMS_TO_DISPLAY ? (
          <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger
                className="flex cursor-pointer items-center gap-1"
                aria-label="Toggle menu"
              >
                <Ellipsis className="text-muted-foreground size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {items.slice(0, -2).map((item, index) => (
                  <DropdownMenuItem key={index} onClick={() => setIsOpen(false)} asChild>
                    <NextLink
                      href={`/storage?${new URLSearchParams({ key: getKey(item) }).toString()}`}
                    >
                      {item}
                    </NextLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-muted-foreground text-sm">/</span>
          </>
        ) : null}
        {items.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {index !== items.slice(-ITEMS_TO_DISPLAY + 1).length - 1 ? (
              <>
                <NextLink
                  href={`/storage?${new URLSearchParams({ key: getKey(item) }).toString()}`}
                  className="text-muted-foreground text-smaller hover:text-foreground transition-colors"
                >
                  {item}
                </NextLink>
                <span className="text-muted-foreground text-sm">/</span>
              </>
            ) : (
              <p className="text-smaller truncate">{item}</p>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
