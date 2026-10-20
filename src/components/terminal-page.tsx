import { pages, type Page } from '@/lib/pages'
import { EarthriseArt } from '@/components/earthrise-art'

export function TerminalPage({ page }: { page: Page }) {
  const content = pages[page]

  if (page === 'astronomy') {
    return (
      <section aria-labelledby="astronomy-title" className="flex w-full flex-col items-center gap-6 font-terminal text-terminal-foreground">
        <h1 id="astronomy-title" className="sr-only">Astronomy</h1>
        <EarthriseArt />
        <a href="#/" className="flex min-h-11 items-center gap-1 text-sm underline-offset-8 hover:underline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current">
          <span aria-hidden="true">{'< '}</span>back home
        </a>
      </section>
    )
  }

  return (
    <section aria-labelledby="page-title" className="flex w-full max-w-xl flex-col gap-6 font-terminal text-terminal-foreground">
      <p className="text-xs sm:text-sm">{`$ cd ~/${page}`}</p>
      <h1 id="page-title" className="text-2xl font-medium sm:text-3xl">{content.title}</h1>
      <p className="text-sm leading-7 sm:text-base">{content.description}</p>
      <p className="text-xs leading-6 sm:text-sm">{`[ ${content.status} ]`}</p>
      <a href="#/" className="mt-2 flex min-h-11 w-fit items-center gap-1 text-sm underline-offset-8 hover:underline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current">
        <span aria-hidden="true">{'< '}</span>back home
      </a>
    </section>
  )
}
