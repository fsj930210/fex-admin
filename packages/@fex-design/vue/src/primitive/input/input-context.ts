import type { InjectionKey, Ref } from 'vue'

export interface InputContextValue {
  value: Readonly<Ref<string>>
  disabled: Readonly<Ref<boolean>>
  readOnly: Readonly<Ref<boolean>>
  invalid: Readonly<Ref<boolean>>
  canClear: Readonly<Ref<boolean>>
  setValue: (value: string, reason: 'input' | 'clear', event?: Event) => void
  clear: () => void
  focus: () => void
  setFocusElement: (element: HTMLElement | null) => void
}

export const inputContextKey: InjectionKey<InputContextValue> = Symbol('FexInput')
