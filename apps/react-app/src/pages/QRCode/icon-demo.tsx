import { QrCode } from '@fex-design/react/primitive/qrcode'
import { Card } from '@fex-design/react/ui/card'

export function IconDemo() {
  return (
    <Card title="带 Icon 的例子" description="通过 Center 放置小 Logo，Modules 只为 Logo 背板留出必要空间。">
      <QrCode.Root value="https://fex.design/qrcode/icon" size={176} errorLevel="H">
        <QrCode.Svg>
          <QrCode.Background />
          <QrCode.Modules centerSize={44} />
          <QrCode.Center size={44} aria-label="Fex Design">
            <circle
              cx="50"
              cy="50"
              r="48"
              className="fill-background stroke-border"
              strokeWidth="2"
            />
            <text
              x="50"
              y="52"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="28"
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
