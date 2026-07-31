import { Link } from 'react-router'
import { AcceptUploadDemo } from './accept-demo'
import { DirectoryUploadDemo } from './directory-demo'
import { DropPasteUploadDemo } from './drop-paste-demo'
import { InstantUploadDemo } from './instant-upload-demo'
import { MultipartMd5UploadDemo } from './multipart-md5-demo'
import { MultipleUploadDemo } from './multiple-demo'
import { ResumeUploadDemo } from './resume-upload-demo'
import { RetryUploadDemo } from './retry-upload-demo'
import { SingleUploadDemo } from './single-demo'
import { ValidationUploadDemo } from './validation-demo'

export function UploadPage() {
  return <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div className="mx-auto w-full max-w-5xl space-y-space-xl"><header className="space-y-space-md"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link><div><h1 className="text-2xl font-semibold text-foreground">Upload 上传</h1><p className="max-w-3xl text-sm leading-6 text-muted-foreground">基于可选 feature 组合的上传 primitive，所有请求都连接本地 Node 上传服务。</p></div></header><div className="space-y-space-xl"><SingleUploadDemo /><MultipleUploadDemo /><AcceptUploadDemo /><DirectoryUploadDemo /><DropPasteUploadDemo /><MultipartMd5UploadDemo /><ResumeUploadDemo /><RetryUploadDemo /><InstantUploadDemo /><ValidationUploadDemo /></div></div></main>
}
