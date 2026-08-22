import { Card } from '@fex-design/react/ui/card'
import { Tour } from '@fex-design/react/primitive/tour'
import { DemoTarget, StartTourButton, TourPanel } from './shared'

export function CustomMaskTourDemo() {
  return (
    <Card title="自定义遮罩" description="Overlay 的渲染结果可以完全替换。">
      <Tour.Root>
        <div className="flex items-center gap-2">
          <DemoTarget name="mask-target">自定义遮罩目标</DemoTarget>
          <StartTourButton />
        </div>
        <Tour.Portal>
          <Tour.Overlay>
            {({ props, targetRect }) => (
              <div {...props} className="fixed inset-0 z-[1000] bg-slate-950/70">
                {targetRect ? (
                  <div
                    className="absolute border-2 border-primary bg-primary/10 shadow-[0_0_0_9999px_rgba(15,23,42,0.7)]"
                    style={{
                      left: targetRect.x - 8,
                      top: targetRect.y - 8,
                      width: targetRect.width + 16,
                      height: targetRect.height + 16,
                      borderRadius: 0,
                    }}
                  />
                ) : null}
              </div>
            )}
          </Tour.Overlay>
          <Tour.Step name="mask" target="mask-target">
            <Tour.Content>
              <Tour.Arrow />
              <TourPanel title="自定义遮罩" description="这里使用了自定义的高亮边框和阴影。" />
            </Tour.Content>
          </Tour.Step>
        </Tour.Portal>
      </Tour.Root>
    </Card>
  )
}
