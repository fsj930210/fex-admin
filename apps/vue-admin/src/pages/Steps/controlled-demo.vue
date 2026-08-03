<script setup lang="ts">
import { ref } from 'vue'
import { Steps, type StepValue } from '@fex/components-vue/primitive/steps'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import StepList from './step-list.vue'
const current = ref<StepValue>('account')
</script>
<template><Card title="Controlled" description="Business completion updates current; navigation requests the same value through onChange."><Steps navigation :current="current" @change="value => current = value"><StepList/></Steps><Button class="mt-space-md" @click="current = current === 'account' ? 'profile' : 'review'">Complete current task</Button></Card></template>
