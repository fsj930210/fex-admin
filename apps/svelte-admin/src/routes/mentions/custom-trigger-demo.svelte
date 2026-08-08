<script lang="ts">
  import MentionsRoot from '@fex-design/svelte/primitive/mentions/root'
  import MentionsTrigger from '@fex-design/svelte/primitive/mentions/trigger'
  import MentionsContent from '@fex-design/svelte/primitive/mentions/content'
  import MentionsList from '@fex-design/svelte/primitive/mentions/list'
  import MentionsItem from '@fex-design/svelte/primitive/mentions/item'
  import Card from '@fex-design/svelte/ui/card'
  import { mentionUsers } from './data'

  let value = $state('')
</script>

<Card title="Custom trigger" description="Snippet props bind behavior to a custom textarea surface.">
  <MentionsRoot value={value} onChange={(next) => (value = next)}>
    <MentionsTrigger>
      {#snippet children({ props, state })}
        <textarea
          {...props}
          class="min-h-24 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50"
          class:border-focus={state.open}
          placeholder="Custom composer; type @"
        ></textarea>
      {/snippet}
    </MentionsTrigger>
    <MentionsContent>
      <MentionsList>
        {#each mentionUsers as user (user.id)}
          <MentionsItem itemKey={user.id} value={user.name}>{#snippet children()}{user.name}{/snippet}</MentionsItem>
        {/each}
      </MentionsList>
    </MentionsContent>
  </MentionsRoot>
</Card>
