<script setup lang="ts">
import { MenuItem } from '@fex/components-vue/primitive/menu'
import { itemClassName } from './demo-classes'
defineOptions({ inheritAttrs: false })
</script>
<template><MenuItem v-bind="$attrs" :class="itemClassName"><slot /></MenuItem></template>
