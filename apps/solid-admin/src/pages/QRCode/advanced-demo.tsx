import { QrCode } from '@fex-design/solid/primitive/qrcode'
import { Card } from '@fex-design/solid/ui/card'

export function AdvancedDemo() {
  return (
    <Card
      title="高级用法"
      description="通过 Center 和 Modules 的 centerSize 组合，在二维码中心叠加任意内容。"
    >
      <QrCode.Root
        value="https://fex.design/qrcode/advanced"
        size={192}
        errorLevel="H"
        color="#111827"
        bgColor="#f8fafc"
      >
        <QrCode.Svg>
          <QrCode.Background />
          <QrCode.Modules centerSize={56} />
          <QrCode.Center size={56}>
            <circle cx="50" cy="50" r="48" class="fill-background stroke-border" stroke-width="2" />
            <text
              x="50"
              y="52"
              text-anchor="middle"
              dominant-baseline="middle"
              font-size="26"
              class="fill-foreground font-semibold"
            >
              FEX
            </text>
          </QrCode.Center>
        </QrCode.Svg>
      </QrCode.Root>
    </Card>
  )
}
