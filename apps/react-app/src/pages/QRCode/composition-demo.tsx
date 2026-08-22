import { QrCode } from '@fex-design/react/primitive/qrcode'
import { Card } from '@fex-design/react/ui/card'

export function CompositionDemo() {
  return (
    <Card title="Composition" description="Modules 和 Center 可以独立组合，中心内容由调用方决定。">
      <QrCode.Root
        value="https://fex.design/composition"
        size={176}
        errorLevel="H"
        className="bg-muted-background"
      >
        <QrCode.Svg>
          <QrCode.Background />
          <QrCode.Modules centerSize={40} />
          <QrCode.Center size={40} aria-label="Fex Design">
            <rect width="100" height="100" rx="20" className="fill-background" />
            <text
              x="50"
              y="52"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="30"
              className="fill-primary font-semibold"
            >
              FX
            </text>
          </QrCode.Center>
        </QrCode.Svg>
      </QrCode.Root>
    </Card>
  )
}
