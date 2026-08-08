<script lang="ts">
  import InputControl from '@fex-design/svelte/primitive/input-control'
  import InputRoot from '@fex-design/svelte/primitive/input'
  import Slider from '@fex-design/svelte/primitive/slider'
  import SliderRange from '@fex-design/svelte/primitive/slider-range'
  import SliderThumb from '@fex-design/svelte/primitive/slider-thumb'
  import SliderTrack from '@fex-design/svelte/primitive/slider-track'
  import Watermark from '@fex-design/svelte/primitive/watermark'
  import Card from '@fex-design/svelte/ui/card'

  let content = $state('FEX Admin')
  let color = $state('rgba(0, 0, 0, 0.15)')
  let fontSize = $state(18)
  let zIndex = $state(9)
  let rotate = $state(-22)
  let gapX = $state(100)
  let gapY = $state(100)
  let offsetX = $state(0)
  let offsetY = $state(0)

  const numeric = (value: string) => Number(value) || 0
</script>

<Card
  title="Custom Config"
  description="Adjust content, font, layering, rotation, gap, and offset."
>
  <div class="grid gap-space-xl lg:grid-cols-[280px_minmax(0,1fr)]">
    <div class="grid gap-space-lg">
      <label class="grid gap-space-sm text-sm text-foreground">
        <span>Content</span>
        <InputRoot value={content} onValueChange={(value: string) => (content = value)}>
          <InputControl aria-label="Watermark content" />
        </InputRoot>
      </label>
      <label class="grid gap-space-sm text-sm text-foreground">
        <span>Color</span>
        <InputRoot value={color} onValueChange={(value: string) => (color = value)}>
          <InputControl aria-label="Watermark color" />
        </InputRoot>
      </label>
      <label class="grid gap-space-sm text-sm text-foreground">
        <span>FontSize: {fontSize}</span>
        <Slider value={[fontSize]} min={12} max={42} aria-label="FontSize" onValueChange={(value) => (fontSize = value[0] ?? fontSize)}>
          <SliderTrack><SliderRange /></SliderTrack>
          <SliderThumb aria-label="FontSize" />
        </Slider>
      </label>
      <label class="grid gap-space-sm text-sm text-foreground">
        <span>ZIndex: {zIndex}</span>
        <Slider value={[zIndex]} min={1} max={20} aria-label="ZIndex" onValueChange={(value) => (zIndex = value[0] ?? zIndex)}>
          <SliderTrack><SliderRange /></SliderTrack>
          <SliderThumb aria-label="ZIndex" />
        </Slider>
      </label>
      <label class="grid gap-space-sm text-sm text-foreground">
        <span>Rotate: {rotate}</span>
        <Slider value={[rotate]} min={-45} max={45} aria-label="Rotate" onValueChange={(value) => (rotate = value[0] ?? rotate)}>
          <SliderTrack><SliderRange /></SliderTrack>
          <SliderThumb aria-label="Rotate" />
        </Slider>
      </label>
      <div class="grid grid-cols-2 gap-space-sm">
        <label class="grid gap-space-sm text-sm text-foreground">
          <span>Gap X</span>
          <InputRoot value={String(gapX)} onValueChange={(value: string) => (gapX = numeric(value))}>
            <InputControl inputmode="numeric" aria-label="Gap X" />
          </InputRoot>
        </label>
        <label class="grid gap-space-sm text-sm text-foreground">
          <span>Gap Y</span>
          <InputRoot value={String(gapY)} onValueChange={(value: string) => (gapY = numeric(value))}>
            <InputControl inputmode="numeric" aria-label="Gap Y" />
          </InputRoot>
        </label>
        <label class="grid gap-space-sm text-sm text-foreground">
          <span>Offset X</span>
          <InputRoot value={String(offsetX)} onValueChange={(value: string) => (offsetX = numeric(value))}>
            <InputControl inputmode="numeric" aria-label="Offset X" />
          </InputRoot>
        </label>
        <label class="grid gap-space-sm text-sm text-foreground">
          <span>Offset Y</span>
          <InputRoot value={String(offsetY)} onValueChange={(value: string) => (offsetY = numeric(value))}>
            <InputControl inputmode="numeric" aria-label="Offset Y" />
          </InputRoot>
        </label>
      </div>
    </div>
    <Watermark
      {content}
      font={{ color, fontSize }}
      {zIndex}
      {rotate}
      gap={[gapX, gapY]}
      offset={[offsetX, offsetY]}
      class="min-h-96 rounded-md border border-border bg-background"
    >
      <div class="grid min-h-96 place-items-center p-space-xl text-center text-sm text-muted-foreground">
        Config changes update the generated canvas tile.
      </div>
    </Watermark>
  </div>
</Card>
