import type { MessageActionAlign, MessageGroupSpacing, MessageLive, MessageSide, MessageTone } from '@fex-design/core/message/types'
import { messageActionClassName, messageActionsClassName, messageAvatarClassName, messageBodyClassName, messageClassName, messageContentClassName, messageFooterClassName, messageGroupClassName, messageHeaderClassName, messageStatusClassName } from '@fex-design/styles/message'
import { cn } from '@fex/utils'
import { createContext, use, type ComponentProps, type HTMLAttributes, type ReactNode } from 'react'
import { MessageSideContext } from '../bubble/bubble'
import { Toggle, type ToggleProps } from '../toggle/toggle'

const MessageContext = createContext<{ side: MessageSide; busy: boolean } | null>(null)
export interface MessageProps extends ComponentProps<'div'> { side?: MessageSide; busy?: boolean }
export function Message({ side = 'start', busy = false, className, children, ...props }: MessageProps) {
  return <MessageContext value={{ side, busy }}><MessageSideContext value={side}><div {...props} data-slot="message" data-side={side} data-busy={busy ? 'true' : 'false'} aria-busy={busy} className={cn(messageClassName, className)}>{children}</div></MessageSideContext></MessageContext>
}
export function MessageAvatar({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="message-avatar" className={cn(messageAvatarClassName, className)} /> }
export function MessageBody({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="message-body" className={cn(messageBodyClassName, className)} /> }
export function MessageHeader({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="message-header" className={cn(messageHeaderClassName, className)} /> }
export function MessageContent({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="message-content" className={cn(messageContentClassName, className)} /> }
export interface MessageStatusProps extends ComponentProps<'div'> { tone?: MessageTone; live?: MessageLive }
export function MessageStatus({ tone = 'neutral', live = 'polite', className, ...props }: MessageStatusProps) { return <div {...props} data-slot="message-status" data-tone={tone} role={live === 'off' ? undefined : 'status'} aria-live={live === 'off' ? undefined : live} className={cn(messageStatusClassName({ tone }), className)} /> }
export interface MessageActionsProps extends HTMLAttributes<HTMLDivElement> { align?: MessageActionAlign; visibility?: 'always' | 'interaction' }
export function MessageActions({ align = 'inherit', visibility = 'always', className, ...props }: MessageActionsProps) {
  const context = use(MessageContext)
  const resolvedAlign = align === 'inherit' ? context?.side ?? 'start' : align
  return <div {...props} data-slot="message-actions" data-align={resolvedAlign} data-visibility={visibility} className={cn(messageActionsClassName, className)} />
}
type MessageActionRenderProps = { props: HTMLAttributes<HTMLElement>; state: { pressed: boolean; disabled: boolean } }
export interface MessageActionProps extends ToggleProps { render?: (options: MessageActionRenderProps) => ReactNode }
export function MessageAction({ render, className, pressed, defaultPressed, disabled = false, ...props }: MessageActionProps) {
  if (render) return render({ props: { 'data-slot': 'message-action', 'data-state': pressed ? 'on' : 'off', className: cn(messageActionClassName(), className) }, state: { pressed: pressed ?? defaultPressed ?? false, disabled } })
  return <Toggle {...props} pressed={pressed} defaultPressed={defaultPressed} disabled={disabled} data-slot="message-action" variant="default" size="sm" className={cn(messageActionClassName(), className)} />
}
export function MessageFooter({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="message-footer" className={cn(messageFooterClassName, className)} /> }
export interface MessageGroupProps extends ComponentProps<'div'> { spacing?: MessageGroupSpacing }
export function MessageGroup({ spacing = 'default', className, ...props }: MessageGroupProps) { return <div {...props} data-slot="message-group" data-spacing={spacing} className={cn(messageGroupClassName({ spacing }), className)} /> }
