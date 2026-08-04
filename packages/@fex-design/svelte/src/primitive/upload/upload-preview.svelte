<script lang="ts">
  import { uploadPreviewClassName } from '@fex-design/styles/upload'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { useUploadContext, useUploadItemId } from './context'
  import { createUploadPreview } from './create-upload'
  let { children, class: className, ...rest }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children?: Snippet } = $props()
  const id = useUploadItemId()
  const { upload } = useUploadContext()
  const item = upload.getItem(id)
  const url = createUploadPreview(() => id)
</script>
<div {...rest} class={cn(uploadPreviewClassName(), className)}>{#if children}{@render children()}{:else if url && item?.type?.startsWith('image/')}<img class="size-full object-cover" src={url} alt="" />{:else}<span aria-hidden="true">↥</span>{/if}</div>
