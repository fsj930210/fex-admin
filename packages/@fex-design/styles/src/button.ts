import { cva, type VariantProps } from 'class-variance-authority'

export const buttonPrimitiveClassName = [
  'group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap',
  'rounded-md border border-transparent bg-clip-padding text-sm font-medium',
  'cursor-pointer select-none outline-none transition-all',
  'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
  'active:not-aria-[haspopup]:translate-y-px',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'data-[loading=true]:pointer-events-none data-[loading=true]:cursor-wait data-[loading=true]:opacity-75',
  'aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20',
  '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
].join(' ')

export const buttonClassName = cva(buttonPrimitiveClassName, {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80',
      outline:
        'border-border bg-background text-foreground hover:bg-muted-background hover:text-foreground aria-expanded:bg-muted-background aria-expanded:text-foreground',
      secondary:
        'bg-secondary-background text-foreground hover:bg-hover-background aria-expanded:bg-secondary-background aria-expanded:text-foreground',
      ghost:
        'text-foreground hover:bg-muted-background hover:text-foreground aria-expanded:bg-muted-background aria-expanded:text-foreground',
      destructive:
        'bg-danger/10 text-danger hover:bg-danger/20 focus-visible:border-danger/40 focus-visible:ring-danger/20',
      link: 'h-auto border-transparent bg-transparent px-0 text-link underline-offset-4 [--button-underline-inset:0px] hover:text-link-hover hover:underline',
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
        'relative !no-underline after:absolute after:bottom-2 after:left-[var(--button-underline-inset,10px)] after:right-[var(--button-underline-inset,10px)] after:h-px after:origin-bottom-left after:scale-x-100 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0',
      'hover-underline':
        'relative !no-underline after:absolute after:bottom-2 after:left-[var(--button-underline-inset,10px)] after:right-[var(--button-underline-inset,10px)] after:h-px after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100',
      'gradient-slide-show':
        'bg-[size:400%] bg-[linear-gradient(-45deg,var(--gradient-lime),var(--gradient-ocean),var(--gradient-wine),var(--gradient-rust))] animate-gradient-flow',
    },
    size: {
      default:
        'h-8 gap-1.5 px-2.5 [--button-underline-inset:10px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
      xs: 'h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs [--button-underline-inset:8px] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*=size-])]:size-3',
      sm: 'h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*=size-])]:size-3.5',
      lg: 'h-9 gap-1.5 px-2.5 [--button-underline-inset:10px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
      icon: 'size-8',
      'icon-xs':
        'size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*=size-])]:size-3',
      'icon-sm':
        'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
      'icon-lg': 'size-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

const buttonIconBaseClassName = 'inline-flex shrink-0 items-center justify-center'

const buttonExpandIconClassName = {
  start:
    'w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-[100%] group-hover:pr-2 group-hover:opacity-100',
  end: 'w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100',
} satisfies Record<'start' | 'end', string>

export function buttonIconClassName({
  placement,
  effect,
}: {
  placement: 'start' | 'end'
  effect?: ButtonStyleProps['effect']
}) {
  return [
    buttonIconBaseClassName,
    effect === 'expand-icon' ? buttonExpandIconClassName[placement] : '',
  ].join(' ')
}

export const buttonSpinnerClassName = 'size-[1em] animate-spin'

export type ButtonStyleProps = VariantProps<typeof buttonClassName>
