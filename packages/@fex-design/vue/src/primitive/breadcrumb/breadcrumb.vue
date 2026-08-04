<script setup lang="ts">
import { breadcrumbClassName } from '@fex-design/styles/breadcrumb'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
const attrs = useAttrs()
</script>
<template><nav v-bind="attrs" :class="cn(breadcrumbClassName({}), attrs.class as string)" data-slot="breadcrumb" aria-label="Breadcrumb"><slot /></nav></template>
