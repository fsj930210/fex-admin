<script setup lang="ts">
import { popoverMenuContentClassName } from '@fex-design/styles/popover'
import { cn } from '@fex/utils'
import { PopoverContent } from '../popover/popover'
import { usePopoverContext } from '../popover/context'
const props = withDefaults(defineProps<{ class?: string; role?: string }>(), { role: 'menu' })
const { hoverAncestors, overlay } = usePopoverContext('DropdownContent')
function closeFromItem(event: MouseEvent) {
  const item = event.target instanceof Element
    ? event.target.closest<HTMLElement>('[role="menuitem"]')
    : null
  if (!event.defaultPrevented && item && !item.hasAttribute('aria-haspopup')) {
    ;[...hoverAncestors, overlay].reverse().forEach((current) =>
      current.close({ reason: 'manual', source: 'menu-item', event }),
    )
  }
}
</script>

<template>
  <PopoverContent :class="cn(popoverMenuContentClassName, props.class)" :role="props.role" @click="closeFromItem"><slot /></PopoverContent>
</template>
