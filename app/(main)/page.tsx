import { Hero } from "@/app/(main)/(landing)/hero";
import { CodeExamples } from "@/app/(main)/(landing)/code-examples";
import { Features } from "@/app/(main)/(landing)/features";
import { Pricing } from "@/app/(main)/(landing)/pricing";
import { Cta } from "@/app/(main)/(landing)/cta";
import { Callout } from "@/app/(main)/(landing)/callout";

export default function Home() {
  return (
    <div className="overflow-hidden px-2 py-1 md:px-8">
      <div className="mx-auto max-w-screen-xl border">
        <Callout />
        <Hero />
        <CodeExamples />
        <Features />
        <Pricing />
        <Cta />
      </div>
    </div>
  );
}
