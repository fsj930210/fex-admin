import { cva } from 'class-variance-authority'

export const cardClassName = cva(
  [
    'flex flex-col overflow-hidden',
    'rounded-md border border-border bg-card-background text-card-foreground',
  ].join(' '),
)

export const cardHeaderClassName = cva(
  [
    '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start',
    'gap-space-sm px-space-xl py-space-lg',
    'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
  ].join(' '),
)

export const cardTitleClassName = cva('text-base font-semibold leading-none text-foreground')

export const cardDescriptionClassName = cva('text-sm leading-6 text-muted-foreground')

export const cardActionClassName = cva(
  'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
)

export const cardContentClassName = cva('px-space-xl py-space-lg')

export const cardFooterClassName = cva('flex items-center px-space-xl py-space-lg')
