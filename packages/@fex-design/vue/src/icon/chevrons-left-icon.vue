<script setup lang="ts">
import { useAttrs } from 'vue'
import ChevronsRightIcon from './chevrons-right-icon.vue'
</script>
<template><ChevronsRightIcon v-bind="useAttrs()" class="rotate-180" /></template>
