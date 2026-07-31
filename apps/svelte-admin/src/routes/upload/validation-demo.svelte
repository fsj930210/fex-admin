<script lang="ts">
  import { uploadFeature } from '@fex/components-core/upload/features/upload'
  import type { UploadItem } from '@fex/components-core/upload/types'
  import { UploadRoot, UploadTrigger, createUpload } from '@fex/components-svelte/primitive/upload'
  import Button from '@fex/components-svelte/ui/button'
  import { uploadBody, uploadServerUrl } from './api'
  import DemoList from './demo-list.svelte'
  import DemoSection from './demo-section.svelte'
  let items: readonly UploadItem[] = $state([])
  let submitted = $state(false)
  const invalid = $derived(submitted && items.length === 0)
  const upload = createUpload({
    get items() { return items },
    onItemsChange: (next) => { items = next },
    autoUpload: false,
    features: [uploadFeature({ request: ({ file, signal, onProgress }) => uploadBody(`${uploadServerUrl}/upload`, file, { fileName: file.name, signal, onProgress }) })],
  })
</script>

<DemoSection title="受控表单校验" description="父组件控制文件列表；必填字段为空时提交表单，选择文件按钮会公开 invalid 状态。">
  <form novalidate onsubmit={(event) => { event.preventDefault(); submitted = true }}>
    <UploadRoot controller={upload} {invalid} required>
      <UploadTrigger>{#snippet children(value)}<Button {...value.props} variant="outline">选择必填文件</Button>{/snippet}</UploadTrigger>
      <DemoList />
    </UploadRoot>
    {#if invalid}<p class="mt-space-xs text-sm text-danger" role="alert">请至少选择一个文件。</p>{/if}
    <Button class="mt-space-md" type="submit">校验表单</Button>
  </form>
</DemoSection>
