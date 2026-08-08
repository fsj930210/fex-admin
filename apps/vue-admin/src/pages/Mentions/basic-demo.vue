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
const selected = ref('No mention selected')

</script>

<template>
  <Card title="Basic @" description="Default prefix is @ and selection only notifies the caller.">
    <MentionsRoot :value="value" @change="(next) => (value = next)" @select="({ value: name }) => (selected = 'Selected ' + name)">
      <MentionsTrigger placeholder="Type @ to mention a teammate" />
      <MentionsContent>
        <MentionsList>
          <MentionsItem v-for="user in mentionUsers" :key="user.id" :item-key="user.id" :value="user.name" :data="user">
            <span class="flex min-w-0 flex-col">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="text-xs text-muted-foreground">{{ user.role }}</span>
            </span>
          </MentionsItem>
        </MentionsList>
      </MentionsContent>
    </MentionsRoot>
    <p class="mt-space-sm text-xs text-muted-foreground">{{ selected }}</p>
  </Card>
</template>
