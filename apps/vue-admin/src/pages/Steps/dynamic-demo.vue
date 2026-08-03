<script setup lang="ts">
import { computed, ref } from 'vue'
import { Step, StepContent, StepIndicator, Steps } from '@fex/components-vue/primitive/steps'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
const extra = ref(false)
const base = [['account', 'Account'], ['profile', 'Profile'], ['review', 'Review']] as const
const items = computed(() => extra.value ? [...base.slice(0, 2), ['approval', 'Approval'] as const, base[2]] : base)
</script>
<template><Card title="Dynamic nodes" description="Stable values keep selection reliable when nodes are inserted or removed."><Steps navigation default-current="profile"><Step v-for="item in items" :key="item[0]" :value="item[0]"><StepIndicator/><StepContent><strong>{{ item[1] }}</strong></StepContent></Step></Steps><Button class="mt-space-md" @click="extra = !extra">{{ extra ? 'Remove' : 'Insert' }} approval</Button></Card></template>
