import { QrCode } from '@fex-design/solid/primitive/qrcode'
import { Card } from '@fex-design/solid/ui/card'

export function BasicDemo() {
  return (
    <Card title="基本使用" description="使用 SVG 部件渲染最基础的二维码。">
      <QrCode.Root value="https://fex.design/components/qrcode" size={176} margin={4} errorLevel="M">
        <QrCode.Svg aria-label="Fex Design QR code">
          <QrCode.Background />
          <QrCode.Modules />
        </QrCode.Svg>
      </QrCode.Root>
    </Card>
  )
}
