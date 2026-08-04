<script lang="ts">
  import { uploadProgressClassName, uploadProgressIndicatorClassName } from '@fex-design/styles/upload'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import { useUploadContext, useUploadItemId } from './context'
  import { createUploadItem } from './create-upload'
  let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
  const id = useUploadItemId()
  const { upload } = useUploadContext()
  const state = createUploadItem(upload, () => id)
  const { item } = state
  const percent = $derived($item?.progress?.percent ?? 0)
</script>
<div {...rest} class={cn(uploadProgressClassName(), className)} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(percent)}><div class={uploadProgressIndicatorClassName()} style:width={`${percent}%`}></div></div>
