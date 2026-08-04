import { cva } from 'class-variance-authority'

export const treeRootClassName = 'min-w-0 outline-none'

export const treeViewportClassName = 'min-w-0'

export const treeItemClassName = cva(
  [
    'group/tree-item relative flex w-fit max-w-full min-w-0 items-center gap-1 rounded-md px-1 text-sm outline-none data-[block=true]:w-full',
    'focus-visible:ring-3 focus-visible:ring-focus/50',
    'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
    'data-[dnd-enabled=true]:cursor-grab data-[dnd-enabled=true]:touch-none data-[dnd-enabled=true]:select-none data-[dragging=true]:opacity-35',
    'data-[drag-preview=true]:gap-0 data-[drag-preview=true]:shadow-lg [&[data-drag-preview=true]>[data-slot=tree-trigger]]:hidden [&[data-drag-preview=true]>[data-slot=tree-trigger-placeholder]]:hidden',
    'data-[drag-preview=true]:border data-[drag-preview=true]:border-border data-[drag-preview=true]:bg-background data-[drag-preview=true]:text-foreground data-[drag-preview=true]:opacity-75 data-[drag-preview=true]:shadow-xl data-[drag-preview=true]:ring-1 data-[drag-preview=true]:ring-border/70',
    "before:pointer-events-none before:absolute before:left-[var(--tree-drop-inline-start,var(--tree-item-inline-start))] before:z-20 before:hidden before:h-0.5 before:w-[var(--tree-drop-inline-width,100%)] before:rounded-full before:bg-primary before:content-['']",
    "after:pointer-events-none after:absolute after:left-[calc(var(--tree-drop-inline-start,var(--tree-item-inline-start))-4px)] after:z-20 after:hidden after:size-2 after:rounded-full after:border-2 after:border-primary after:bg-background after:content-['']",
    'data-[drop-position=bottom]:z-30 data-[drop-position=inside]:z-30',
    'data-[drop-position=bottom]:before:block data-[drop-position=bottom]:before:bottom-0 data-[drop-position=bottom]:after:block data-[drop-position=bottom]:after:-bottom-[3px]',
    'data-[drop-position=inside]:before:block data-[drop-position=inside]:before:bottom-0 data-[drop-position=inside]:after:block data-[drop-position=inside]:after:-bottom-[3px]',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'min-h-7',
        default: 'min-h-8',
        lg: 'min-h-9',
      },
    },
    defaultVariants: { size: 'default' },
  },
)

export const treeTriggerClassName = [
  'inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-transform',
  'hover:bg-muted-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/50',
  '-rotate-90 aria-expanded:rotate-0 disabled:pointer-events-none',
].join(' ')

export const treeTitleClassName = [
  'min-w-0 w-max max-w-full truncate rounded-md px-1',
  'group-data-[selected=true]/tree-item:bg-primary/10 group-data-[selected=true]/tree-item:text-primary',
  'group-data-[block=true]/tree-item:flex-1',
].join(' ')

export const treeDropIndicatorClassName = [
  'pointer-events-none absolute z-20 h-0.5 rounded-full bg-primary',
  'before:absolute before:left-0 before:top-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border-2 before:border-primary before:bg-background',
].join(' ')
