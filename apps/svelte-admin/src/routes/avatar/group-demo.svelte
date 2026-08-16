<script lang="ts">
  import { Avatar, AvatarFallback, AvatarGroup } from '@fex-design/svelte/primitive/avatar'
  import Card from '@fex-design/svelte/ui/card'
  const names = ['AM', 'BL', 'CS', 'DT', 'ER']
</script>
{#snippet avatar(name: string)}<Avatar><AvatarFallback>{name}</AvatarFallback></Avatar>{/snippet}
<Card title="Avatar group" description="Keep the first avatars visible and summarize the rest."><AvatarGroup items={names} maxCount={3} item={avatar} /></Card>
