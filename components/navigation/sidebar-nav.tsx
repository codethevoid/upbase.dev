"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import NextLink from "next/link";
import {
  CircleUser,
  DatabaseZap,
  Key,
  Link2,
  LogOut,
  Moon,
  Package,
  Settings,
  Sun,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useToken } from "@/hooks/swr/use-token";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

const links = [
  {
    label: "Storage",
    href: "/storage",
    icon: <Package />,
  },
  {
    label: "Invalidations",
    href: "/invalidations",
    icon: <DatabaseZap />,
  },
  // {
  //   label: "Metrics",
  //   href: "/metrics",
  //   icon: <ChartColumnBig />,
  // },
  {
    label: "API keys",
    href: "/api-keys",
    icon: <Key />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings />,
  },
];

export const SidebarNav = () => {
  const path = usePathname();
  const { token } = useToken();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarContent className="p-1">
        <SidebarHeader className="p-3 font-semibold">
          <NextLink href="/storage">upbase</NextLink>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-muted-foreground hover:bg-sidebar-accent/30 transition-colors duration-75",
                      path.startsWith(item.href) &&
                        "bg-sidebar-accent/80 text-sidebar-accent-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <NextLink href={item.href}>
                      {item.icon} {item.label}
                    </NextLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-muted-foreground hover:bg-sidebar-accent/30 cursor-pointer transition-colors duration-75">
                  <div className="from-accent to-background flex size-6 shrink-0 items-center justify-center rounded-full border bg-gradient-to-bl">
                    <span className="text-smaller text-foreground font-medium uppercase">R</span>
                  </div>
                  <span className="text-smaller min-w-0 truncate">{token?.user?.email}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[var(--radix-popper-anchor-width)]">
                <DropdownMenuItem asChild>
                  <NextLink href="/profile">
                    <CircleUser />
                    <span>My profile</span>
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                >
                  <Moon className="dark:hidden" /> <Sun className="hidden dark:block" />
                  <span>Toggle theme</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NextLink href="/">
                    <Link2 className="rotate-45" />
                    <span>Homepage</span>
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => signOut({ redirectTo: "/login" })}>
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
