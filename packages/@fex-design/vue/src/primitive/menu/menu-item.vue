<script setup lang="ts">defineOptions({ inheritAttrs: false })</script>
<template><button v-bind="$attrs" type="button" role="menuitem" data-slot="menu-item"><slot /></button></template>
