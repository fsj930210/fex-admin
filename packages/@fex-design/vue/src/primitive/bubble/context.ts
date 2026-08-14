import type { BubbleSize, BubbleVariant, ConversationSide } from '@fex-design/core/bubble/types'
import type { InjectionKey, Ref } from 'vue'
export const bubbleKey: InjectionKey<{ side: Ref<ConversationSide>; size: Ref<BubbleSize>; variant: Ref<BubbleVariant> }> = Symbol('Bubble')
export const messageSideKey: InjectionKey<Ref<ConversationSide>> = Symbol('MessageSide')
