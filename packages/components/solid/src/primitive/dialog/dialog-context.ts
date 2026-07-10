import { createContext, useContext, type Accessor } from 'solid-js'
import type { createDialogController } from '@fex/components-core/dialog/create-dialog-controller'
export interface DialogContextValue { contentId: string, descriptionId: string, dialog: ReturnType<typeof createDialogController>, snapshot: Accessor<ReturnType<ReturnType<typeof createDialogController>['getSnapshot']>>, titleId: string, triggerElement: { current: HTMLButtonElement | null } }
export const DialogContext = createContext<DialogContextValue>()
export function useDialog(component: string) { const context = useContext(DialogContext); if (!context) throw new Error(`${component} must be used inside Dialog`); return context }
