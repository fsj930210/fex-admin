import { QrCode } from '@fex-design/react/primitive/qrcode'
import { Card } from '@fex-design/react/ui/card'

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
            <circle cx="50" cy="50" r="48" className="fill-background stroke-border" strokeWidth="2" />
            <text
              x="50"
              y="52"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="26"
              className="fill-foreground font-semibold"
            >
              FEX
            </text>
          </QrCode.Center>
        </QrCode.Svg>
      </QrCode.Root>
    </Card>
  )
}
