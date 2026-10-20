import { ArchLinuxLogo } from '@/components/arch-linux-logo'
import { useEffect, useSyncExternalStore } from 'react'
import { TerminalNavbar } from '@/components/terminal-navbar'
import { pages, type Page } from '@/lib/pages'
import { TerminalPage } from '@/components/terminal-page'
import { cn } from '@/lib/utils'

function subscribeToPage(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function currentPage(): Page | null {
  const path = window.location.hash.slice(2)
  return Object.hasOwn(pages, path) ? path as Page : null
}

function App() {
  const page = useSyncExternalStore(subscribeToPage, currentPage, () => null)

  useEffect(() => {
    document.title = page ? `${pages[page].title} | Aditya Gupta` : 'Aditya Gupta | Portfolio'
  }, [page])

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="px-4 pt-5 sm:px-8 sm:pt-8">
        <TerminalNavbar page={page} />
      </header>
      <main
        id="main-content"
        className={cn(
          'grid flex-1 justify-items-center px-6 py-8 sm:px-10',
          page === 'astronomy' ? 'content-start pt-4 sm:pt-6' : 'items-center',
        )}
      >
        {page ? <TerminalPage page={page} /> : (
          <div className="flex flex-col items-center gap-6">
            <h1 className="sr-only">Aditya Gupta — Portfolio</h1>
            <ArchLinuxLogo />
            <p className="font-terminal text-base leading-relaxed font-medium text-foreground/90 sm:text-lg">
              I use Arch, btw
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
