import { Card } from '@fex-design/react/ui/card'
import { Tour } from '@fex-design/react/primitive/tour'
import { DemoTarget, StartTourButton, TourPanel } from './shared'

export function CustomGapTourDemo() {
  return (
    <Card title="自定义高亮区域" description="gap offset 控制矩形 spotlight 与目标之间的边距。">
      <Tour.Root>
        <div className="flex items-center gap-2">
          <DemoTarget name="gap-target">高亮区域</DemoTarget>
          <StartTourButton />
        </div>
        <Tour.Portal>
          <Tour.Overlay />
          <Tour.Step name="gap" target="gap-target" gap={{ offset: 16 }}>
            <Tour.Content>
              <Tour.Arrow />
              <TourPanel title="高亮区域参数" description="这个 spotlight 使用了更大的矩形边距。" />
            </Tour.Content>
          </Tour.Step>
        </Tour.Portal>
      </Tour.Root>
    </Card>
  )
}
