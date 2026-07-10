<script setup lang="ts">import { useListboxContext } from './context'; const context = useListboxContext('ListboxGroup')</script>
<template><div v-bind="$attrs" role="group" data-slot="listbox-group" :data-orientation="context.orientation()"><slot /></div></template>
