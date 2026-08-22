<script lang="ts">
  import AutoCompleteRoot from '@fex-design/svelte/primitive/auto-complete'
  import AutoCompleteContent from '@fex-design/svelte/primitive/auto-complete-content'
  import AutoCompleteTrigger from '@fex-design/svelte/primitive/auto-complete-trigger'
  import Card from '@fex-design/svelte/ui/card'
  import { fieldNames, users } from './data'
  let value = $state('A')
  let open = $state(false)
</script>
<Card title="Controlled value and panel" description="Both public states are controlled; active suggestion stays internal.">
  <AutoCompleteRoot items={users} {fieldNames} {value} {open} onChange={next => value = next} onOpenChange={next => open = next}>
    <AutoCompleteTrigger placeholder="Controlled input" clearable />
    <AutoCompleteContent />
  </AutoCompleteRoot>
  <p class="mt-space-sm text-xs text-muted-foreground">value: {value || '(empty)'} · open: {String(open)}</p>
</Card>
