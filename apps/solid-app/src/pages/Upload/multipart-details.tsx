import {
  createUploadMd5,
  createUploadParts,
  createUploadProgress,
} from '@fex-design/solid/primitive/upload'
import { For, Show } from 'solid-js'
const text = { pending: '等待', uploading: '上传中', success: '完成', error: '失败' } as const
export function MultipartDetails(props: { id: string }) {
  const md5 = createUploadMd5(() => props.id)
  const parts = createUploadParts(() => props.id)
  const progress = createUploadProgress(() => props.id, { md5Weight: 0.1 })
  const completed = () => parts().filter((part) => part.status === 'success').length
  return (
    <div class="mt-space-sm space-y-space-sm text-xs">
      <div>
        <div class="mb-1 flex justify-between text-muted-foreground">
          <span>总进度（MD5 10% + 上传 90%）</span>
          <span>{progress().percent.toFixed(0)}%</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            class="h-full bg-primary transition-[width]"
            style={{ width: `${progress().percent}%` }}
          />
        </div>
      </div>
      <Show when={md5.available}>
        <div>
          <div class="mb-1 flex justify-between text-muted-foreground">
            <span>
              {md5.state()?.status === 'calculating'
                ? '正在计算 MD5'
                : md5.state()?.status === 'success'
                  ? 'MD5 计算完成'
                  : '准备计算 MD5'}
            </span>
            <span>{(md5.state()?.progress ?? 0).toFixed(0)}%</span>
          </div>
          <Show when={md5.state()?.value}>
            <p class="mt-1 break-all text-muted-foreground">{md5.state()?.value}</p>
          </Show>
        </div>
      </Show>
      <Show when={parts().length}>
        <div>
          <p class="mb-1 text-muted-foreground">
            分片进度：{completed()}/{parts().length}
          </p>
          <div class="grid grid-cols-4 gap-1 sm:grid-cols-8">
            <For each={parts()}>
              {(part) => (
                <div
                  class="rounded border border-border px-1 py-0.5 text-center data-[status=error]:border-danger data-[status=error]:text-danger data-[status=success]:border-primary data-[status=success]:text-primary"
                  data-status={part.status}
                  title={`分片 ${part.index + 1}：${text[part.status]}`}
                >
                  {part.index + 1} ·{' '}
                  {part.status === 'uploading'
                    ? `${part.progress?.percent?.toFixed(0) ?? 0}%`
                    : text[part.status]}
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}
