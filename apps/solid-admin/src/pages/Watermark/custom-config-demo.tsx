import { InputControl, InputRoot } from '@fex-design/solid/primitive/input'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@fex-design/solid/primitive/slider'
import { Watermark } from '@fex-design/solid/primitive/watermark'
import { Card } from '@fex-design/solid/ui/card'
import { createSignal, type JSX } from 'solid-js'

function Control(props: { label: string; children: JSX.Element }) {
  return (
    <label class="grid gap-space-sm text-sm text-foreground">
      <span>{props.label}</span>
      {props.children}
    </label>
  )
}

function NumberSlider(props: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <Control label={props.label + ': ' + props.value}>
      <SliderRoot
        value={[props.value]}
        min={props.min}
        max={props.max}
        onValueChange={(value) => props.onChange(value[0] ?? props.value)}
        aria-label={props.label}
      >
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb aria-label={props.label} />
      </SliderRoot>
    </Control>
  )
}

export function CustomConfigDemo() {
  const [content, setContent] = createSignal('FEX Admin')
  const [color, setColor] = createSignal('rgba(0, 0, 0, 0.15)')
  const [fontSize, setFontSize] = createSignal(18)
  const [zIndex, setZIndex] = createSignal(9)
  const [rotate, setRotate] = createSignal(-22)
  const [gapX, setGapX] = createSignal(100)
  const [gapY, setGapY] = createSignal(100)
  const [offsetX, setOffsetX] = createSignal(0)
  const [offsetY, setOffsetY] = createSignal(0)

  return (
    <Card
      title="Custom Config"
      description="Adjust content, font, layering, rotation, gap, and offset."
    >
      <div class="grid gap-space-xl lg:grid-cols-[280px_minmax(0,1fr)]">
        <div class="grid gap-space-lg">
          <Control label="Content">
            <InputRoot value={content()} onValueChange={setContent}>
              <InputControl aria-label="Watermark content" />
            </InputRoot>
          </Control>
          <Control label="Color">
            <InputRoot value={color()} onValueChange={setColor}>
              <InputControl aria-label="Watermark color" />
            </InputRoot>
          </Control>
          <NumberSlider label="FontSize" value={fontSize()} min={12} max={42} onChange={setFontSize} />
          <NumberSlider label="ZIndex" value={zIndex()} min={1} max={20} onChange={setZIndex} />
          <NumberSlider label="Rotate" value={rotate()} min={-45} max={45} onChange={setRotate} />
          <div class="grid grid-cols-2 gap-space-sm">
            <Control label="Gap X">
              <InputRoot value={String(gapX())} onValueChange={(value) => setGapX(Number(value) || 0)}>
                <InputControl inputMode="numeric" aria-label="Gap X" />
              </InputRoot>
            </Control>
            <Control label="Gap Y">
              <InputRoot value={String(gapY())} onValueChange={(value) => setGapY(Number(value) || 0)}>
                <InputControl inputMode="numeric" aria-label="Gap Y" />
              </InputRoot>
            </Control>
            <Control label="Offset X">
              <InputRoot value={String(offsetX())} onValueChange={(value) => setOffsetX(Number(value) || 0)}>
                <InputControl inputMode="numeric" aria-label="Offset X" />
              </InputRoot>
            </Control>
            <Control label="Offset Y">
              <InputRoot value={String(offsetY())} onValueChange={(value) => setOffsetY(Number(value) || 0)}>
                <InputControl inputMode="numeric" aria-label="Offset Y" />
              </InputRoot>
            </Control>
          </div>
        </div>
        <Watermark
          content={content()}
          font={{ color: color(), fontSize: fontSize() }}
          zIndex={zIndex()}
          rotate={rotate()}
          gap={[gapX(), gapY()]}
          offset={[offsetX(), offsetY()]}
          class="min-h-96 rounded-md border border-border bg-background"
        >
          <div class="grid min-h-96 place-items-center p-space-xl text-center text-sm text-muted-foreground">
            Config changes update the generated canvas tile.
          </div>
        </Watermark>
      </div>
    </Card>
  )
}
