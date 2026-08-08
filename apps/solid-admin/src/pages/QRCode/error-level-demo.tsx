import { For } from 'solid-js'
import type { QrCodeErrorLevel } from '@fex-design/core/qrcode'
import { QrCode } from '@fex-design/solid/primitive/qrcode'
import { Card } from '@fex-design/solid/ui/card'

const levels: QrCodeErrorLevel[] = ['L', 'M', 'Q', 'H']

export function ErrorLevelDemo() {
  return (
    <Card title="纠错比例" description="errorLevel 透传给编码层，适合 Logo 或污损容错场景。">
      <div class="flex flex-wrap gap-space-lg">
        <For each={levels}>
          {(level) => (
            <div class="grid gap-space-xs text-center text-sm text-muted-foreground">
              <QrCode.Root value={'https://fex.design/qrcode/error/' + level} size={128} errorLevel={level}>
                <QrCode.Svg><QrCode.Background /><QrCode.Modules /></QrCode.Svg>
              </QrCode.Root>
              <span>{level}</span>
            </div>
          )}
        </For>
      </div>
    </Card>
  )
}
