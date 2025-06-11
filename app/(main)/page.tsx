import { Hero } from "@/app/(main)/(landing)/hero";
import { Setup } from "@/app/(main)/(landing)/setup";
import { Features } from "@/app/(main)/(landing)/features";
import { Pricing } from "@/app/(main)/(landing)/pricing";

export default function Home() {
  return (
    <div className="px-2 py-8 md:px-8">
      <div className="mx-auto max-w-screen-xl border">
        <Hero />
        <Setup />
        <Features />
        <Pricing />
      </div>
    </div>
  );
}
