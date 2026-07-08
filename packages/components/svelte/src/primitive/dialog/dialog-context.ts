import type { DialogController, DialogSnapshot } from '@fex/components-core/dialog/types'
import type { Readable } from 'svelte/store'

export const dialogContextKey = Symbol('Dialog')

export interface DialogContext {
  contentId: string
  descriptionId: string
  dialog: DialogController
  snapshot: Readable<DialogSnapshot>
  titleId: string
  triggerElement: { current: HTMLButtonElement | null }
}
