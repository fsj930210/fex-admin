<script lang="ts">
  import MentionsRoot from '@fex-design/svelte/primitive/mentions/root'
  import MentionsTrigger from '@fex-design/svelte/primitive/mentions/trigger'
  import MentionsContent from '@fex-design/svelte/primitive/mentions/content'
  import MentionsList from '@fex-design/svelte/primitive/mentions/list'
  import MentionsItem from '@fex-design/svelte/primitive/mentions/item'
  import MentionsPrefixCase from '@fex-design/svelte/primitive/mentions/prefix-case'
  import Card from '@fex-design/svelte/ui/card'
  import { mentionCommands, mentionDocs, mentionUsers } from './data'

  let value = $state('')
  let selected = $state('Type @, #, or /')
</script>

<Card title="Trigger characters" description="Each prefix renders a caller-owned list.">
  <MentionsRoot
    value={value}
    prefix={['@', '#', '/']}
    onChange={(next) => (value = next)}
    onSelect={(item, meta) => (selected = meta.prefix + ' -> ' + item.value)}
  >
    <MentionsTrigger placeholder="Try @Ada, #Pricing, or /summarize" />
    <MentionsContent>
      <MentionsPrefixCase prefix="@">
        <MentionsList>
          {#each mentionUsers as user (user.id)}
            <MentionsItem itemKey={user.id} value={user.name}>{#snippet children()}@{user.name}{/snippet}</MentionsItem>
          {/each}
        </MentionsList>
      </MentionsPrefixCase>
      <MentionsPrefixCase prefix="#">
        <MentionsList>
          {#each mentionDocs as doc (doc.id)}
            <MentionsItem itemKey={doc.id} value={doc.title}>{#snippet children()}#{doc.title}{/snippet}</MentionsItem>
          {/each}
        </MentionsList>
      </MentionsPrefixCase>
      <MentionsPrefixCase prefix="/">
        <MentionsList>
          {#each mentionCommands as command (command.id)}
            <MentionsItem itemKey={command.id} value={command.id}>{#snippet children()}/{command.label}{/snippet}</MentionsItem>
          {/each}
        </MentionsList>
      </MentionsPrefixCase>
    </MentionsContent>
  </MentionsRoot>
  <p class="mt-space-sm text-xs text-muted-foreground">{selected}</p>
</Card>
