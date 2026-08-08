import { QrCode } from '@fex-design/solid/primitive/qrcode'
import Card from '@fex-design/solid/ui/card'

export function CanvasDemo() {
  return (
    <Card title="Canvas" description="Canvas renderer 适合需要像素绘制或后续导出的场景。">
      <QrCode.Root
        value="https://fex.design/canvas"
        size={176}
        color="#075985"
        bgColor="#f0f9ff"
      >
        <QrCode.Canvas aria-label="Canvas QR code" />
      </QrCode.Root>
    </Card>
  )
}
