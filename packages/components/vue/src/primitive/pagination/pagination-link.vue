<script setup lang="ts">
import { paginationLinkClassName, paginationTextLinkClassName } from '@fex/components-styles/pagination'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    class?: string | undefined
    isActive?: boolean
    size?: 'default' | 'icon'
  }>(),
  { size: 'icon' },
)
</script>

<template>
  <a
    v-bind="$attrs"
    :aria-current="props.isActive ? 'page' : undefined"
    data-slot="pagination-link"
    :data-active="props.isActive ? 'true' : undefined"
    :class="cn(paginationLinkClassName, props.size === 'default' ? paginationTextLinkClassName : '', props.class)"
  >
    <slot />
  </a>
</template>

