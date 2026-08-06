import { Card } from '@fex-design/react/ui/card'
import { Tour } from '@fex-design/react/primitive/tour'
import { DefaultTourActions, DemoTarget, StartTourButton, TourPanel } from './shared'

export function BasicTourDemo() {
  return (
    <Card title="基本 / 非受控" description="Primitive 通过 Tour.Step 组合，不依赖 steps 数组。">
      <Tour.Root defaultOpen={false}>
        <div className="flex flex-wrap items-center gap-2">
          <DemoTarget name="basic-first">第一个目标</DemoTarget>
          <DemoTarget name="basic-second">第二个目标</DemoTarget>
          <StartTourButton />
        </div>
        <Tour.Portal>
          <Tour.Overlay />
          <Tour.Step name="basic-first" target="basic-first">
            <Tour.Content>
              <Tour.Arrow />
              <TourPanel title="第 1 步" description="这是一个非受控 Tour。">
                <DefaultTourActions />
              </TourPanel>
            </Tour.Content>
          </Tour.Step>
          <Tour.Step name="basic-second" target="basic-second">
            <Tour.Content>
              <Tour.Arrow />
              <TourPanel title="第 2 步" description="步骤通过 Tour.Step 组合注册。">
                <DefaultTourActions />
              </TourPanel>
            </Tour.Content>
          </Tour.Step>
        </Tour.Portal>
      </Tour.Root>
    </Card>
  )
}
