import { QrCode } from '@fex-design/react/primitive/qrcode'
import { Card } from '@fex-design/react/ui/card'

export function ColorDemo() {
  return (
    <Card title="自定义颜色" description="color 和 bgColor 进入 core 模型，再由渲染部件消费。">
      <div className="flex flex-wrap gap-space-lg">
        <QrCode.Root value="https://fex.design/qrcode/blue" size={160} color="#075985" bgColor="#f0f9ff">
          <QrCode.Svg>
            <QrCode.Background />
            <QrCode.Modules />
          </QrCode.Svg>
        </QrCode.Root>
        <QrCode.Root value="https://fex.design/qrcode/green" size={160} color="#166534" bgColor="#f0fdf4">
          <QrCode.Svg>
            <QrCode.Background />
            <QrCode.Modules />
          </QrCode.Svg>
        </QrCode.Root>
      </div>
    </Card>
  )
}
