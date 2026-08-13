<script lang="ts">
  import Avatar from '@fex-design/svelte/primitive/avatar'
  import AvatarBadge from '@fex-design/svelte/primitive/avatar-badge'
  import AvatarFallback from '@fex-design/svelte/primitive/avatar-fallback'
  import AvatarImage from '@fex-design/svelte/primitive/avatar-image'
  import Card from '@fex-design/svelte/ui/card'
</script>
<Card title="Content" description="Use an image with fallback content and an optional badge."><div class="flex items-center gap-space-lg"><Avatar size="lg"><AvatarImage src="/avatar-demo.svg" alt="Example avatar" /><AvatarFallback>IM</AvatarFallback><AvatarBadge aria-label="Online" /></Avatar><Avatar size="lg"><AvatarImage src="/missing-avatar.png" alt="Missing avatar" /><AvatarFallback>FX</AvatarFallback></Avatar></div></Card>
