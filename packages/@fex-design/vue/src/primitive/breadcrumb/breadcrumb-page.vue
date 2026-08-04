<script setup lang="ts">import { breadcrumbPageClassName } from '@fex-design/styles/breadcrumb'; import { cn } from '@fex/utils'; import { useAttrs } from 'vue'; const attrs = useAttrs()</script>
<template><span v-bind="attrs" aria-current="page" :class="cn(breadcrumbPageClassName, attrs.class as string)" data-slot="breadcrumb-page"><slot /></span></template>
