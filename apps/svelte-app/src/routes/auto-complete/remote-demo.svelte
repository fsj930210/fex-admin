<script lang="ts">
  import AutoCompleteRoot from '@fex-design/svelte/primitive/auto-complete'
  import AutoCompleteContent from '@fex-design/svelte/primitive/auto-complete-content'
  import AutoCompleteTrigger from '@fex-design/svelte/primitive/auto-complete-trigger'
  import Card from '@fex-design/svelte/ui/card'
  import { onDestroy } from 'svelte'
  import { fieldNames, users, type UserSuggestion } from './data'
  let items = $state<UserSuggestion[]>([])
  let loading = $state(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let request = 0
  function search(keyword: string) {
    if (timer) clearTimeout(timer)
    const current = ++request
    loading = true
    timer = setTimeout(() => {
      if (current !== request) return
      const normalized = keyword.trim().toLocaleLowerCase()
      items = users.filter(item => item.name.toLocaleLowerCase().includes(normalized))
      loading = false
    }, 600)
  }
  onDestroy(() => { request++; if (timer) clearTimeout(timer) })
</script>
<Card title="Remote search and replaceable states" description="The caller owns requests; Content replaces generic loading and empty presentations.">
  <AutoCompleteRoot {items} {fieldNames} {loading} filterOption={false} onSearch={search}>
    <AutoCompleteTrigger placeholder="Search remote users" clearable />
    <AutoCompleteContent>
      {#if loading}<div class="p-6 text-center text-sm text-muted-foreground">Querying directory…</div>
      {:else if !items.length}<div class="p-6 text-center text-sm text-muted-foreground">No remote matches</div>{/if}
    </AutoCompleteContent>
  </AutoCompleteRoot>
</Card>
