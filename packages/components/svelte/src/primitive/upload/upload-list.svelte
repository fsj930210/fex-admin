<script lang="ts" generics="TResponse">
  import type { UploadItem } from '@fex/components-core/upload/types'
  import { uploadListClassName } from '@fex/components-styles/upload'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { readable } from 'svelte/store'
  import { useUploadContext } from './context'
  let { children, class: className, ...rest }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children: Snippet<[readonly UploadItem<TResponse>[]]> } = $props()
  const { upload, listId } = useUploadContext<TResponse>()
  const items = readable(upload.getItems(), (set) => upload.subscribeItems(() => set(upload.getItems())))
</script>
{#if $items.length}<div {...rest} id={listId} role="list" class={cn(uploadListClassName(), className)}>{@render children($items)}</div>{/if}
