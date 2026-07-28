import { Suspense, lazy } from "react";
import { Spinner } from "@/components/ui/8bit/spinner";
import { Label } from "@/components/ui/8bit/label";
import { Navbar } from "@/components/layout/Navbar";

const BlackHole = lazy(() => import("@/origin-kit/black-hole"));

export default function Home() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-background overflow-hidden">
      
      <Navbar />

      <Label className="absolute top-24 md:top-32 z-10 text-md sm:text-md md:text-lg text-foreground tracking-wider text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] px-4 leading-snug">
        Hi, Explorer !!
      </Label>
      
      <div className="flex items-center justify-center w-[95vw] h-[95vw] max-w-[800px] max-h-[800px] pointer-events-none mt-16 md:mt-0">
        <Suspense fallback={<Spinner variant="diamond" className="size-16 text-foreground" />}>
          <BlackHole />
        </Suspense>
      </div>
    </div>
  );
}
