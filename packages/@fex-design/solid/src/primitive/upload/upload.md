# Upload primitive

Solid Upload 使用共享 core controller，并通过 accessor 精确订阅列表、条目、MD5 和分片状态。

## 导入

```tsx
import {
  UploadRoot,
  UploadTrigger,
  UploadList,
  UploadItem,
  UploadItemProgress,
  createUpload,
} from '@fex-design/solid/primitive/upload'
```

## 基础组合

```tsx
<UploadRoot controller={upload}>
  <UploadTrigger>{({ props }) => <Button {...props}>选择文件</Button>}</UploadTrigger>
  <UploadList>
    {(items) => (
      <For each={items}>
        {(item) => (
          <UploadItem id={item.id}>
            {(state) => (
              <>
                <span>{state.item()?.name}</span>
                <UploadItemProgress />
              </>
            )}
          </UploadItem>
        )}
      </For>
    )}
  </UploadList>
</UploadRoot>
```

`UploadRoot` 支持 `controller`、`options`、`invalid`、`name` 和 `required`。完整上传配置由 core `UploadOptions` 定义，包括受控/非受控列表、上传前处理、文件限制和可选 features。

逻辑 primitive 包括 `createUpload`、`createUploadItem`、`createUploadMd5`、`createUploadParts`、`createUploadProgress` 和 `createUploadPreview`。网络结果原样保存在 `item.response`，错误保存在 `item.error`；业务自行决定文件元信息和错误的展示方式。
