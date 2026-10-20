import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

import { pages, type Page } from '@/lib/pages'

function AsciiRule() {
  return (
    <div aria-hidden="true" className="flex select-none whitespace-pre leading-none">
      <span>+</span>
      <span className="min-w-0 flex-1 overflow-hidden">{'-'.repeat(160)}</span>
      <span>+</span>
    </div>
  )
}

export function TerminalNavbar({ page }: { page: Page | null }) {
  return (
    <div className="mx-auto w-full max-w-3xl font-terminal text-xs text-terminal-foreground sm:text-sm">
      <AsciiRule />
      <div className="flex items-center">
        <span aria-hidden="true" className="select-none">|</span>
        <NavigationMenu aria-label="Main navigation" className="min-w-0 max-w-none">
          <NavigationMenuList className="grid w-full grid-cols-3">
            {Object.entries(pages).map(([key, item]) => (
              <NavigationMenuItem key={key} className="min-w-0">
                <NavigationMenuLink
                  href={`#/${key}`}
                  variant="terminal"
                  active={page === key}
                  aria-current={page === key ? 'page' : undefined}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <span aria-hidden="true" className="select-none">|</span>
      </div>
      <AsciiRule />
    </div>
  )
}
