export const tooltipContentClassName = [
  'pointer-events-none z-[var(--floating-z-index,50)] max-w-[min(var(--floating-available-width,calc(100vw-16px)),var(--tooltip-content-max-width,280px))]',
  'rounded-md bg-[var(--tooltip-background,var(--foreground))] px-2 py-1.5 text-xs leading-5 text-[var(--tooltip-foreground,var(--background))] shadow-md',
  'origin-[var(--floating-transform-origin)] will-change-[opacity,transform]',
  'transition-[opacity,transform] duration-[var(--tooltip-motion-duration,100ms)] ease-[var(--tooltip-motion-ease,cubic-bezier(0.2,0,0,1))]',
  'data-[state=open]:translate-x-0 data-[state=open]:translate-y-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
  'data-[side=top]:data-[state=closed]:translate-y-1 data-[side=bottom]:data-[state=closed]:-translate-y-1',
  'data-[side=left]:data-[state=closed]:translate-x-1 data-[side=right]:data-[state=closed]:-translate-x-1',
  'data-[phase=closing]:scale-95 data-[phase=closing]:opacity-0 data-[state=closed]:scale-95 data-[state=closed]:opacity-0',
].join(' ')

export const tooltipArrowClassName = [
  'pointer-events-none absolute size-2 bg-[var(--tooltip-background,var(--foreground))]',
  'data-[side=top]:-bottom-1 data-[side=bottom]:-top-1 data-[side=left]:-right-1 data-[side=right]:-left-1',
  'data-[side=top]:-translate-x-1/2 data-[side=top]:rotate-45 data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:rotate-45',
  'data-[side=left]:-translate-y-1/2 data-[side=left]:rotate-45 data-[side=right]:-translate-y-1/2 data-[side=right]:rotate-45',
].join(' ')
