<script setup lang="ts">
import { listboxRootClassName } from '@fex-design/styles/listbox'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
import { ListboxRoot } from '../../primitive/listbox/listbox'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>
<template>
  <ListboxRoot
    v-bind="attrs"
    :class="cn(listboxRootClassName({}), attrs.class as string | undefined)"
    ><slot
  /></ListboxRoot>
</template>
