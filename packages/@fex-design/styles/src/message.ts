import { cva, type VariantProps } from 'class-variance-authority'
import { toggleClassName } from './toggle'

export const messageClassName = [
  'group/message flex w-full min-w-0 items-end gap-[var(--message-column-gap,10px)] has-[[data-slot=message-footer]]:mb-[var(--message-footer-space,28px)]',
  'data-[side=end]:flex-row-reverse',
].join(' ')
export const messageAvatarClassName = 'flex size-[var(--message-avatar-size,32px)] shrink-0 items-center justify-center'
export const messageBodyClassName = [
  'relative flex min-w-0 max-w-[var(--message-max-width,min(88%,48rem))] flex-1 flex-col gap-[var(--message-content-gap,6px)]',
  'group-data-[side=start]/message:items-start group-data-[side=end]/message:items-end',
].join(' ')
export const messageHeaderClassName = 'flex min-w-0 items-center gap-2 text-xs text-muted-foreground'
export const messageContentClassName = 'flex w-full min-w-0 flex-col gap-2'
export const messageStatusClassName = cva(
  'flex items-center gap-1.5 text-xs',
  { variants: { tone: { neutral: 'text-muted-foreground', success: 'text-success', danger: 'text-danger' } }, defaultVariants: { tone: 'neutral' } },
)
export const messageActionsClassName = [
  'flex items-center gap-[var(--message-actions-gap,4px)] text-muted-foreground transition-opacity',
  'data-[align=start]:justify-start data-[align=end]:justify-end',
  'data-[visibility=interaction]:opacity-0 group-hover/message:opacity-100 group-focus-within/message:opacity-100',
  'max-[768px]:data-[visibility=interaction]:opacity-100 motion-reduce:transition-none',
].join(' ')
export const messageActionClassName = (options?: Parameters<typeof toggleClassName>[0]) =>
  `${toggleClassName({ variant: 'default', size: 'sm', ...options })} h-7 border-0 bg-transparent px-2 shadow-none`
export const messageFooterClassName = [
  'absolute top-full mt-[var(--message-content-gap,6px)] flex w-max max-w-full min-w-0 items-center gap-2 text-xs text-muted-foreground',
  'group-data-[side=start]/message:left-0 group-data-[side=end]/message:right-0',
].join(' ')
export const messageGroupClassName = cva('flex w-full flex-col', {
  variants: { spacing: { compact: 'gap-1.5', default: 'gap-3' } },
  defaultVariants: { spacing: 'default' },
})

export type MessageStatusStyleProps = VariantProps<typeof messageStatusClassName>
export type MessageGroupStyleProps = VariantProps<typeof messageGroupClassName>
