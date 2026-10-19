import { ArchLinuxLogo } from '@/components/arch-linux-logo'

function App() {
  return (
    <main className="grid min-h-svh place-items-center bg-background p-6 text-foreground sm:p-10">
      <h1 className="sr-only">Aditya Gupta — Portfolio</h1>
      <div className="flex flex-col items-center gap-6">
        <ArchLinuxLogo />
        <p className="font-terminal text-base leading-relaxed font-medium text-foreground/90 sm:text-lg">
          I use Arch, btw
        </p>
      </div>
    </main>
  )
}

export default App
