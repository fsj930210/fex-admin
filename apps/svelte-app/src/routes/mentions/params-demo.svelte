<script lang="ts">
  import MentionsRoot from '@fex-design/svelte/primitive/mentions/root'
  import MentionsTrigger from '@fex-design/svelte/primitive/mentions/trigger'
  import MentionsContent from '@fex-design/svelte/primitive/mentions/content'
  import MentionsList from '@fex-design/svelte/primitive/mentions/list'
  import MentionsItem from '@fex-design/svelte/primitive/mentions/item'
  import Card from '@fex-design/svelte/ui/card'
  import { mentionDocs } from './data'

  let value = $state('')
  let params = $state<string[]>([])
</script>

<Card title="Parameter-only selection" description="Selection stores params without writing mention text.">
  <MentionsRoot value={value} prefix="#" onChange={(next) => (value = next)} onSelect={(item) => (params = [...params, item.value])}>
    <MentionsTrigger placeholder="Type # to attach knowledge context" />
    <MentionsContent>
      <MentionsList>
        {#each mentionDocs as doc (doc.id)}
          <MentionsItem itemKey={doc.id} value={doc.title}>{#snippet children()}{doc.title}{/snippet}</MentionsItem>
        {/each}
      </MentionsList>
    </MentionsContent>
  </MentionsRoot>
  <div class="mt-space-sm flex flex-wrap gap-space-xs text-xs text-muted-foreground">
    {#if params.length}
      {#each params as param (param)}<span>#{param}</span>{/each}
    {:else}
      <span>No params yet</span>
    {/if}
  </div>
</Card>
