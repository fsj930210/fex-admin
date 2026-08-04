<script setup lang="ts">
import { ref } from 'vue'
import { Steps, type StepValue } from '@fex-design/vue/primitive/steps'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import StepList from './step-list.vue'
const current = ref<StepValue>('account')
</script>
<template><Card title="Controlled" description="Business completion updates current; navigation requests the same value through onChange."><Steps navigation :current="current" @change="value => current = value"><StepList/></Steps><Button class="mt-space-md" @click="current = current === 'account' ? 'profile' : 'review'">Complete current task</Button></Card></template>
