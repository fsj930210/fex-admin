<script setup lang="ts">import { breadcrumbSeparatorClassName } from '@fex-design/styles/breadcrumb'; import { cn } from '@fex/utils'; import { useAttrs } from 'vue'; const attrs = useAttrs()</script>
<template><li v-bind="attrs" aria-hidden="true" :class="cn(breadcrumbSeparatorClassName, attrs.class as string)" data-slot="breadcrumb-separator"><slot>/</slot></li></template>
