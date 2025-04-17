import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/navigation/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <div className="max-w-full min-w-0 flex-1">
        <DashboardNav />
        <main className="mx-auto max-w-screen-lg px-4 py-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
