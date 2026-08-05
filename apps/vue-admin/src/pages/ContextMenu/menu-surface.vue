<script setup lang="ts">
import { ContextMenuItem } from '@fex-design/vue/primitive/context-menu'

defineProps<{ label: string }>()
</script>

<template>
  <div class="grid min-w-44 gap-1 p-1 text-sm">
    <div class="px-2 py-1 text-xs text-muted-foreground">{{ label }}</div>
    <ContextMenuItem class="rounded-md px-2 py-1.5 text-left hover:bg-muted-background">Open</ContextMenuItem>
    <ContextMenuItem class="rounded-md px-2 py-1.5 text-left hover:bg-muted-background">Rename</ContextMenuItem>
    <ContextMenuItem class="rounded-md px-2 py-1.5 text-left text-danger hover:bg-danger/10">Delete</ContextMenuItem>
  </div>
</template>
