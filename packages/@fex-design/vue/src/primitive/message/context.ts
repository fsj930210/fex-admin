import type { MessageSide } from '@fex-design/core/message/types'; import type { InjectionKey, Ref } from 'vue'
export const messageKey: InjectionKey<{side:Ref<MessageSide>;busy:Ref<boolean>}> = Symbol('Message')
