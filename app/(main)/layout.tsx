import { MainNav } from "@/components/navigation/main-nav";
import { Footer } from "@/components/navigation/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNav />
      {children}
      <Footer />
    </>
  );
}
