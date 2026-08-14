import { resolveConversationSide, type BubbleAttachmentSide, type BubbleGroupSpacing, type BubbleSize, type BubbleVariant, type BubbleVisibility, type ConversationSide } from '@fex-design/core/bubble/types'
import { bubbleActionClassName, bubbleActionsClassName, bubbleClassName, bubbleContentClassName, bubbleGroupClassName, bubbleReactionClassName, bubbleReactionCountClassName, bubbleReactionsClassName } from '@fex-design/styles/bubble'
import { cn } from '@fex/utils'
import { createContext, use, type ComponentProps, type HTMLAttributes, type ReactNode } from 'react'
import { Toggle, type ToggleProps } from '../toggle/toggle'

type BubbleContextValue = { side: ConversationSide; size: BubbleSize; variant: BubbleVariant }
const BubbleContext = createContext<BubbleContextValue | null>(null)
export const MessageSideContext = createContext<ConversationSide | null>(null)

export interface BubbleProps extends ComponentProps<'div'> { side?: ConversationSide; variant?: BubbleVariant; size?: BubbleSize }
export function Bubble({ side, variant = 'soft', size = 'md', className, children, ...props }: BubbleProps) {
  const messageSide = use(MessageSideContext)
  const resolvedSide = resolveConversationSide(side, messageSide ?? undefined)
  return <BubbleContext value={{ side: resolvedSide, size, variant }}><div {...props} data-slot="bubble" data-side={resolvedSide} data-variant={variant} data-size={size} className={cn(bubbleClassName({ size }), className)}>{children}</div></BubbleContext>
}

type BubbleContentRenderProps = { props: ComponentProps<'div'>; state: BubbleContextValue }
export interface BubbleContentProps extends Omit<ComponentProps<'div'>, 'children'> { children?: ReactNode; render?: (options: BubbleContentRenderProps) => ReactNode }
export function BubbleContent({ className, children, render, ...props }: BubbleContentProps) {
  const context = use(BubbleContext) ?? { side: 'start' as const, size: 'md' as const, variant: 'soft' as const }
  const binding = { ...props, 'data-slot': 'bubble-content', 'data-side': context.side, className: cn(bubbleContentClassName({ size: context.size, variant: context.variant }), className) }
  return render ? render({ props: binding, state: context }) : <div {...binding}>{children}</div>
}

export interface BubbleGroupProps extends ComponentProps<'div'> { side?: ConversationSide; spacing?: BubbleGroupSpacing }
export function BubbleGroup({ side, spacing = 'default', className, ...props }: BubbleGroupProps) {
  const messageSide = use(MessageSideContext)
  const resolvedSide = resolveConversationSide(side, messageSide ?? undefined)
  return <div {...props} data-slot="bubble-group" data-side={resolvedSide} data-spacing={spacing} className={cn(bubbleGroupClassName({ spacing }), className)} />
}

interface BubbleAttachedProps extends HTMLAttributes<HTMLDivElement> { side?: BubbleAttachmentSide; align?: ConversationSide }
export interface BubbleActionsProps extends BubbleAttachedProps { visibility?: BubbleVisibility }
export function BubbleActions({ side = 'bottom', align, visibility = 'always', className, ...props }: BubbleActionsProps) {
  const context = use(BubbleContext)
  const resolvedAlign = align ?? context?.side ?? 'start'
  return <div {...props} data-slot="bubble-actions" data-side={side} data-align={resolvedAlign} data-visibility={visibility} className={cn(bubbleActionsClassName({ side }), className)} />
}

type ActionRenderProps = { props: HTMLAttributes<HTMLElement>; state: { pressed: boolean; disabled: boolean } }
export interface BubbleActionProps extends ToggleProps { render?: (options: ActionRenderProps) => ReactNode }
export function BubbleAction({ render, className, pressed, defaultPressed, disabled = false, ...props }: BubbleActionProps) {
  if (render) return render({ props: { 'data-slot': 'bubble-action', 'data-state': pressed ? 'on' : 'off', className: cn(bubbleActionClassName(), className) }, state: { pressed: pressed ?? defaultPressed ?? false, disabled } })
  return <Toggle {...props} pressed={pressed} defaultPressed={defaultPressed} disabled={disabled} data-slot="bubble-action" variant="default" size="sm" className={cn(bubbleActionClassName(), className)} />
}

export interface BubbleReactionsProps extends BubbleAttachedProps {}
export function BubbleReactions({ side = 'bottom', align, className, ...props }: BubbleReactionsProps) {
  const context = use(BubbleContext)
  const resolvedAlign = align ?? context?.side ?? 'start'
  return <div {...props} data-slot="bubble-reactions" data-side={side} data-align={resolvedAlign} className={cn(bubbleReactionsClassName({ side }), className)} />
}

export interface BubbleReactionProps extends BubbleActionProps { count?: number }
export function BubbleReaction({ count, render, className, children, pressed, defaultPressed, disabled = false, ...props }: BubbleReactionProps) {
  if (render) return render({ props: { 'data-slot': 'bubble-reaction', 'data-state': pressed ? 'on' : 'off', className: cn(bubbleReactionClassName(), className) }, state: { pressed: pressed ?? defaultPressed ?? false, disabled } })
  return <Toggle {...props} pressed={pressed} defaultPressed={defaultPressed} disabled={disabled} data-slot="bubble-reaction" variant="outline" size="sm" className={cn(bubbleReactionClassName(), className)}>{children}{count !== undefined && <span data-slot="bubble-reaction-count" className={bubbleReactionCountClassName}>{count}</span>}</Toggle>
}
