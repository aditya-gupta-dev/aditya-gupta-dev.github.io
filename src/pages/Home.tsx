import BlackHole from "@/origin-kit/black-hole";

export default function Home() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-black overflow-hidden">
      <h1 className="absolute top-10 md:top-12 z-10 text-2xl sm:text-4xl md:text-5xl text-white font-geist-pixel tracking-wider text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] px-4 leading-snug">
        Aditya Gupta
      </h1>
      
      {/* Responsive square container for the Black Hole */}
      <div className="flex items-center justify-center w-[95vw] h-[95vw] max-w-[500px] max-h-[500px] pointer-events-none mt-16 md:mt-0">
        <BlackHole />
      </div>
    </div>
  );
}
