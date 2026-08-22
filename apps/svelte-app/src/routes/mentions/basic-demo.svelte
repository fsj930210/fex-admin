<script lang="ts">
  import MentionsRoot from '@fex-design/svelte/primitive/mentions/root'
  import MentionsTrigger from '@fex-design/svelte/primitive/mentions/trigger'
  import MentionsContent from '@fex-design/svelte/primitive/mentions/content'
  import MentionsList from '@fex-design/svelte/primitive/mentions/list'
  import MentionsItem from '@fex-design/svelte/primitive/mentions/item'
  import Card from '@fex-design/svelte/ui/card'
  import { mentionUsers } from './data'

  let value = $state('')
  let selected = $state('No mention selected')
</script>

<Card title="Basic @" description="Default prefix is @ and selection only notifies the caller.">
  <MentionsRoot value={value} onChange={(next) => (value = next)} onSelect={(item) => (selected = 'Selected ' + item.value)}>
    <MentionsTrigger placeholder="Type @ to mention a teammate" />
    <MentionsContent>
      <MentionsList>
        {#each mentionUsers as user (user.id)}
          <MentionsItem itemKey={user.id} value={user.name} data={user}>
            {#snippet children()}
              <span class="flex min-w-0 flex-col">
                <span class="truncate font-medium">{user.name}</span>
                <span class="text-xs text-muted-foreground">{user.role}</span>
              </span>
            {/snippet}
          </MentionsItem>
        {/each}
      </MentionsList>
    </MentionsContent>
  </MentionsRoot>
  <p class="mt-space-sm text-xs text-muted-foreground">{selected}</p>
</Card>
