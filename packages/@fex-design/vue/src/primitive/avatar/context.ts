import type { InjectionKey, Ref } from 'vue'
export const avatarContext: InjectionKey<{ loaded: Ref<boolean> }> = Symbol('avatar')
