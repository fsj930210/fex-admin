<script setup lang="ts">
import { Step, StepContent, StepIndicator, Steps } from '@fex-design/vue/primitive/steps'
import { ErrorIcon } from '@fex-design/vue/icon/error'
import Card from '@fex-design/vue/ui/card'
import StepList from './step-list.vue'
</script>
<template><Card title="Custom indicator and status" description="Indicator and content are arbitrary; a node can override its derived status."><Steps current="profile"><StepList error/><Step value="support" status="blocked" :data="{ ticket: 'SUP-42' }"><StepIndicator><ErrorIcon/></StepIndicator><StepContent><strong>Needs attention</strong><p class="text-muted-foreground">Custom content, custom status and business metadata.</p></StepContent></Step></Steps></Card></template>
