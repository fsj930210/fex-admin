<script lang="ts">
  import { MenuList, MenuRoot } from '@fex-design/svelte/primitive/menu'
  import type { Snippet } from 'svelte'
  let { children }: { children?: Snippet } = $props()
</script>
<MenuRoot><MenuList><div class="space-y-0.5">{@render children?.()}</div></MenuList></MenuRoot>
