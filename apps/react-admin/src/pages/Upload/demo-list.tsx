import {
  UploadItem,
  UploadItemPreview,
  UploadItemProgress,
  UploadList,
  useUploadContext,
} from '@fex/components-react/primitive/upload'
import { Button } from '@fex/components-react/ui/button'
import { useSyncExternalStore } from 'react'
import { MultipartDetails } from './multipart-details'

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (Array.isArray(error)) return error.map(formatError).filter(Boolean).join('；')
  if (typeof error === 'object' && error !== null && 'error' in error)
    return String(error.error)
  return String(error)
}

function isInstantResponse(response: unknown) {
  return typeof response === 'object' && response !== null && 'instant' in response && response.instant === true
}

export function DemoUploadList({ showMultipart = false }: { showMultipart?: boolean }) {
  const { upload } = useUploadContext()
  const items = useSyncExternalStore(upload.subscribeItems, upload.getItems, upload.getItems)
  return (
    <>
      <UploadList className="mt-space-md">
        {(items) => items.map((item) => (
          <UploadItem key={item.id} id={item.id}>
            {(state) => (
              <>
                <UploadItemPreview />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate font-medium">{state.item?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {state.item ? `${((state.item.size ?? 0) / 1024).toFixed(1)} KB` : ''}
                    </span>
                  </div>
                  {!showMultipart && state.item?.status === 'uploading' && <UploadItemProgress className="mt-1" />}
                  {showMultipart && <MultipartDetails id={item.id} />}
                  {state.item?.status === 'success' && (
                    <p className="mt-1 text-xs text-primary">
                      {isInstantResponse(state.item.response) ? 'MD5 命中，已秒传' : '上传完成'}
                    </p>
                  )}
                  {state.item?.error !== undefined && state.item.error !== false && (
                    <div className="mt-1 text-xs text-danger">{formatError(state.item.error)}</div>
                  )}
                </div>
                <div className="flex gap-space-xs">
                  {state.item?.status === 'pending' && <Button size="xs" variant="ghost" onClick={() => void state.start()}>上传</Button>}
                  {state.item?.status === 'error' && state.item.errorStage !== 'before-upload' && <Button size="xs" variant="ghost" onClick={() => void state.retry()}>重试</Button>}
                  {state.pause && state.item?.status === 'uploading' && <Button size="xs" variant="ghost" onClick={state.pause}>暂停</Button>}
                  {state.continue && state.item?.status === 'paused' && <Button size="xs" variant="ghost" onClick={() => void state.continue?.()}>继续</Button>}
                  <Button size="xs" variant="destructive" onClick={() => void state.remove()}>删除</Button>
                </div>
              </>
            )}
          </UploadItem>
        ))}
      </UploadList>
      {items.length > 0 && <Button className="mt-space-sm w-full" size="xs" variant="ghost" onClick={() => void upload.clear()}>清空列表</Button>}
    </>
  )
}
