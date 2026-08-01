import type { UploadId, UploadStatus } from '@fex/components-core/upload/types'
import { useUploadContext } from './upload-context'
import { useUploadMd5 } from './use-upload-feature'
import { useUploadItem } from './use-upload-item'

export interface UseUploadProgressOptions {
  md5Weight?: number
}

export interface UploadProcessProgress {
  status: UploadStatus | undefined
  percent: number
  md5Percent: number
  uploadPercent: number
}

export function useUploadProgress(
  id: UploadId,
  options: UseUploadProgressOptions = {},
): UploadProcessProgress {
  const { upload } = useUploadContext()
  const item = useUploadItem(upload, id).item
  const md5 = useUploadMd5(id)
  const md5Weight = md5.available ? Math.min(1, Math.max(0, options.md5Weight ?? 0.1)) : 0
  const md5Percent = md5.state?.progress ?? 0
  const uploadPercent = item?.progress?.percent ?? 0
  let percent = 0

  if (item?.status === 'processing') percent = md5Percent * md5Weight
  else if (item?.status === 'error' && md5.available && md5.state?.status !== 'success')
    percent = md5Percent * md5Weight
  else if (item?.status === 'uploading' || item?.status === 'paused' || item?.status === 'error')
    percent = md5Weight * 100 + uploadPercent * (1 - md5Weight)
  else if (item?.status === 'success') percent = 100

  return { status: item?.status, percent, md5Percent, uploadPercent }
}
