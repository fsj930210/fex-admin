<script setup lang="ts">
import MentionsContent from '@fex-design/vue/primitive/mentions/content'
import MentionsItem from '@fex-design/vue/primitive/mentions/item'
import MentionsList from '@fex-design/vue/primitive/mentions/list'
import MentionsRoot from '@fex-design/vue/primitive/mentions/root'
import MentionsTrigger from '@fex-design/vue/primitive/mentions/trigger'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
import { mentionUsers } from './data'

const value = ref('')
</script>

<template>
  <Card title="Custom trigger" description="Slot props bind behavior to a custom textarea surface.">
    <MentionsRoot :value="value" @change="(next) => (value = next)">
      <MentionsTrigger v-slot="{ props, state }">
        <textarea
          v-bind="props"
          class="min-h-24 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50"
          :class="state.open ? 'border-focus' : ''"
          placeholder="Custom composer; type @"
        />
      </MentionsTrigger>
      <MentionsContent>
        <MentionsList>
          <MentionsItem v-for="user in mentionUsers" :key="user.id" :item-key="user.id" :value="user.name">
            {{ user.name }}
          </MentionsItem>
        </MentionsList>
      </MentionsContent>
    </MentionsRoot>
  </Card>
</template>
