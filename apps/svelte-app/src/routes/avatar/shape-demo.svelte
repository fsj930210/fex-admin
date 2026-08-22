<script lang="ts">
  import Avatar from '@fex-design/svelte/primitive/avatar'
  import AvatarFallback from '@fex-design/svelte/primitive/avatar-fallback'
  import Card from '@fex-design/svelte/ui/card'
</script>
<Card title="Shape" description="Avatar supports circle and square shapes."><div class="flex items-center gap-space-lg"><Avatar shape="circle"><AvatarFallback>CI</AvatarFallback></Avatar><Avatar shape="square"><AvatarFallback>SQ</AvatarFallback></Avatar></div></Card>
