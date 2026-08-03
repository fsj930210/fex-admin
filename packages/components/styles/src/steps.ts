import { cva, type VariantProps } from 'class-variance-authority'

export const stepsClassName = cva(
  [
    'group/steps @container/steps m-0 grid list-none p-0 text-foreground',
    '[--step-indicator-size:2rem] [--step-line-size:2px]',
  ].join(' '),
  {
    variants: {
      orientation: {
        horizontal: 'grid-cols-1 gap-y-4',
        vertical: 'grid-cols-1 gap-y-4',
      },
      responsive: { true: '', false: '' },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        responsive: true,
        class: 'grid-cols-1 md:grid-flow-col md:auto-cols-fr',
      },
      {
        orientation: 'horizontal',
        responsive: false,
        class: 'grid-flow-col auto-cols-fr',
      },
    ],
    defaultVariants: { orientation: 'horizontal', responsive: true },
  },
)

export const stepClassName = [
  'group/step relative grid min-w-0 grid-cols-[var(--step-indicator-size)_minmax(0,1fr)] gap-x-3',
  'after:absolute after:left-[calc(var(--step-indicator-size)/2-var(--step-line-size)/2)] after:top-[var(--step-indicator-size)] after:h-[calc(100%-var(--step-indicator-size)+1rem)] after:w-[var(--step-line-size)] after:bg-border last:after:hidden',
  '@[36rem]/steps:group-data-[orientation=horizontal]/steps:grid-cols-1 @[36rem]/steps:group-data-[orientation=horizontal]/steps:grid-rows-[var(--step-indicator-size)_auto] @[36rem]/steps:group-data-[orientation=horizontal]/steps:gap-x-0 @[36rem]/steps:group-data-[orientation=horizontal]/steps:gap-y-2 @[36rem]/steps:group-data-[orientation=horizontal]/steps:pb-0',
  '@[36rem]/steps:group-data-[orientation=horizontal]/steps:after:left-[var(--step-indicator-size)] @[36rem]/steps:group-data-[orientation=horizontal]/steps:after:top-[calc(var(--step-indicator-size)/2-var(--step-line-size)/2)] @[36rem]/steps:group-data-[orientation=horizontal]/steps:after:h-[var(--step-line-size)] @[36rem]/steps:group-data-[orientation=horizontal]/steps:after:w-[calc(100%-var(--step-indicator-size))]',
  'data-[status=finish]:after:bg-primary',
  'data-[navigation=true]:cursor-pointer data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
].join(' ')

export const stepIndicatorClassName = [
  'relative z-10 inline-flex size-[var(--step-indicator-size)] items-center justify-center rounded-full border-2 border-border bg-background text-xs font-medium text-muted-foreground',
  'group-data-[status=process]/step:border-primary group-data-[status=process]/step:text-primary',
  'group-data-[status=finish]/step:border-primary group-data-[status=finish]/step:bg-primary group-data-[status=finish]/step:text-primary-foreground',
  'group-data-[status=error]/step:border-destructive group-data-[status=error]/step:text-destructive',
  '[&_svg]:size-4',
].join(' ')

export const stepContentClassName = 'min-w-0 pb-4 text-sm @[36rem]/steps:group-data-[orientation=horizontal]/steps:pb-0'

export type StepsStyleProps = VariantProps<typeof stepsClassName>
