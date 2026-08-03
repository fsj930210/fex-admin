<script setup lang="ts">
import { Steps } from '@fex/components-vue/primitive/steps'
import Card from '@fex/components-vue/ui/card'
import StepList from './step-list.vue'
</script>
<template><Card title="Responsive and vertical" description="Horizontal Steps responds to its container; orientation=vertical remains vertical."><div class="grid gap-space-xl lg:grid-cols-2"><div class="max-w-sm"><Steps current="profile"><StepList/></Steps></div><Steps orientation="vertical" current="profile"><StepList/></Steps></div></Card></template>
