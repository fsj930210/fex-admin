export const cardClassName = [
  'group/card flex flex-col gap-[var(--card-spacing)] overflow-hidden',
  '[--card-spacing:16px]',
  'data-[size=sm]:[--card-spacing:12px] data-[size=md]:[--card-spacing:16px] data-[size=lg]:[--card-spacing:24px]',
  'rounded-md bg-card-background py-[var(--card-spacing)] text-sm text-card-foreground ring-1 ring-foreground/10',
  'has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0',
  '*:[img:first-child]:rounded-t-md *:[img:last-child]:rounded-b-md',
].join(' ')

export const cardHeaderClassName = [
  'group/card-header @container/card-header grid auto-rows-min items-start',
  'gap-1 rounded-t-md px-[var(--card-spacing)]',
  'has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
  '[.border-b]:pb-[var(--card-spacing)]',
].join(' ')

export const cardTitleClassName =
  'text-base font-medium leading-snug text-foreground group-data-[size=sm]/card:text-sm'

export const cardDescriptionClassName = 'text-sm text-muted-foreground'

export const cardActionClassName = 'col-start-2 row-span-2 row-start-1 self-start justify-self-end'

export const cardContentClassName = 'px-[var(--card-spacing)]'

export const cardFooterClassName =
  'flex items-center rounded-b-md border-t border-border bg-muted-background/50 p-[var(--card-spacing)]'
