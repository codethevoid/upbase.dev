import { MainNav } from "@/components/navigation/main-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MainNav />
      {children}
    </div>
  );
}