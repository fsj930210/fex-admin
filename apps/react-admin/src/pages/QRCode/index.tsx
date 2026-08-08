import { Link } from 'react-router'
import { AdvancedDemo } from './advanced-demo'
import { BasicDemo } from './basic-demo'
import { ColorDemo } from './color-demo'
import { CustomStatusDemo } from './custom-status-demo'
import { DownloadDemo } from './download-demo'
import { ErrorLevelDemo } from './error-level-demo'
import { IconDemo } from './icon-demo'
import { RenderTypeDemo } from './render-type-demo'
import { SizeDemo } from './size-demo'
import { StatusDemo } from './status-demo'

export function QRCodePage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">QRCode</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            使用 primitive 部件组合二维码结构、渲染面、中心内容和自定义状态。
          </p>
        </header>
        <div className="grid gap-space-xl">
          <BasicDemo />
          <IconDemo />
          <StatusDemo />
          <CustomStatusDemo />
          <RenderTypeDemo />
          <SizeDemo />
          <ColorDemo />
          <DownloadDemo />
          <ErrorLevelDemo />
          <AdvancedDemo />
        </div>
      </div>
    </main>
  )
}
