import { QrCode } from '@fex-design/react/primitive/qrcode'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'

export function StatusDemo() {
  return (
    <Card title="不同的状态" description="状态不是 primitive 内建枚举，通过 Overlay 和业务按钮组合。">
      <div className="flex flex-wrap gap-space-lg">
        <QrCode.Root value="https://fex.design/qrcode/active" size={144}>
          <QrCode.Svg>
            <QrCode.Background />
            <QrCode.Modules />
          </QrCode.Svg>
        </QrCode.Root>
        <QrCode.Root value="https://fex.design/qrcode/loading" size={144}>
          <QrCode.Svg>
            <QrCode.Background />
            <QrCode.Modules />
          </QrCode.Svg>
          <QrCode.Overlay>Loading...</QrCode.Overlay>
        </QrCode.Root>
        <QrCode.Root value="https://fex.design/qrcode/expired" size={144}>
          <QrCode.Svg>
            <QrCode.Background />
            <QrCode.Modules />
          </QrCode.Svg>
          <QrCode.Overlay>
            <Button size="sm">Refresh</Button>
          </QrCode.Overlay>
        </QrCode.Root>
      </div>
    </Card>
  )
}
