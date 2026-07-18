import { cva } from 'class-variance-authority'

export const scrollbarRootClassName = 'relative isolate overflow-hidden'
export const scrollbarViewportClassName = cva([
  'size-full overflow-auto',
  '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
], {
  variants: {
    overflowX: { auto: 'overflow-x-auto', hidden: 'overflow-x-hidden' },
    overflowY: { auto: 'overflow-y-auto', hidden: 'overflow-y-hidden' },
  },
  defaultVariants: { overflowX: 'auto', overflowY: 'auto' },
})
export const scrollbarBarClassName = cva(
  'absolute z-10 select-none touch-none transition-opacity duration-150 data-[visible=false]:pointer-events-none data-[visible=false]:opacity-0',
  { variants: { axis: { x: 'inset-x-0 bottom-0 h-2 p-px', y: 'inset-y-0 end-0 w-2 p-px' } } },
)
export const scrollbarTrackClassName = 'relative size-full rounded-md bg-transparent'
export const scrollbarThumbClassName = cva('absolute rounded-md bg-foreground/55 transition-colors hover:bg-foreground/75 data-[dragging=true]:bg-primary', {
  variants: { axis: { x: 'inset-y-0 start-0', y: 'inset-x-0 top-0' } },
})
export const scrollbarCornerClassName = 'absolute bottom-0 end-0 z-10 size-2 bg-transparent'
