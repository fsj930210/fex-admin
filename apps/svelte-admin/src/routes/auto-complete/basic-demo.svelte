<script lang="ts">
  import AutoCompleteRoot from '@fex/components-svelte/primitive/auto-complete'
  import AutoCompleteContent from '@fex/components-svelte/primitive/auto-complete-content'
  import AutoCompleteTrigger from '@fex/components-svelte/primitive/auto-complete-trigger'
  import Card from '@fex/components-svelte/ui/card'
  import { fieldNames, users } from './data'
  let selected = $state('No suggestion accepted')
</script>
<Card title="Free input and local suggestions" description="Type any text, or accept a matching name with pointer or keyboard.">
  <AutoCompleteRoot items={users} {fieldNames} onSelect={(_, meta) => selected = `${meta.selectedItem.name} · ${meta.selectedItem.email}`}>
    <AutoCompleteTrigger placeholder="Try A or Bella" clearable />
    <AutoCompleteContent />
  </AutoCompleteRoot>
  <p class="mt-space-sm text-xs text-muted-foreground">{selected}</p>
</Card>
