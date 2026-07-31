# Upload primitive

Svelte Upload 使用 Svelte 5 snippet、context 和 readable/derived store 连接共享 core controller。

## 导入

```svelte
<script>
  import { UploadRoot, UploadTrigger, UploadList, UploadItem, UploadItemProgress, createUpload } from '@fex/components-svelte/primitive/upload'
</script>
```

`UploadRoot` 接受 `controller` 或 `options`，并支持 `invalid`、`name` 和 `required`。`UploadTrigger`、`UploadList` 与 `UploadItem` 通过 snippet 参数公开原生绑定、文件数组和条目行为。

组件级逻辑 API 包括 `createUpload`、`createUploadItem`、`createUploadMd5`、`createUploadParts`、`createUploadProgress` 和 `createUploadPreview`。MD5、分片、拖拽、粘贴、文件夹与预览均是显式安装的 core feature。

组件不会规定文件名、大小、错误和服务端响应的展示；调用方直接读取 item，服务端响应原样位于 `item.response`。
