<script setup lang="ts">import { breadcrumbItemClassName } from '@fex-design/styles/breadcrumb'; import { cn } from '@fex/utils'; import { useAttrs } from 'vue'; const attrs = useAttrs()</script>
<template><li v-bind="attrs" :class="cn(breadcrumbItemClassName, attrs.class as string)" data-slot="breadcrumb-item"><slot /></li></template>
