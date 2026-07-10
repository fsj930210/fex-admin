import { createContext, use } from 'react'
import type { DialogController } from '@fex/components-core/dialog/create-dialog-controller'
import type { RefObject } from 'react'

export interface DialogContextValue {
  contentId: string
  descriptionId: string
  dialog: DialogController
  titleId: string
  triggerRef: RefObject<HTMLButtonElement | null>
}

export const DialogContext = createContext<DialogContextValue | null>(null)

export function useDialogContext(component: string) {
  const context = use(DialogContext)
  if (!context) throw new Error(`${component} must be used inside DialogRoot`)
  return context
}
