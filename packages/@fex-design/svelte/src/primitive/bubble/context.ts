import type { BubbleSize,BubbleVariant,ConversationSide } from '@fex-design/core/bubble/types'
export const bubbleContextKey=Symbol('Bubble'); export const messageSideContextKey=Symbol('MessageSide')
export interface BubbleContextValue{side:()=>ConversationSide;size:()=>BubbleSize;variant:()=>BubbleVariant}
