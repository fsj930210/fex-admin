import { useCoreStore } from '../../hooks/use-core-store'
import { useDialogContext } from './dialog-context'

export function useDialog(component = 'useDialog') {
  const context = useDialogContext(component)
  const snapshot = useCoreStore(context.dialog)
  return { ...context, snapshot }
}
