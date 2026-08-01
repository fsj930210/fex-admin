import {
  UploadItem,
  UploadItemPreview,
  UploadItemProgress,
  UploadList,
  useUploadContext,
} from '@fex/components-solid/primitive/upload'
import { Button } from '@fex/components-solid/ui/button'
import { For, Show, createSignal, onCleanup } from 'solid-js'
import { MultipartDetails } from './multipart-details'
const formatError = (value: unknown) => (value instanceof Error ? value.message : String(value))
export function DemoUploadList(props: { showMultipart?: boolean }) {
  const { upload } = useUploadContext()
  const [count, setCount] = createSignal(upload.getItems().length)
  const unsubscribe = upload.subscribeItems(() => setCount(upload.getItems().length))
  onCleanup(unsubscribe)
  return (
    <>
      <UploadList>
        {(items) => (
          <For each={items}>
            {(item) => (
              <UploadItem id={item.id}>
                {(state) => (
                  <>
                    <UploadItemPreview />
                    <div class="min-w-0 flex-1">
                      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span class="truncate font-medium">{state.item()?.name}</span>
                        <span class="text-xs text-muted-foreground">
                          {((state.item()?.size ?? 0) / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <Show when={!props.showMultipart && state.item()?.status === 'uploading'}>
                        <UploadItemProgress class="mt-1" />
                      </Show>
                      <Show when={props.showMultipart}>
                        <MultipartDetails id={item.id} />
                      </Show>
                      <Show when={state.item()?.status === 'success'}>
                        <p class="mt-1 text-xs text-primary">
                          {(state.item()?.response as { instant?: boolean })?.instant
                            ? 'MD5 命中，已秒传'
                            : '上传完成'}
                        </p>
                      </Show>
                      <Show
                        when={state.item()?.error !== undefined && state.item()?.error !== false}
                      >
                        <div class="mt-1 text-xs text-danger">
                          {formatError(state.item()?.error)}
                        </div>
                      </Show>
                    </div>
                    <div class="flex gap-space-xs">
                      <Show when={state.item()?.status === 'pending'}>
                        <Button size="xs" variant="ghost" onClick={() => void state.start()}>
                          上传
                        </Button>
                      </Show>
                      <Show
                        when={
                          state.item()?.status === 'error' &&
                          state.item()?.errorStage !== 'before-upload'
                        }
                      >
                        <Button size="xs" variant="ghost" onClick={() => void state.retry()}>
                          重试
                        </Button>
                      </Show>
                      <Show when={state.pause && state.item()?.status === 'uploading'}>
                        <Button size="xs" variant="ghost" onClick={state.pause}>
                          暂停
                        </Button>
                      </Show>
                      <Show when={state.continue && state.item()?.status === 'paused'}>
                        <Button size="xs" variant="ghost" onClick={() => void state.continue?.()}>
                          继续
                        </Button>
                      </Show>
                      <Button size="xs" variant="destructive" onClick={() => void state.remove()}>
                        删除
                      </Button>
                    </div>
                  </>
                )}
              </UploadItem>
            )}
          </For>
        )}
      </UploadList>
      <Show when={count()}>
        <Button
          class="mt-space-sm w-full"
          size="xs"
          variant="ghost"
          onClick={() => void upload.clear()}
        >
          清空列表
        </Button>
      </Show>
    </>
  )
}
