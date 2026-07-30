<script lang="ts">
  import AutoCompleteRoot from '@fex/components-svelte/primitive/auto-complete'
  import AutoCompleteContent from '@fex/components-svelte/primitive/auto-complete-content'
  import AutoCompleteList from '@fex/components-svelte/primitive/auto-complete-list'
  import AutoCompleteTrigger from '@fex/components-svelte/primitive/auto-complete-trigger'
  import Card from '@fex/components-svelte/ui/card'
  import { fieldNames, users } from './data'
</script>
<div class="grid gap-space-xl md:grid-cols-2">
  <Card title="Custom items and disabled suggestion" description="Original backend items drive richer rows; Alex is disabled.">
    <AutoCompleteRoot items={users} {fieldNames}>
      <AutoCompleteTrigger placeholder="Custom suggestion rows" clearable status="warning" />
      <AutoCompleteContent>
        <div class="border-b border-border px-3 py-2 text-xs text-muted-foreground">People directory</div>
        <AutoCompleteList>
          {#snippet item(user, state)}
            <div><div class="font-medium">{user.name}</div><div class="text-xs text-muted-foreground">{user.department} · {user.email}{state.disabled ? ' · unavailable' : ''}</div></div>
          {/snippet}
        </AutoCompleteList>
      </AutoCompleteContent>
    </AutoCompleteRoot>
  </Card>
  <Card title="Validation and native props" description="Input validation styles and native form attributes are preserved.">
    <AutoCompleteRoot items={users} {fieldNames}>
      <AutoCompleteTrigger name="reviewer" required aria-describedby="reviewer-error-svelte" placeholder="Required reviewer" clearable invalid status="error" />
      <AutoCompleteContent />
    </AutoCompleteRoot>
    <p id="reviewer-error-svelte" class="mt-space-sm text-xs text-danger">Choose a reviewer or enter a new name.</p>
  </Card>
</div>
