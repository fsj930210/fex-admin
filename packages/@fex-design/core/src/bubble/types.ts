export type ConversationSide = 'start' | 'end'
export type BubbleVariant = 'solid' | 'soft' | 'outline' | 'plain' | 'danger'
export type BubbleSize = 'sm' | 'md' | 'lg'
export type BubbleAttachmentSide = 'top' | 'bottom'
export type BubbleVisibility = 'always' | 'interaction'
export type BubbleGroupSpacing = 'compact' | 'default'

export function resolveConversationSide(
  side: ConversationSide | undefined,
  inheritedSide?: ConversationSide,
): ConversationSide {
  return side ?? inheritedSide ?? 'start'
}
