import { Card } from '@fex-design/react/ui/card'
import { Tour } from '@fex-design/react/primitive/tour'
import { DemoTarget, StartTourButton, TourPanel } from './shared'

export function NonModalTourDemo() {
  return (
    <Card title="非模态" description="关闭 mask，并允许目标区域继续交互。">
      <Tour.Root>
        <div className="flex flex-wrap items-center gap-2">
          <DemoTarget name="non-modal-target">仍然可以点击的目标</DemoTarget>
          <StartTourButton />
        </div>
        <Tour.Portal>
          <Tour.Overlay />
          <Tour.Step name="non-modal" target="non-modal-target" mask={false} disabledInteraction={false}>
            <Tour.Content>
              <Tour.Arrow />
              <TourPanel title="非模态引导" description="页面其他区域和目标仍然可交互。" />
            </Tour.Content>
          </Tour.Step>
        </Tour.Portal>
      </Tour.Root>
    </Card>
  )
}
