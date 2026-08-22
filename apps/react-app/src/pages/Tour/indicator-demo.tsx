import { Card } from '@fex-design/react/ui/card'
import { Tour, useTour } from '@fex-design/react/primitive/tour'
import { DemoTarget, StartTourButton, TourPanel } from './shared'

function Indicators() {
  const { snapshot, goTo } = useTour()
  return (
    <div className="flex items-center gap-1" aria-label="引导进度">
      {Array.from({ length: snapshot.total }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`第 ${index + 1} 步`}
          aria-current={index === snapshot.currentIndex ? 'step' : undefined}
          className={`h-1.5 rounded-full transition-all ${index === snapshot.currentIndex ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/40'}`}
          onClick={() => void goTo(index)}
        />
      ))}
    </div>
  )
}

function IndicatorActions() {
  const { snapshot } = useTour()
  return (
    <div className="flex justify-end gap-2">
      <Tour.Control action="previous">上一步</Tour.Control>
      <Tour.Control action={snapshot.isLast ? 'complete' : 'next'}>
        {snapshot.isLast ? '完成' : '下一步'}
      </Tour.Control>
    </div>
  )
}

export function CustomIndicatorTourDemo() {
  return (
    <Card title="自定义指示器" description="进度数据来自 snapshot，指示器 DOM 完全由业务实现。">
      <Tour.Root>
        <div className="flex flex-wrap items-center gap-2">
          <DemoTarget name="indicator-one">目标一</DemoTarget>
          <DemoTarget name="indicator-two">目标二</DemoTarget>
          <DemoTarget name="indicator-three">目标三</DemoTarget>
          <StartTourButton />
        </div>
        <Tour.Portal>
          <Tour.Overlay />
          {['one', 'two', 'three'].map((name, index) => (
            <Tour.Step key={name} name={`indicator-${name}`} target={`indicator-${name}`}>
              <Tour.Content>
                <Tour.Arrow />
                <TourPanel title={`第 ${index + 1} 步`} description="点击下方指示器可以直接跳转。">
                  <div className="space-y-3">
                    <Indicators />
                    <IndicatorActions />
                  </div>
                </TourPanel>
              </Tour.Content>
            </Tour.Step>
          ))}
        </Tour.Portal>
      </Tour.Root>
    </Card>
  )
}
