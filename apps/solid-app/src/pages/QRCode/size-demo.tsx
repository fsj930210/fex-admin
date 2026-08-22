import { For } from 'solid-js'
import { QrCode } from '@fex-design/solid/primitive/qrcode'
import { Card } from '@fex-design/solid/ui/card'

const sizes = [96, 128, 176]

export function SizeDemo() {
  return (
    <Card title="自定义尺寸" description="通过 Root 的 size 控制二维码输出尺寸。">
      <div class="flex flex-wrap items-end gap-space-lg">
        <For each={sizes}>
          {(size) => (
            <QrCode.Root value={'https://fex.design/qrcode/size/' + size} size={size}>
              <QrCode.Svg><QrCode.Background /><QrCode.Modules /></QrCode.Svg>
            </QrCode.Root>
          )}
        </For>
      </div>
    </Card>
  )
}
