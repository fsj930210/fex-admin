import {
  useUploadMd5,
  useUploadParts,
  useUploadProgress,
} from '@fex-design/react/primitive/upload'

const partStatusText = {
  pending: '等待',
  uploading: '上传中',
  success: '完成',
  error: '失败',
} as const

export function MultipartDetails({ id }: { id: string }) {
  const md5 = useUploadMd5(id)
  const parts = useUploadParts(id)
  const progress = useUploadProgress(id, { md5Weight: 0.1 })
  const md5Progress = md5.state?.progress ?? 0
  const completed = parts.filter((part) => part.status === 'success').length

  return (
    <div className="mt-space-sm space-y-space-sm text-xs">
      <div>
        <div className="mb-1 flex justify-between text-muted-foreground">
          <span>总进度（MD5 10% + 上传 90%）</span>
          <span>{progress.percent.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
      {md5.available && (
        <div>
          <div className="mb-1 flex justify-between text-muted-foreground">
            <span>
              {md5.state?.status === 'calculating'
                ? '正在计算 MD5'
                : md5.state?.status === 'success'
                  ? 'MD5 计算完成'
                  : '准备计算 MD5'}
            </span>
            <span>{md5Progress.toFixed(0)}%</span>
          </div>
          {md5.state?.value && (
            <p className="mt-1 break-all text-muted-foreground">{md5.state.value}</p>
          )}
        </div>
      )}
      {parts.length > 0 && (
        <div>
          <p className="mb-1 text-muted-foreground">
            分片进度：{completed}/{parts.length}
          </p>
          <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
            {parts.map((part) => (
              <div
                key={part.index}
                className="rounded border border-border px-1 py-0.5 text-center data-[status=error]:border-danger data-[status=error]:text-danger data-[status=success]:border-primary data-[status=success]:text-primary"
                data-status={part.status}
                title={`分片 ${part.index + 1}：${partStatusText[part.status]} ${part.progress?.percent?.toFixed(0) ?? 0}%`}
              >
                {part.index + 1} ·{' '}
                {part.status === 'uploading'
                  ? `${part.progress?.percent?.toFixed(0) ?? 0}%`
                  : partStatusText[part.status]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
