<script lang="ts" generics="TResponse">
  import { createUploadController } from '@fex/components-core/upload/create-upload-controller'
  import type { UploadController, UploadOptions } from '@fex/components-core/upload/types'
  import { uploadRootClassName } from '@fex/components-styles/upload'
  import { cn } from '@fex/utils'
  import { onDestroy, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { setUploadContext } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { controller?: UploadController<TResponse>, options?: UploadOptions<TResponse>, invalid?: boolean, name?: string, required?: boolean, children?: Snippet }
  let { controller, options, invalid = false, name, required = false, children, class: className, ...rest }: Props = $props()
  // svelte-ignore state_referenced_locally -- controller ownership is selected once at mount.
  const owned = controller ? undefined : createUploadController(options ?? {})
  // svelte-ignore state_referenced_locally -- switching controller ownership after mount is unsupported.
  const upload = controller ?? owned!
  if (owned) onDestroy(() => owned.destroy())
  let input: HTMLInputElement
  const inputId = `upload-${crypto.randomUUID()}`
  const listId = `upload-list-${crypto.randomUUID()}`
  setUploadContext({ upload, input: () => input, setInput: (element) => { input = element }, inputId, listId, invalid: () => invalid })
  const directory = upload.hasFeature('directory')
  function selectFiles(event: Event) { const element = event.currentTarget as HTMLInputElement; const files = [...(element.files ?? [])]; element.value = ''; void upload.addFiles(files) }
</script>
<div {...rest} class={cn(uploadRootClassName(), className)} data-disabled={upload.getOptions().disabled || undefined} data-invalid={invalid || undefined}>{@render children?.()}<input bind:this={input} id={inputId} class="sr-only" type="file" {name} {required} disabled={upload.getOptions().disabled} accept={upload.getOptions().accept} multiple={directory || upload.getOptions().multiple} webkitdirectory={directory || undefined} onchange={selectFiles} /></div>
