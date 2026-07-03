export type ResizableDirection = 'horizontal' | 'vertical'

export interface ResizablePanelConfig {
  id: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

