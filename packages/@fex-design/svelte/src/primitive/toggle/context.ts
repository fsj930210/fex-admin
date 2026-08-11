import type { ToggleStyleProps } from '@fex-design/styles/toggle'
export const toggleGroupContextKey = Symbol('ToggleGroup')
export interface ToggleGroupContextValue { disabled: () => boolean; variant: () => ToggleStyleProps['variant']; size: () => ToggleStyleProps['size']; isPressed: (value: string) => boolean; toggle: (value: string) => void }
