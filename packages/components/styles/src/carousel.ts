import { cva } from 'class-variance-authority'

export const carouselRootClassName = 'relative min-w-0'
export const carouselViewportClassName = 'overflow-hidden'
// Embla AutoHeight writes the measured height to containerNode(), i.e. this track.
// Do not transition height here: it forces reflow while Embla is moving slides.
export const carouselTrackClassName = cva('flex items-start touch-pan-y', { variants: { orientation: { horizontal: 'flex-row', vertical: 'flex-col' } }, defaultVariants: { orientation: 'horizontal' } })
export const carouselSlideClassName = 'min-w-0 shrink-0 grow-0 basis-full'
export const carouselControlClassName = 'inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'
export const carouselIndicatorsClassName = 'mt-3 flex justify-center gap-1.5'
export const carouselIndicatorClassName = 'size-2 cursor-pointer rounded-full bg-muted-foreground/30 transition-colors hover:bg-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 aria-current:bg-primary disabled:cursor-not-allowed disabled:opacity-50'
