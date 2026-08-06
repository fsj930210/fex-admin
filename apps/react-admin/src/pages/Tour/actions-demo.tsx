import { Card } from '@fex-design/react/ui/card'
import { Tour } from '@fex-design/react/primitive/tour'
import { DemoTarget, StartTourButton, TourPanel } from './shared'

export function CustomActionsTourDemo() {
  return (
    <Card title="自定义操作按钮" description="Control 只提供行为，按钮排列和视觉由调用方决定。">
      <Tour.Root>
        <div className="flex items-center gap-2">
          <DemoTarget name="actions-target">操作按钮目标</DemoTarget>
          <StartTourButton />
        </div>
        <Tour.Portal>
          <Tour.Overlay />
          <Tour.Step name="actions" target="actions-target">
            <Tour.Content>
              <Tour.Arrow />
              <TourPanel title="自定义操作" description="这里使用了图标式的自定义按钮布局。">
                <div className="flex items-center justify-between">
                  <Tour.Control action="skip" className="border-transparent px-0 text-muted-foreground">
                    稍后再看
                  </Tour.Control>
                  <div className="flex gap-2">
                    <Tour.Control action="complete" className="border-primary bg-primary text-primary-foreground">
                      我知道了
                    </Tour.Control>
                  </div>
                </div>
              </TourPanel>
            </Tour.Content>
          </Tour.Step>
        </Tour.Portal>
      </Tour.Root>
    </Card>
  )
}
