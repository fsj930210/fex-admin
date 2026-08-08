import { QrCode } from '@fex-design/solid/primitive/qrcode'
import Card from '@fex-design/solid/ui/card'

export function CompositionDemo() {
  return (
    <Card title="Composition" description="Modules 和 Center 可以独立组合，中心内容由调用方决定。">
      <QrCode.Root
        value="https://fex.design/composition"
        size={176}
        errorLevel="H"
        class="bg-muted-background"
      >
        <QrCode.Svg>
          <QrCode.Background />
          <QrCode.Modules centerSize={40} />
          <QrCode.Center size={40} aria-label="Fex Design">
            <rect width="100" height="100" rx="20" class="fill-background" />
            <text
              x="50"
              y="52"
              text-anchor="middle"
              dominant-baseline="middle"
              font-size="30"
              class="fill-primary font-semibold"
            >
              FX
            </text>
          </QrCode.Center>
        </QrCode.Svg>
      </QrCode.Root>
    </Card>
  )
}
