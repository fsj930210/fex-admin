import { cva, type VariantProps } from 'class-variance-authority'

export const alertClassName = cva(
  [
    'group/alert relative grid w-full gap-0.5 rounded-md border border-border px-2.5 py-2 text-left text-sm',
    'bg-card-background text-card-foreground',
    'has-data-[slot=alert-action]:pr-[72px] has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2',
    '[&>svg]:row-span-2 [&>svg]:translate-y-0.5 [&>svg]:text-current [&>svg:not([class*=size-])]:size-4',
  ].join(' '),
  {
    variants: {
      variant: {
        default: '',
        destructive:
          'border-danger/30 text-danger *:data-[slot=alert-description]:text-danger/90',
        success:
          'border-success/30 text-success *:data-[slot=alert-description]:text-success/90',
        warning:
          'border-warning/30 text-warning *:data-[slot=alert-description]:text-warning/90',
        info: 'border-info/30 text-info *:data-[slot=alert-description]:text-info/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const alertTitleClassName =
  'font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-foreground'

export const alertDescriptionClassName =
  'text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4'

export const alertActionClassName = 'absolute right-2 top-2'

export type AlertStyleProps = VariantProps<typeof alertClassName>
