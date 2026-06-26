import { cva, type VariantProps } from 'class-variance-authority'

export const buttonClassName = cva(
  [
    'group inline-flex items-center justify-center whitespace-nowrap',
    'rounded-md text-sm font-medium leading-normal',
    'cursor-pointer select-none border',
    'shadow-[0_1px_1px_rgb(0_0_0/0.04)] transition-[background-color,color,border-color,box-shadow,opacity]',
    'duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45',
    'data-[loading=true]:pointer-events-none data-[loading=true]:cursor-wait data-[loading=true]:opacity-75',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/85 active:bg-primary/75',
        outline:
          'border-border bg-background text-foreground hover:bg-muted-background hover:text-foreground aria-expanded:bg-muted-background aria-expanded:text-foreground',
        secondary:
          'border-transparent bg-secondary-background text-foreground hover:bg-hover-background aria-expanded:bg-secondary-background aria-expanded:text-foreground',
        ghost:
          'border-transparent bg-transparent text-foreground shadow-none hover:bg-muted-background hover:text-foreground aria-expanded:bg-muted-background aria-expanded:text-foreground',
        destructive:
          'border-transparent bg-danger/10 text-danger hover:bg-danger/18 focus-visible:border-danger/40 focus-visible:ring-danger/20',
        link:
          'h-auto border-transparent bg-transparent px-0 text-link shadow-none underline-offset-4 transition-colors hover:text-link-hover hover:underline',
        dashed: 'border-dashed border-border bg-background text-foreground hover:bg-muted-background',
      },
      effect: {
        'expand-icon': 'group gap-0 relative',
        'ring-hover':
          'transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2',
        shine:
          'relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat before:animate-shine',
        'shine-hover':
          'relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position] hover:before:bg-[position:-100%_0,0_0] before:duration-1000',
        'gooey-right':
          'relative z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:from-white/40 before:transition-transform before:duration-1000 hover:before:translate-x-0 hover:before:translate-y-0',
        'gooey-left':
          'relative z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:from-white/40 after:transition-transform after:duration-1000 hover:after:translate-x-0 hover:after:translate-y-0',
        underline:
          'relative !no-underline after:absolute after:bottom-2 after:h-px after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0',
        'hover-underline':
          'relative !no-underline after:absolute after:bottom-2 after:h-px after:w-2/3 after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100',
        'gradient-slide-show':
          'bg-[size:400%] bg-[linear-gradient(-45deg,var(--gradient-lime),var(--gradient-ocean),var(--gradient-wine),var(--gradient-rust))] animate-gradient-flow',
      },
      size: {
        default: 'min-h-10 gap-2 px-4 py-2',
        xs: 'min-h-8 gap-1.5 rounded-[min(var(--radius),10px)] px-3 py-1.5 text-xs [&_svg]:size-3.5',
        sm: 'min-h-9 gap-1.5 rounded-[min(var(--radius),12px)] px-3.5 py-2 text-[0.8125rem] [&_svg]:size-3.5',
        lg: 'min-h-11 gap-2 px-5 py-2.5 text-[0.9375rem]',
        icon: 'size-10 p-0',
        'icon-xs': 'size-8 rounded-[min(var(--radius),10px)] p-0 [&_svg]:size-3.5',
        'icon-sm': 'size-9 rounded-[min(var(--radius),12px)] p-0 [&_svg]:size-3.5',
        'icon-lg': 'size-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export const buttonIconClassName = cva('inline-flex shrink-0 items-center justify-center', {
  variants: {
    placement: {
      start: '',
      end: '',
    },
    effect: {
      default: '',
      'expand-icon': '',
      'ring-hover': '',
      shine: '',
      'shine-hover': '',
      'gooey-right': '',
      'gooey-left': '',
      underline: '',
      'hover-underline': '',
      'gradient-slide-show': '',
    },
  },
  compoundVariants: [
    {
      placement: 'start',
      effect: 'expand-icon',
      class:
        'w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-[100%] group-hover:pr-2 group-hover:opacity-100',
    },
    {
      placement: 'end',
      effect: 'expand-icon',
      class:
        'w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100',
    },
  ],
  defaultVariants: {
    effect: 'default',
  },
})

export const buttonSpinnerClassName =
  'size-[1em] animate-spin'

export type ButtonStyleProps = VariantProps<typeof buttonClassName>
