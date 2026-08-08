<script setup lang="ts">
import { mentionsContentClassName } from '@fex-design/styles/mentions'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { useMentions } from './context'

const props = defineProps<{ class?: string }>()
const mentions = useMentions('MentionsContent')
const className = computed(() =>
  cn(mentionsContentClassName, 'absolute left-0 top-full mt-1 min-w-64', props.class),
)
</script>

<template>
  <div
    v-if="mentions.snapshot.value.open && mentions.snapshot.value.query"
    data-slot="mentions-content"
    :class="className"
  >
    <slot />
  </div>
</template>
