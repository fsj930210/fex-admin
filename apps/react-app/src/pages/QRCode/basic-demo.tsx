import { QrCode } from '@fex-design/react/primitive/qrcode'
import { Card } from '@fex-design/react/ui/card'

export function BasicDemo() {
  return (
    <Card title="基本使用" description="使用 SVG 部件渲染最基础的二维码。">
      <QrCode.Root
        value="https://fex.design/components/qrcode"
        size={176}
        margin={4}
        errorLevel="M"
        aria-label="Fex Design QR code"
      >
        <QrCode.Svg>
          <QrCode.Background />
          <QrCode.Modules />
        </QrCode.Svg>
      </QrCode.Root>
    </Card>
  )
}
