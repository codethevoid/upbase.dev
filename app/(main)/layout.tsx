import { MainNav } from "@/components/navigation/main-nav";
import { Footer } from "@/components/navigation/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MainNav />
      {children}
      <Footer />
    </div>
  );
}
