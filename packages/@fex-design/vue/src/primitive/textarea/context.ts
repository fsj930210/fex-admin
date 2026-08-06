import type { TextareaAutoSize } from '@fex-design/core/textarea/autosize'
import type { InjectionKey, Ref } from 'vue'

export type TextareaChangeReason = 'input' | 'clear'

export interface TextareaContextValue {
  value: Readonly<Ref<string>>
  disabled: Readonly<Ref<boolean>>
  readOnly: Readonly<Ref<boolean>>
  invalid: Readonly<Ref<boolean>>
  canClear: Readonly<Ref<boolean>>
  autoSize: Readonly<Ref<TextareaAutoSize | undefined>>
  setValue: (value: string, reason: TextareaChangeReason, event?: Event) => void
  clear: () => void
  focus: () => void
  setFocusElement: (element: HTMLTextAreaElement | null) => void
  syncAutoSize: () => void
}

export const textareaContextKey: InjectionKey<TextareaContextValue> = Symbol('FexTextarea')
