import type { DialogController, DialogOptions, DialogSnapshot } from '@fex/components-core/dialog/types'
import { inject, type InjectionKey, type ShallowRef } from 'vue'

export interface DialogContextValue {
  contentId: string
  descriptionId: string
  dialog: DialogController
  snapshot: ShallowRef<DialogSnapshot>
  titleId: string
  triggerElement: ShallowRef<HTMLButtonElement | null>
}

export const dialogKey: InjectionKey<DialogContextValue> = Symbol('Dialog')

export function useDialogContext(component: string) {
  const context = inject(dialogKey)
  if (!context) {
    throw new Error(`${component} must be used inside Dialog`)
  }
  return context
}

export type DialogRootProps = DialogOptions
