<script setup lang="ts">import { breadcrumbEllipsisClassName } from '@fex-design/styles/breadcrumb'; import { cn } from '@fex/utils'; import { useAttrs } from 'vue'; const attrs = useAttrs()</script>
<template><span v-bind="attrs" aria-hidden="true" :class="cn(breadcrumbEllipsisClassName, attrs.class as string)" data-slot="breadcrumb-ellipsis"><slot>...</slot></span></template>
