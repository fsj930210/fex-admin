<script setup lang="ts">
import { computed, inject, type ComponentPublicInstance } from 'vue'
import { dismissOpenPopovers, eventInfo, usePopoverContext } from '../popover/context'
import { treeSelectKey } from './context'

const treeSelect = inject(treeSelectKey)
if (!treeSelect) throw new Error('TreeSelectTrigger must be used inside TreeSelectRoot.')
const { overlay, snapshot, triggerElement } = usePopoverContext('TreeSelectTrigger')
const displayValue = computed(() => treeSelect.snapshot.value.selectedItems.map((item) => item.label).join(', '))
const inputValue = computed(() => treeSelect.snapshot.value.multiple ? treeSelect.searchValue.value : treeSelect.searchable.value && treeSelect.searchValue.value ? treeSelect.searchValue.value : displayValue.value)

function setReference(element: Element | ComponentPublicInstance | null) {
  const component = element as (ComponentPublicInstance & { $el?: unknown }) | null
  const reference = element instanceof HTMLElement ? element : component?.$el instanceof HTMLElement ? component.$el : null
  triggerElement.value = reference
  overlay.setReferenceElement(reference)
}
function syncReference(event: Event) {
  if (!(event.currentTarget instanceof HTMLElement)) return
  triggerElement.value = event.currentTarget
  overlay.setReferenceElement(event.currentTarget)
}
const triggerProps = computed(() => ({
  type: 'button' as const,
  'aria-haspopup': 'dialog' as const,
  'aria-expanded': snapshot.value.open,
  'data-state': snapshot.value.open ? 'open' : 'closed',
  onClick(event: MouseEvent) { syncReference(event); dismissOpenPopovers(event, overlay); treeSelect.openPanel() },
  onPointerenter(event: PointerEvent) { syncReference(event); overlay.trigger.pointerEnter(eventInfo(event)) },
  onPointerleave(event: PointerEvent) { syncReference(event); overlay.trigger.pointerLeave(eventInfo(event)) },
  onFocus(event: FocusEvent) { syncReference(event); treeSelect.openPanel() },
  onBlur(event: FocusEvent) { syncReference(event) },
  onContextmenu(event: MouseEvent) { syncReference(event); dismissOpenPopovers(event, overlay); overlay.trigger.contextMenu(eventInfo(event)) },
}))
function resolvedTriggerProps() { return triggerProps.value }
function activate(event: MouseEvent) { triggerProps.value.onClick(event) }
function focus(event: FocusEvent) { triggerProps.value.onFocus(event) }
function clear() { treeSelect.controller.clear(); treeSelect.setSearchValue('') }
</script>

<template>
  <slot
    :trigger-props="resolvedTriggerProps()"
    :trigger-ref="setReference"
    :activate="activate"
    :focus="focus"
    :input-props="{ readonly: !treeSelect.searchable.value, value: inputValue, onInput: (event: Event) => treeSelect.setSearchValue((event.currentTarget as HTMLInputElement).value) }"
    :selected-items="treeSelect.snapshot.value.selectedItems"
    :clear="clear"
  />
</template>
