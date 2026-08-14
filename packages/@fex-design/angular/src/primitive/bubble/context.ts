import type{BubbleSize,BubbleVariant,ConversationSide}from'@fex-design/core/bubble/types';import{InjectionToken,type Signal}from'@angular/core'
export const BUBBLE_CONTEXT=new InjectionToken<{side:Signal<ConversationSide>;size:Signal<BubbleSize>;variant:Signal<BubbleVariant>}>('BUBBLE_CONTEXT')
export const MESSAGE_SIDE_CONTEXT=new InjectionToken<Signal<ConversationSide>>('MESSAGE_SIDE_CONTEXT')
