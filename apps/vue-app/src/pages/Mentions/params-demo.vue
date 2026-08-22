<script setup lang="ts">
import MentionsContent from '@fex-design/vue/primitive/mentions/content'
import MentionsItem from '@fex-design/vue/primitive/mentions/item'
import MentionsList from '@fex-design/vue/primitive/mentions/list'
import MentionsRoot from '@fex-design/vue/primitive/mentions/root'
import MentionsTrigger from '@fex-design/vue/primitive/mentions/trigger'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
import { mentionDocs } from './data'

const value = ref('')
const params = ref<string[]>([])
</script>

<template>
  <Card title="Parameter-only selection" description="Selection stores params without writing mention text.">
    <MentionsRoot
      :value="value"
      prefix="#"
      @change="(next) => (value = next)"
      @select="(item) => params.push(item.value)"
    >
      <MentionsTrigger placeholder="Type # to attach knowledge context" />
      <MentionsContent>
        <MentionsList>
          <MentionsItem v-for="doc in mentionDocs" :key="doc.id" :item-key="doc.id" :value="doc.title">
            {{ doc.title }}
          </MentionsItem>
        </MentionsList>
      </MentionsContent>
    </MentionsRoot>
    <div class="mt-space-sm flex flex-wrap gap-space-xs text-xs text-muted-foreground">
      <span v-if="!params.length">No params yet</span>
      <span v-for="param in params" v-else :key="param">#{{ param }}</span>
    </div>
  </Card>
</template>
