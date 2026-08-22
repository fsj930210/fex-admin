import { QrCode } from '@fex-design/solid/primitive/qrcode'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'

export function DownloadDemo() {
  let canvasRef: HTMLCanvasElement | undefined

  function download() {
    if (!canvasRef) return
    const link = document.createElement('a')
    link.download = 'fex-qrcode.png'
    link.href = canvasRef.toDataURL('image/png')
    link.click()
  }

  return (
    <Card title="下载二维码" description="下载不是 QRCode 内置能力，这里演示业务侧基于 Canvas 组合导出 PNG。">
      <div class="flex flex-wrap items-center gap-space-md">
        <QrCode.Root value="https://fex.design/qrcode/download" size={176}>
          <QrCode.Canvas ref={canvasRef} aria-label="Downloadable QR code" />
        </QrCode.Root>
        <Button onClick={download}>下载 PNG</Button>
      </div>
    </Card>
  )
}
