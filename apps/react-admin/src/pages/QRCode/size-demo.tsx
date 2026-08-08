import { QrCode } from '@fex-design/react/primitive/qrcode'
import { Card } from '@fex-design/react/ui/card'

export function SizeDemo() {
  return (
    <Card title="自定义尺寸" description="通过 Root 的 size 控制二维码输出尺寸。">
      <div className="flex flex-wrap items-end gap-space-lg">
        {[96, 128, 176].map((size) => (
          <QrCode.Root key={size} value={'https://fex.design/qrcode/size/' + size} size={size}>
            <QrCode.Svg>
              <QrCode.Background />
              <QrCode.Modules />
            </QrCode.Svg>
          </QrCode.Root>
        ))}
      </div>
    </Card>
  )
}
