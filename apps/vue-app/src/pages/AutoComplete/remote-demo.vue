<script setup lang="ts">
import {
  AutoCompleteContent,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/vue/primitive/auto-complete'
import Card from '@fex-design/vue/ui/card'
import { onUnmounted, ref } from 'vue'
import { fieldNames, users, type UserSuggestion } from './data'
const items = ref<UserSuggestion[]>([])
const loading = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let request = 0
function search(keyword: string) {
  if (timer) clearTimeout(timer)
  const current = ++request
  loading.value = true
  timer = setTimeout(() => {
    if (current !== request) return
    const normalized = keyword.trim().toLocaleLowerCase()
    items.value = users.filter((item) => item.name.toLocaleLowerCase().includes(normalized))
    loading.value = false
  }, 600)
}
onUnmounted(() => {
  request++
  if (timer) clearTimeout(timer)
})
</script>
<template>
  <Card
    title="Remote search and replaceable states"
    description="The caller owns requests; Content replaces generic loading and empty presentations."
  >
    <AutoCompleteRoot
      :items="items"
      :field-names="fieldNames"
      :loading="loading"
      :filter-option="false"
      @search="search"
    >
      <AutoCompleteTrigger placeholder="Search remote users" clearable />
      <AutoCompleteContent>
        <div v-if="loading" class="p-6 text-center text-sm text-muted-foreground">
          Querying directory…
        </div>
        <div v-else-if="!items.length" class="p-6 text-center text-sm text-muted-foreground">
          No remote matches
        </div>
      </AutoCompleteContent>
    </AutoCompleteRoot>
  </Card>
</template>
