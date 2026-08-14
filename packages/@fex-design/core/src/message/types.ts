import type { ConversationSide } from '../bubble/types'

export type MessageSide = ConversationSide
export type MessageTone = 'neutral' | 'success' | 'danger'
export type MessageLive = 'polite' | 'assertive' | 'off'
export type MessageActionAlign = MessageSide | 'inherit'
export type MessageGroupSpacing = 'compact' | 'default'
