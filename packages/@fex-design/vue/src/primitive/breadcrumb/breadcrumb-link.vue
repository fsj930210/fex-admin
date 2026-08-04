<script setup lang="ts">import { breadcrumbLinkClassName } from '@fex-design/styles/breadcrumb'; import { cn } from '@fex/utils'; import { useAttrs } from 'vue'; const attrs = useAttrs()</script>
<template><a v-bind="attrs" :class="cn(breadcrumbLinkClassName, attrs.class as string)" data-slot="breadcrumb-link"><slot /></a></template>
