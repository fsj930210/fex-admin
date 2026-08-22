import { useState } from 'react'
import { QrCode } from '@fex-design/react/primitive/qrcode'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'

export function OverlayDemo() {
  const [expired, setExpired] = useState(true)

  return (
    <Card title="Overlay" description="Overlay 不参与二维码生成，可组合加载、失效和自定义操作状态。">
      <div className="flex flex-wrap items-center gap-space-md">
        <QrCode.Root value="https://fex.design/overlay" size={176}>
          <QrCode.Svg>
            <QrCode.Background />
            <QrCode.Modules />
          </QrCode.Svg>
          {expired ? (
            <QrCode.Overlay>
              <Button size="sm" onClick={() => setExpired(false)}>
                Refresh
              </Button>
            </QrCode.Overlay>
          ) : null}
        </QrCode.Root>
        <Button variant="outline" onClick={() => setExpired((value) => !value)}>
          Toggle overlay
        </Button>
      </div>
    </Card>
  )
}
