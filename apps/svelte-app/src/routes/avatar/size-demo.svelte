<script lang="ts">
  import Avatar from '@fex-design/svelte/primitive/avatar'
  import AvatarFallback from '@fex-design/svelte/primitive/avatar-fallback'
  import Card from '@fex-design/svelte/ui/card'
</script>
<Card title="Size" description="Avatar provides small, medium and large sizes."><div class="flex items-center gap-space-lg"><Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar><Avatar size="md"><AvatarFallback>MD</AvatarFallback></Avatar><Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar></div></Card>
