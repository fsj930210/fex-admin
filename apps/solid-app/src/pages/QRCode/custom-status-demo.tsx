import { createSignal } from 'solid-js'
import { QrCode } from '@fex-design/solid/primitive/qrcode'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'

export function CustomStatusDemo() {
  const [expired, setExpired] = createSignal(true)

  return (
    <Card title="自定义状态渲染器" description="调用方完全控制遮罩内容、按钮和状态切换逻辑。">
      <div class="flex flex-wrap items-center gap-space-md">
        <QrCode.Root value="https://fex.design/qrcode/custom-status" size={176}>
          <QrCode.Svg><QrCode.Background /><QrCode.Modules /></QrCode.Svg>
          {expired() ? (
            <QrCode.Overlay>
              <div class="grid gap-space-xs">
                <span class="text-sm font-medium">二维码已过期</span>
                <Button size="sm" onClick={() => setExpired(false)}>重新加载</Button>
              </div>
            </QrCode.Overlay>
          ) : null}
        </QrCode.Root>
        <Button variant="outline" onClick={() => setExpired((value) => !value)}>切换状态</Button>
      </div>
    </Card>
  )
}
