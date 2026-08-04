import { cva, type VariantProps } from 'class-variance-authority'

export const sliderRootClassName = cva('relative touch-none select-none', {
  variants: {
    size: {
      sm: '[--slider-track-height:4px] [--slider-thumb-size:14px]',
      default: '[--slider-track-height:6px] [--slider-thumb-size:16px]',
      lg: '[--slider-track-height:8px] [--slider-thumb-size:20px]',
    },
    orientation: {
      horizontal: 'h-[var(--slider-thumb-size)] min-w-0',
      vertical: 'h-40 w-[var(--slider-thumb-size)]',
    },
  },
  defaultVariants: {
    size: 'default',
    orientation: 'horizontal',
  },
})

export const sliderInputClassName = [
  'h-[var(--slider-thumb-size)] w-full min-w-0 cursor-pointer appearance-none bg-transparent outline-none',
  'disabled:cursor-not-allowed disabled:opacity-50',
  '[&::-webkit-slider-runnable-track]:h-[var(--slider-track-height)] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-input',
  '[&::-webkit-slider-thumb]:mt-[calc((var(--slider-track-height)-var(--slider-thumb-size))/2)] [&::-webkit-slider-thumb]:size-[var(--slider-thumb-size)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm',
  '[&::-moz-range-track]:h-[var(--slider-track-height)] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-input',
  '[&::-moz-range-progress]:h-[var(--slider-track-height)] [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-primary',
  '[&::-moz-range-thumb]:size-[var(--slider-thumb-size)] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm',
  'focus-visible:[&::-webkit-slider-thumb]:ring-3 focus-visible:[&::-webkit-slider-thumb]:ring-focus/50',
  'focus-visible:[&::-moz-range-thumb]:ring-3 focus-visible:[&::-moz-range-thumb]:ring-focus/50',
].join(' ')

export const sliderValueClassName = 'text-sm text-muted-foreground'

export const sliderTrackClassName = [
  'absolute block overflow-hidden rounded-full bg-border',
  'data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:h-[var(--slider-track-height)] data-[orientation=horizontal]:w-full data-[orientation=horizontal]:-translate-y-1/2',
  'data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[var(--slider-track-height)] data-[orientation=vertical]:-translate-x-1/2',
  'data-[disabled=true]:bg-border',
].join(' ')

export const sliderRangeClassName = [
  'absolute rounded-full bg-primary data-[disabled=true]:bg-muted-foreground',
  'data-[orientation=horizontal]:inset-y-0',
  'data-[orientation=vertical]:inset-x-0',
].join(' ')

export const sliderThumbClassName = [
  'z-10 block size-[var(--slider-thumb-size)] cursor-pointer rounded-full border border-primary bg-background shadow-md outline-none transition-shadow hover:shadow-lg',
  'focus-visible:ring-3 focus-visible:ring-focus/50',
  'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-muted-foreground',
].join(' ')

export type SliderStyleProps = VariantProps<typeof sliderRootClassName>
