# Upload primitive

Upload manages a controlled or uncontrolled list of local and remote files. Network behavior is installed explicitly through core features; the React package owns only DOM bindings, subscriptions, accessibility, and the default primitive presentation.

## Import

```tsx
import {
  UploadRoot,
  UploadTrigger,
  UploadList,
  UploadItem,
} from '@fex/components-react/primitive/upload'
import { Button } from '@fex/components-react/ui/button'
```

Core features use file-level imports:

```ts
import { uploadFeature } from '@fex/components-core/upload/features/upload'
import { multipartFeature } from '@fex/components-core/upload/features/multipart'
import { fileMd5Feature } from '@fex/components-core/upload/features/file-md5'
```

## Basic upload

```tsx
const upload = useUpload({
  features: [
    uploadFeature({
      request: ({ file, signal, onProgress }) =>
        uploadFile(file, { signal, onProgress }),
    }),
  ],
})

<UploadRoot controller={upload}>
  <UploadTrigger>
    {({ props }) => <Button {...props}>Choose file</Button>}
  </UploadTrigger>
  <UploadList>
    {items => items.map(item => (
      <UploadItem key={item.id} id={item.id}>
        {state => <>
          <div>
            <span>{state.item?.name}</span>
            <span>{state.item?.size} bytes</span>
          </div>
          <UploadItemProgress />
          <Button onClick={() => void state.remove()}>Remove</Button>
        </>}
      </UploadItem>
    ))}
  </UploadList>
</UploadRoot>
```

## UploadRoot options

| Option          | Type                                                                     | Description                                                                       |
| --------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `items`         | `readonly UploadItem[]`                                                  | Controlled item list.                                                             |
| `defaultItems`  | `readonly UploadItem[]`                                                  | Initial uncontrolled list.                                                        |
| `onItemsChange` | `(items) => void`                                                        | Reports every list or item-state change.                                          |
| `beforeUpload`  | `(file, context) => boolean \| File \| Blob \| UPLOAD_IGNORE \| Promise` | Validates, transforms, rejects, or ignores a file before upload.                  |
| `autoUpload`    | `boolean`                                                                | Starts the installed upload feature after a file is accepted. Defaults to `true`. |
| `accept`        | `string`                                                                 | Native file-picker accept hint. Enforce strict validation in `beforeUpload`.      |
| `multiple`      | `boolean`                                                                | Enables multiple selection.                                                       |
| `maxCount`      | `number`                                                                 | Rejects files beyond the current available list capacity.                         |
| `disabled`      | `boolean`                                                                | Disables file acquisition.                                                        |
| `beforeRemove`  | `(item) => boolean \| Promise<boolean>`                                  | Asynchronously allows or blocks removal.                                          |
| `features`      | `UploadFeatureRegistration[]`                                            | Explicit core behavior registrations.                                             |

`UploadRoot` additionally accepts `invalid`, `name`, and `required` for React DOM and form integration. `invalid` is reflected by `aria-invalid` and primitive error styles.

## beforeUpload

- `true` or `undefined` uploads the original file.
- `File` or `Blob` replaces the upload body.
- `false` keeps an error item in the list and does not upload.
- A rejected promise keeps the original error on the item.
- `UPLOAD_IGNORE` neither uploads nor inserts an item.

## Features

- `uploadFeature`: one request per file with progress, cancellation, and retry.
- `multipartFeature`: splits a file once and executes the batches returned by `resolveUploadPlan`; without a plan, pending parts are uploaded sequentially.
- `fileMd5Feature`: computes a complete-file MD5 in a Worker and exposes progress. `chunkSize` controls the Worker read size and can share the multipart part size.
- `dropFeature`: adds drag state and dropped-file ingestion.
- `pasteFeature`: adds clipboard-file ingestion to `UploadDropzone`.
- `directoryFeature`: changes the hidden picker to directory mode.
- `previewFeature`: owns and revokes local object URLs.

`uploadFeature` and `multipartFeature` both install the `upload` feature ID, so they cannot be installed together.

## Multipart plan

```ts
resolveUploadPlan: async ({ parts }) => ({
  completed: await loadCompletedParts(),
  batches: [parts.filter(isMissing).map((part) => part.index)],
})
```

The outer `batches` array is sequential; indices inside one batch are started together. The component does not infer server checkpoint semantics.

- Resume upload: persist the server `uploadId`, query completed indexes, return them through `completed`, and place only missing indexes in `batches`.
- Failed-part retry: return batches containing parts whose status is not `success`; successful parts are retained by the feature.
- Instant upload: query the server by MD5 and return `complete: { response }` when it already owns the file. The response is stored unchanged and no part request is sent.
- Multipart upload itself does not imply resume, retry policy, MD5, or instant upload. These policies are composed by `resolveUploadPlan`.

## Hooks

| Hook                | Purpose                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `useUpload`         | Creates a stable controller.                                                                                   |
| `useUploadContext`  | Reads the nearest root controller.                                                                             |
| `useUploadItem`     | Subscribes to one item and exposes start, retry, cancel, pause, continue, and remove actions.                  |
| `useUploadFeature`  | Reads a feature API by ID.                                                                                     |
| `useUploadMd5`      | Subscribes to Worker MD5 state and progress.                                                                   |
| `useUploadParts`    | Subscribes to Multipart part states.                                                                           |
| `useUploadProgress` | Derives one process percentage from MD5 processing and network upload progress. `md5Weight` defaults to `0.1`. |
| `useUploadPreview`  | Gets a preview feature object URL.                                                                             |

```tsx
const progress = useUploadProgress(item.id, { md5Weight: 0.1 })

// One progress bar: MD5 occupies 0-10%, upload occupies 10-100%.
<Progress value={progress.percent} />
```

## Notes

- Server responses and thrown request errors are stored without interpretation.
- Removing an item cancels active requests and clears feature runtime resources.
- `accept` is only a native picker hint; dropped and pasted files must be checked in `beforeUpload`.
- A server-backed existing item can omit `file` and provide `name`, `status`, and the original `response`.
- The independent NestJS demo server under `server/` is for local behavior verification; start it with `pnpm dev:server` from the repository root.
