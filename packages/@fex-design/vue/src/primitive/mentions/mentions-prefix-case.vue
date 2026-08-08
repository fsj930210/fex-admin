<script setup lang="ts">
import { useMentions } from './context'

const props = defineProps<{ prefix: string }>()
const mentions = useMentions('MentionsPrefixCase')
</script>

<template>
  <slot v-if="mentions.snapshot.value.query?.prefix === props.prefix" />
</template>
