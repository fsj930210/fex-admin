<script lang="ts">
  import { uploadTriggerClassName } from '@fex/components-styles/upload'
  import type { Snippet } from 'svelte'
  import PrimitiveButton from '../button/button.svelte'
  import { useUploadContext } from './context'
  interface UploadTriggerBindings { type: 'button', disabled: boolean, 'aria-controls': string, 'aria-invalid': boolean | undefined, class: string, onclick(): void }
  let { children }: { children?: Snippet<[{ props: UploadTriggerBindings }]> } = $props()
  const { upload, input, inputId, invalid } = useUploadContext()
  const triggerProps: UploadTriggerBindings = { type: 'button', disabled: upload.getOptions().disabled === true, 'aria-controls': inputId, get 'aria-invalid'() { return invalid() || undefined }, class: uploadTriggerClassName(), onclick: () => { input()?.click() } }
</script>
{#if children}{@render children({ props: triggerProps })}{:else}<PrimitiveButton {...triggerProps}>选择文件</PrimitiveButton>{/if}
