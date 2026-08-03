<script setup lang="ts">
import { Steps } from '@fex/components-vue/primitive/steps'
import Card from '@fex/components-vue/ui/card'
import StepList from './step-list.vue'
</script>
<template><Card title="Uncontrolled" description="defaultCurrent selects the initial step without owning later navigation state."><Steps default-current="profile"><StepList/></Steps></Card></template>
