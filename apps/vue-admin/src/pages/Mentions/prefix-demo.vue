<script setup lang="ts">
import MentionsContent from '@fex-design/vue/primitive/mentions/content'
import MentionsItem from '@fex-design/vue/primitive/mentions/item'
import MentionsList from '@fex-design/vue/primitive/mentions/list'
import MentionsPrefixCase from '@fex-design/vue/primitive/mentions/prefix-case'
import MentionsRoot from '@fex-design/vue/primitive/mentions/root'
import MentionsTrigger from '@fex-design/vue/primitive/mentions/trigger'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
import { mentionCommands, mentionDocs, mentionUsers } from './data'

const value = ref('')
const selected = ref('Type @, #, or /')
</script>

<template>
  <Card title="Trigger characters" description="Each prefix renders a caller-owned list.">
    <MentionsRoot
      :value="value"
      :prefix="['@', '#', '/']"
      @change="(next) => (value = next)"
      @select="(item, meta) => (selected = meta.prefix + ' -> ' + item.value)"
    >
      <MentionsTrigger placeholder="Try @Ada, #Pricing, or /summarize" />
      <MentionsContent>
        <MentionsPrefixCase prefix="@">
          <MentionsList>
            <MentionsItem v-for="user in mentionUsers" :key="user.id" :item-key="user.id" :value="user.name">
              @{{ user.name }}
            </MentionsItem>
          </MentionsList>
        </MentionsPrefixCase>
        <MentionsPrefixCase prefix="#">
          <MentionsList>
            <MentionsItem v-for="doc in mentionDocs" :key="doc.id" :item-key="doc.id" :value="doc.title">
              #{{ doc.title }}
            </MentionsItem>
          </MentionsList>
        </MentionsPrefixCase>
        <MentionsPrefixCase prefix="/">
          <MentionsList>
            <MentionsItem v-for="command in mentionCommands" :key="command.id" :item-key="command.id" :value="command.id">
              /{{ command.label }}
            </MentionsItem>
          </MentionsList>
        </MentionsPrefixCase>
      </MentionsContent>
    </MentionsRoot>
    <p class="mt-space-sm text-xs text-muted-foreground">{{ selected }}</p>
  </Card>
</template>
