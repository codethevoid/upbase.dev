import { Hero } from "@/app/(main)/(landing)/hero";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

export default function Home() {
  return (
    <div className="relative h-[calc(100vh-122px)] min-h-fit">
      <div className="absolute inset-0 z-[-1]">
        <div className="from-background to-background absolute inset-0 z-10 bg-gradient-to-b via-transparent"></div>
        <div className="from-background to-background absolute inset-0 z-10 bg-gradient-to-r via-transparent"></div>
        <AnimatedGridPattern maxOpacity={0.07} className="z-[-1]" />
      </div>
      <Hero />
    </div>
  );
}
