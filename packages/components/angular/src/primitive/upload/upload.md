# Upload primitive

Angular Upload 是 standalone、Signal-first 的共享上传 controller 适配。

## 导入

```ts
import {
  UploadRoot,
  UploadTrigger,
  UploadList,
  UploadListTemplate,
  UploadItem,
  UploadItemTemplate,
  UploadItemProgress,
  createUploadSignals,
} from '@fex/components-angular/primitive/upload'
```

## 基础组合

```html
<fex-upload-root [controller]="upload">
  <button fexButton fexUploadTrigger>选择文件</button>
  <fex-upload-list>
    <ng-template fexUploadList let-items>
      @for (item of items; track item.id) {
      <fex-upload-item [id]="item.id">
        <ng-template fexUploadItem let-state
          >{{ state.item()?.name }}<fex-upload-progress
        /></ng-template>
      </fex-upload-item>
      }
    </ng-template>
  </fex-upload-list>
</fex-upload-root>
```

`UploadRoot` 支持 `controller`、`options`、`invalid`、`name` 和 `required`。`fexUploadTrigger` 与 `fexUploadDropzone` 是可绑定到调用方元素的行为 directive。

Signal API 包括 `createUploadSignals`、`createUploadItemSignal`、`createUploadMd5Signal`、`createUploadPartsSignal` 和 `createUploadProgressSignal`。服务端响应和错误分别原样保存在 `item.response`、`item.error`，业务自行决定展示。
