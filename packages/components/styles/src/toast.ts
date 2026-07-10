import { cva, type VariantProps } from 'class-variance-authority'

export const toastViewportClassName = cva(
  [
    'pointer-events-none fixed z-50 flex max-h-screen w-[min(440px,calc(100vw-32px))] flex-col gap-2',
    '[--toast-offset:24px]',
  ].join(' '),
  {
    variants: {
      placement: {
        top: 'left-1/2 top-[var(--toast-offset)] -translate-x-1/2 items-center',
        'top-left': 'left-[var(--toast-offset)] top-[var(--toast-offset)] items-start',
        'top-right': 'right-[var(--toast-offset)] top-[var(--toast-offset)] items-end',
        bottom: 'bottom-[var(--toast-offset)] left-1/2 -translate-x-1/2 items-center',
        'bottom-left': 'bottom-[var(--toast-offset)] left-[var(--toast-offset)] items-start',
        'bottom-right': 'bottom-[var(--toast-offset)] right-[var(--toast-offset)] items-end',
      },
    },
    defaultVariants: {
      placement: 'top',
    },
  },
)

export const toastRootClassName = cva(
  [
    'pointer-events-auto grid min-h-10 w-fit min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 rounded-md border px-3 py-2 text-sm',
    'border-border/80 bg-popover-background text-popover-foreground shadow-[0_6px_16px_0_rgba(0,0,0,0.08),0_3px_6px_-4px_rgba(0,0,0,0.12),0_9px_28px_8px_rgba(0,0,0,0.05)]',
    'transition-[opacity,transform] duration-150 ease-out',
    'has-[[data-slot=toast-icon]]:grid-cols-[auto_minmax(0,1fr)_auto]',
    '[&_[data-slot=toast-icon]]:text-info',
  ].join(' '),
  {
    variants: {
      variant: {
        default: '',
        success: '[&_[data-slot=toast-icon]]:text-success',
        info: '[&_[data-slot=toast-icon]]:text-info',
        warning: '[&_[data-slot=toast-icon]]:text-warning',
        error: '[&_[data-slot=toast-icon]]:text-danger',
        loading: '[&_[data-slot=toast-icon]]:text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const toastIconClassName = 'row-span-2 flex size-4 shrink-0 items-center justify-center self-center text-current'
export const toastTitleClassName = 'min-w-0 font-normal leading-5 text-foreground'
export const toastDescriptionClassName = 'text-sm leading-5 text-muted-foreground'
export const toastActionClassName = 'col-start-2 mt-1'
export const toastCloseClassName = 'row-span-2 -mr-1 grid size-5 place-items-center self-center rounded-md text-muted-foreground hover:text-foreground'
export const toastStackLayerClassName =
  'pointer-events-none absolute left-1/2 z-0 h-10 w-[calc(100%-16px)] -translate-x-1/2 rounded-md border border-border/60 bg-popover-background shadow-sm'

export const toastStackContainerClassName = cva('relative flex w-full flex-col gap-2', {
  variants: {
    placement: {
      top: 'items-center',
      'top-left': 'items-start',
      'top-right': 'items-end',
      bottom: 'items-center',
      'bottom-left': 'items-start',
      'bottom-right': 'items-end',
    },
  },
})

export const toastStackItemsClassName = cva('relative z-10 flex w-full flex-col gap-2', {
  variants: {
    placement: {
      top: 'items-center',
      'top-left': 'items-start',
      'top-right': 'items-end',
      bottom: 'items-center',
      'bottom-left': 'items-start',
      'bottom-right': 'items-end',
    },
  },
})

export type ToastPlacement = NonNullable<VariantProps<typeof toastViewportClassName>['placement']>
export type ToastStyleProps = VariantProps<typeof toastRootClassName>
