import { inject } from 'vue'
import { autoCompleteKey } from './context'

export function useAutoComplete(component = 'useAutoComplete') {
  const context = inject(autoCompleteKey)
  if (!context) throw new Error(`${component} must be used inside AutoCompleteRoot.`)
  return context
}
