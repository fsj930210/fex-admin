import { cva, type VariantProps } from 'class-variance-authority'

export const timelineClassName = cva(
  [
    'group/timeline m-0 flex list-none p-0 text-foreground',
    '[--timeline-indicator-size:1rem] [--timeline-line-size:2px] [--timeline-item-gap:1.5rem]',
  ].join(' '),
  {
    variants: {
      orientation: {
        vertical: 'flex-col',
        horizontal: 'w-full flex-row items-stretch overflow-x-auto pb-1',
      },
      align: {
        start: '',
        end: '',
        alternate: '',
      },
      reverse: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
      align: 'end',
      reverse: false,
    },
    compoundVariants: [
      { orientation: 'vertical', reverse: true, class: 'flex-col-reverse' },
      { orientation: 'horizontal', reverse: true, class: 'flex-row-reverse' },
    ],
  },
)

export const timelineItemClassName = [
  'group/item relative min-w-0',
  'group-data-[orientation=vertical]/timeline:grid group-data-[orientation=vertical]/timeline:grid-cols-[minmax(0,1fr)_var(--timeline-indicator-size)_minmax(0,1fr)] group-data-[orientation=vertical]/timeline:gap-x-4 group-data-[orientation=vertical]/timeline:pb-[var(--timeline-item-gap)]',
  'group-data-[orientation=horizontal]/timeline:grid group-data-[orientation=horizontal]/timeline:min-w-40 group-data-[orientation=horizontal]/timeline:flex-1 group-data-[orientation=horizontal]/timeline:grid-cols-1 group-data-[orientation=horizontal]/timeline:grid-rows-[minmax(3rem,auto)_var(--timeline-indicator-size)_minmax(3rem,auto)] group-data-[orientation=horizontal]/timeline:gap-y-3 group-data-[orientation=horizontal]/timeline:px-3',
  'group-data-[orientation=vertical]/timeline:after:absolute group-data-[orientation=vertical]/timeline:after:left-1/2 group-data-[orientation=vertical]/timeline:after:top-[var(--timeline-indicator-size)] group-data-[orientation=vertical]/timeline:after:h-[calc(100%-var(--timeline-indicator-size))] group-data-[orientation=vertical]/timeline:after:w-[var(--timeline-line-size)] group-data-[orientation=vertical]/timeline:after:-translate-x-1/2 group-data-[orientation=vertical]/timeline:after:bg-border',
  'group-data-[orientation=horizontal]/timeline:after:absolute group-data-[orientation=horizontal]/timeline:after:left-[calc(50%+var(--timeline-indicator-size)/2)] group-data-[orientation=horizontal]/timeline:after:top-[calc(50%-var(--timeline-line-size)/2)] group-data-[orientation=horizontal]/timeline:after:h-[var(--timeline-line-size)] group-data-[orientation=horizontal]/timeline:after:w-[calc(100%-var(--timeline-indicator-size))] group-data-[orientation=horizontal]/timeline:after:bg-border',
  'last:after:hidden group-data-[reverse=true]/timeline:first:after:!hidden group-data-[reverse=true]/timeline:last:after:!block',
  'data-[connector-status=completed]:after:bg-success data-[connector-status=current]:after:bg-primary data-[connector-status=error]:after:bg-destructive',
].join(' ')

export const timelineIndicatorClassName = [
  'relative z-10 col-start-2 row-start-1 inline-flex size-[var(--timeline-indicator-size)] items-center justify-center self-start justify-self-center rounded-full border-2 border-primary bg-background text-primary',
  'group-data-[orientation=horizontal]/timeline:col-start-1 group-data-[orientation=horizontal]/timeline:row-start-2',
  'group-data-[status=completed]/item:border-success group-data-[status=completed]/item:bg-success group-data-[status=completed]/item:text-primary-foreground',
  'group-data-[status=current]/item:border-primary group-data-[status=current]/item:bg-primary group-data-[status=current]/item:text-primary-foreground',
  'group-data-[status=pending]/item:border-muted-foreground group-data-[status=pending]/item:text-muted-foreground',
  'group-data-[status=error]/item:border-destructive group-data-[status=error]/item:bg-destructive group-data-[status=error]/item:text-destructive-foreground',
  'group-data-[status=disabled]/item:border-muted group-data-[status=disabled]/item:bg-muted group-data-[status=disabled]/item:text-muted-foreground',
  '[&_svg]:size-3 [&_svg]:shrink-0',
].join(' ')

export const timelineContentClassName = [
  'col-start-3 row-start-1 min-w-0 text-sm',
  'group-data-[align=start]/timeline:col-start-1 group-data-[align=start]/timeline:text-end',
  'group-data-[align=alternate]/timeline:group-odd/item:col-start-1 group-data-[align=alternate]/timeline:group-odd/item:text-end',
  'group-data-[orientation=horizontal]/timeline:col-start-1 group-data-[orientation=horizontal]/timeline:row-start-3 group-data-[orientation=horizontal]/timeline:text-center',
  'group-data-[orientation=horizontal]/timeline:group-data-[align=start]/timeline:row-start-1 group-data-[orientation=horizontal]/timeline:group-data-[align=start]/timeline:self-end',
  'group-data-[orientation=horizontal]/timeline:group-data-[align=alternate]/timeline:group-odd/item:row-start-1 group-data-[orientation=horizontal]/timeline:group-data-[align=alternate]/timeline:group-odd/item:self-end',
  'group-data-[placement=start]/item:!col-start-1 group-data-[placement=start]/item:!text-end',
  'group-data-[placement=end]/item:!col-start-3 group-data-[placement=end]/item:!text-start',
  'group-data-[orientation=horizontal]/timeline:group-data-[placement=start]/item:!col-start-1 group-data-[orientation=horizontal]/timeline:group-data-[placement=start]/item:!row-start-1 group-data-[orientation=horizontal]/timeline:group-data-[placement=start]/item:!self-end group-data-[orientation=horizontal]/timeline:group-data-[placement=start]/item:!text-center',
  'group-data-[orientation=horizontal]/timeline:group-data-[placement=end]/item:!col-start-1 group-data-[orientation=horizontal]/timeline:group-data-[placement=end]/item:!row-start-3 group-data-[orientation=horizontal]/timeline:group-data-[placement=end]/item:!text-center',
].join(' ')

export const timelineOppositeClassName = [
  'col-start-1 row-start-1 min-w-0 text-end text-xs text-muted-foreground',
  'group-data-[align=start]/timeline:col-start-3 group-data-[align=start]/timeline:text-start',
  'group-data-[align=alternate]/timeline:group-odd/item:col-start-3 group-data-[align=alternate]/timeline:group-odd/item:text-start',
  'group-data-[orientation=horizontal]/timeline:col-start-1 group-data-[orientation=horizontal]/timeline:row-start-1 group-data-[orientation=horizontal]/timeline:self-end group-data-[orientation=horizontal]/timeline:text-center',
  'group-data-[orientation=horizontal]/timeline:group-data-[align=start]/timeline:row-start-3 group-data-[orientation=horizontal]/timeline:group-data-[align=start]/timeline:self-start',
  'group-data-[orientation=horizontal]/timeline:group-data-[align=alternate]/timeline:group-odd/item:row-start-3 group-data-[orientation=horizontal]/timeline:group-data-[align=alternate]/timeline:group-odd/item:self-start',
].join(' ')

export type TimelineStyleProps = VariantProps<typeof timelineClassName>
