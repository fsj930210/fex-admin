import { createContext, useContext, type Accessor } from 'solid-js'
import type { FloatingOverlay } from '@fex/components-core/overlay/create-floating-overlay'
export interface PopoverContextValue { arrow: boolean, arrowElement: { current: HTMLElement | null }, contentElement: { current: HTMLElement | null }, overlay: FloatingOverlay, snapshot: Accessor<ReturnType<FloatingOverlay['getSnapshot']>>, triggerElement: { current: HTMLElement | null } }
export interface PopoverDismissRecord { arrowElement: { current: HTMLElement | null }, contentElement: { current: HTMLElement | null }, overlay: FloatingOverlay, triggerElement: { current: HTMLElement | null } }
export const PopoverContext = createContext<PopoverContextValue>()
export const dismissRecords = new Set<PopoverDismissRecord>()
export function dismissOpenPopovers(event: Event, except?: FloatingOverlay) { const target = event.target; dismissRecords.forEach((record) => { if (record.overlay === except || !record.overlay.getSnapshot().open) return; if (target instanceof Node && (record.triggerElement.current?.contains(target) || record.contentElement.current?.contains(target) || record.arrowElement.current?.contains(target))) return; record.overlay.close({ reason: 'outside-pointer', event }) }) }
export function usePopover(component: string) { const context = useContext(PopoverContext); if (!context) throw new Error(`${component} must be used inside Popover`); return context }
