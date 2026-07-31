# Upload primitive

Vue Upload 将文件列表和上传行为交给共享 core controller，组件仅负责 Vue 响应式订阅、DOM 获取入口和通用展示结构。

## 导入

```ts
import { UploadRoot, UploadTrigger, UploadList, UploadItem, UploadItemProgress, useUpload } from '@fex/components-vue/primitive/upload'
```

## 基础组合

```vue
<UploadRoot :controller="upload">
  <UploadTrigger v-slot="{ props }"><Button v-bind="props">选择文件</Button></UploadTrigger>
  <UploadList v-slot="{ items }">
    <UploadItem v-for="item in items" :key="item.id" :id="item.id" v-slot="state">
      <span>{{ state.item.name }}</span>
      <UploadItemProgress />
      <Button @click="state.remove">删除</Button>
    </UploadItem>
  </UploadList>
</UploadRoot>
```

## Root 配置

`UploadRoot` 接受 `controller` 或 `options`，并支持 `invalid`、`name`、`required`。`UploadOptions` 包含受控 `items`、`defaultItems`、`onItemsChange`、`beforeUpload`、`beforeRemove`、`accept`、`multiple`、`maxCount`、`disabled`、`autoUpload` 和 `features`。

## 逻辑 API

- `useUpload`、`useUploadController`：创建或连接 controller。
- `useUploadItem`：读取条目并执行上传、重试、暂停、继续和删除。
- `useUploadMd5`、`useUploadParts`：读取可选 MD5 与分片 feature。
- `useUploadProgress`：按可配置权重合并 MD5 与上传进度。
- `useUploadPreview`：读取 `previewFeature` 生成的对象 URL。

服务端响应保存在 `item.response` 中并保持原样；错误保存在 `item.error`。文件名、大小、状态和错误均由调用方从 item 自行展示。
