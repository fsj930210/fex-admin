import { InputControl, InputRoot } from '@fex-design/react/primitive/input'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@fex-design/react/primitive/slider'
import { Watermark } from '@fex-design/react/primitive/watermark'
import { Card } from '@fex-design/react/ui/card'
import { useState, type ReactNode } from 'react'

function Control(props: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-space-sm text-sm text-foreground">
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
  const [content, setContent] = useState('FEX Admin')
  const [color, setColor] = useState('rgba(0, 0, 0, 0.15)')
  const [fontSize, setFontSize] = useState(18)
  const [zIndex, setZIndex] = useState(9)
  const [rotate, setRotate] = useState(-22)
  const [gapX, setGapX] = useState(100)
  const [gapY, setGapY] = useState(100)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  return (
    <Card
      title="Custom Config"
      description="Adjust content, font, layering, rotation, gap, and offset."
    >
      <div className="grid gap-space-xl lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="grid gap-space-lg">
          <Control label="Content">
            <InputRoot value={content} onValueChange={setContent}>
              <InputControl aria-label="Watermark content" />
            </InputRoot>
          </Control>
          <Control label="Color">
            <InputRoot value={color} onValueChange={setColor}>
              <InputControl aria-label="Watermark color" />
            </InputRoot>
          </Control>
          <NumberSlider label="FontSize" value={fontSize} min={12} max={42} onChange={setFontSize} />
          <NumberSlider label="ZIndex" value={zIndex} min={1} max={20} onChange={setZIndex} />
          <NumberSlider label="Rotate" value={rotate} min={-45} max={45} onChange={setRotate} />
          <div className="grid grid-cols-2 gap-space-sm">
            <Control label="Gap X">
              <InputRoot value={String(gapX)} onValueChange={(value) => setGapX(Number(value) || 0)}>
                <InputControl inputMode="numeric" aria-label="Gap X" />
              </InputRoot>
            </Control>
            <Control label="Gap Y">
              <InputRoot value={String(gapY)} onValueChange={(value) => setGapY(Number(value) || 0)}>
                <InputControl inputMode="numeric" aria-label="Gap Y" />
              </InputRoot>
            </Control>
            <Control label="Offset X">
              <InputRoot value={String(offsetX)} onValueChange={(value) => setOffsetX(Number(value) || 0)}>
                <InputControl inputMode="numeric" aria-label="Offset X" />
              </InputRoot>
            </Control>
            <Control label="Offset Y">
              <InputRoot value={String(offsetY)} onValueChange={(value) => setOffsetY(Number(value) || 0)}>
                <InputControl inputMode="numeric" aria-label="Offset Y" />
              </InputRoot>
            </Control>
          </div>
        </div>
        <Watermark
          content={content}
          font={{ color, fontSize }}
          zIndex={zIndex}
          rotate={rotate}
          gap={[gapX, gapY]}
          offset={[offsetX, offsetY]}
          className="min-h-96 rounded-md border border-border bg-background"
        >
          <div className="grid min-h-96 place-items-center p-space-xl text-center text-sm text-muted-foreground">
            Config changes update the generated canvas tile.
          </div>
        </Watermark>
      </div>
    </Card>
  )
}
