<script lang="ts">
  import type { DropFeatureApi } from '@fex-design/core/upload/features/drop'
  import type { PasteFeatureApi } from '@fex-design/core/upload/features/paste'
  import { getDroppedFiles } from '@fex-design/core/upload/get-dropped-files'
  import { uploadDropzoneClassName } from '@fex-design/styles/upload'
  import { cn } from '@fex/utils'
  import { onDestroy, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { useUploadContext } from './context'
  let { children, class: className, ...rest }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children?: Snippet } = $props()
  const { upload, invalid } = useUploadContext()
  const drop = upload.getFeature<DropFeatureApi>('drop')
  const paste = upload.getFeature<PasteFeatureApi>('paste')
  let dragging = $state(drop?.getDragging() ?? false)
  const unsubscribe = drop?.subscribe(() => { dragging = drop.getDragging() })
  onDestroy(() => unsubscribe?.())
</script>
<div {...rest} class={cn(uploadDropzoneClassName(), className)} role="button" tabindex={upload.getOptions().disabled ? undefined : 0} aria-disabled={upload.getOptions().disabled} data-dragging={dragging || undefined} data-disabled={upload.getOptions().disabled || undefined} data-invalid={invalid() || undefined} ondragenter={(event) => { if (drop) { event.preventDefault(); drop.dragEnter() } }} ondragover={(event) => { if (drop) event.preventDefault() }} ondragleave={() => drop?.dragLeave()} ondrop={(event) => { if (drop) { event.preventDefault(); void getDroppedFiles(event.dataTransfer!).then((files) => drop.drop(files)) } }} onpaste={(event) => { const files = [...(event.clipboardData?.files ?? [])]; if (paste && files.length) { event.preventDefault(); void paste.paste(files) } }}>{@render children?.()}</div>
