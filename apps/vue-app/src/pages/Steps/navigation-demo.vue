<script setup lang="ts">
import { ref } from 'vue'
import { Steps, type StepsChangeMeta, type StepValue } from '@fex-design/vue/primitive/steps'
import Card from '@fex-design/vue/ui/card'
import StepList from './step-list.vue'
const message = ref('Use click, Enter, Space or arrow keys.')
function change(value: StepValue, meta: StepsChangeMeta) { message.value = `${String(meta.previous?.value ?? 'none')} → ${String(value)} (${meta.trigger})` }
</script>
<template><Card title="Navigation" description="navigation enables pointer and keyboard switching and reports complete node metadata."><Steps navigation default-current="account" @change="change"><StepList/></Steps><p class="mt-space-md text-sm text-muted-foreground">{{ message }}</p></Card></template>
