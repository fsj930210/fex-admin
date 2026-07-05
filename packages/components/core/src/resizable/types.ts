export type ResizableDirection = 'horizontal' | 'vertical'

export interface ResizablePanelConfig {
  id: string
  defaultSize?: number | undefined
  minSize?: number | undefined
  maxSize?: number | undefined
}
