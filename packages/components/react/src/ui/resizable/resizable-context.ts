import { createContext, use } from 'react'
import type { ResizableDirection, ResizablePanelConfig } from '@fex/components-core/resizable/types'
export interface ResizableContextValue { direction: ResizableDirection, groupElement: HTMLDivElement | null, layout: number[], registerPanel: (config: ResizablePanelConfig) => number, resizeHandle: (handleIndex: number, deltaPercent: number) => void }
export const ResizableContext = createContext<ResizableContextValue | null>(null)
export function useResizableContext() { const context = use(ResizableContext); if (!context) throw new Error('Resizable components must be used inside ResizablePanelGroup.'); return context }
