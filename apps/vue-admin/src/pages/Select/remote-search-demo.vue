<script setup lang="ts">
import type { SelectOption } from '@fex/components-core/select/types'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-vue/primitive/select'
import { onBeforeUnmount, ref } from 'vue'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
const options = ref<readonly SelectOption[]>([]),
  loading = ref(false),
  open = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let requestId = 0
function search(keyword: string) {
  if (timer) clearTimeout(timer)
  const id = ++requestId
  const normalized = keyword.trim().toLocaleLowerCase()
  open.value = true
  if (!normalized) {
    loading.value = false
    options.value = []
    timer = undefined
    return
  }
  loading.value = true
  options.value = []
  timer = setTimeout(() => {
    if (id !== requestId) return
    options.value = normalized
      ? frameworkOptions.filter((option) =>
          [option.label, option.searchText, ...(option.keywords ?? [])].some((text) =>
            text?.toLocaleLowerCase().includes(normalized),
          ),
        )
      : frameworkOptions
    loading.value = false
    open.value = true
    timer = undefined
  }, 2000)
}
onBeforeUnmount(() => {
  requestId++
  if (timer) clearTimeout(timer)
})
</script>
<template>
  <Demo
    title="Remote search"
    description="The mock request waits two seconds, cancels stale keywords and returns matching remote results."
    ><SelectRoot
      show-search
      :loading="loading"
      :open="open"
      :options="options"
      @open-change="open = $event"
      @search="search"
      ><SelectTrigger placeholder="请输入关键词远程搜索" /><SelectContent
        ><SelectList
          loading-text="Searching remote options…"
          empty-text="No remote results" /></SelectContent></SelectRoot
  ></Demo>
</template>
