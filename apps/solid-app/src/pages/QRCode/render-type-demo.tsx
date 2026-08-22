import { QrCode } from '@fex-design/solid/primitive/qrcode'
import { Card } from '@fex-design/solid/ui/card'

export function RenderTypeDemo() {
  return (
    <Card title="自定义渲染类型" description="同一个 Root 模型可以选择 SVG 或 Canvas 渲染面。">
      <div class="flex flex-wrap gap-space-lg">
        <QrCode.Root value="https://fex.design/qrcode/svg" size={160}>
          <QrCode.Svg aria-label="SVG QR code"><QrCode.Background /><QrCode.Modules /></QrCode.Svg>
        </QrCode.Root>
        <QrCode.Root value="https://fex.design/qrcode/canvas" size={160}>
          <QrCode.Canvas aria-label="Canvas QR code" />
        </QrCode.Root>
      </div>
    </Card>
  )
}
