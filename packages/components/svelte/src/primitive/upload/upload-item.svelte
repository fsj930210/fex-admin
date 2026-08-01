<script lang="ts" generics="TResponse">
  import type { UploadId } from '@fex/components-core/upload/types'
  import { uploadItemClassName } from '@fex/components-styles/upload'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { useUploadContext, setUploadItemId } from './context'
  import { createUploadItem } from './create-upload'
  type InternalState = ReturnType<typeof createUploadItem<TResponse>>
  type State = Omit<InternalState, 'item'> & { item: import('@fex/components-core/upload/types').UploadItem<TResponse> | undefined }
  let { id, children, class: className, ...rest }: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> & { id: UploadId, children?: Snippet<[State]> } = $props()
  const { upload } = useUploadContext<TResponse>()
  const state = createUploadItem(upload, () => id)
  const { item } = state
  const slotState: State = $derived({ ...state, item: $item })
  // svelte-ignore state_referenced_locally -- keyed upload items keep a stable id while mounted.
  setUploadItemId(id)
</script>
{#if $item}<div {...rest} role="listitem" class={cn(uploadItemClassName(), className)} data-status={$item.status}>{@render children?.(slotState)}</div>{/if}
