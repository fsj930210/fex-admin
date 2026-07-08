<script lang="ts">
  import SliderRoot from '@fex/components-svelte/primitive/slider'
  import SliderTrack from '@fex/components-svelte/primitive/slider-track'
  import SliderRange from '@fex/components-svelte/primitive/slider-range'
  import SliderThumb from '@fex/components-svelte/primitive/slider-thumb'
  import Card from '@fex/components-svelte/ui/card'

  let basicValue = $state([32])
  let controlledValue = $state([48])
  let rangeValue = $state([20, 80])
  let multipleValue = $state([15, 45, 75])

  function handleBasicValueChange(next: number[]) {
    basicValue = next
  }

  function handleControlledValueChange(next: number[]) {
    controlledValue = next
  }

  function handleRangeValueChange(next: number[]) {
    rangeValue = next
  }

  function handleMultipleValueChange(next: number[]) {
    multipleValue = next
  }
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Slider</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">Primitive slider with shared core value logic.</p>
      </div>
    </header>
    <div class="space-y-space-xl">
      <Card title="Basic" description="Uncontrolled slider uses defaultValue.">
        <div class="grid gap-space-sm">
          <SliderRoot defaultValue={[32]} aria-label="Volume" onValueChange={handleBasicValueChange}>
            <SliderTrack><SliderRange /></SliderTrack>
            <SliderThumb aria-label="Volume" />
          </SliderRoot>
          <p class="text-sm text-muted-foreground">Current value: {basicValue.join(', ')}</p>
        </div>
      </Card>
      <Card title="Controlled" description="Controlled slider uses value and onValueChange.">
        <div class="grid gap-space-sm">
          <SliderRoot value={controlledValue} onValueChange={handleControlledValueChange} aria-label="Controlled slider">
            <SliderTrack><SliderRange /></SliderTrack>
            <SliderThumb aria-label="Controlled slider" />
          </SliderRoot>
          <p class="text-sm text-muted-foreground">Current value: {controlledValue.join(', ')}</p>
        </div>
      </Card>
      <Card title="Range" description="Use an array with two values for a range slider.">
        <div class="grid gap-space-sm">
          <SliderRoot defaultValue={[20, 80]} minStepsBetweenThumbs={4} aria-label="Range slider" onValueChange={handleRangeValueChange}>
            <SliderTrack><SliderRange /></SliderTrack>
            <SliderThumb index={0} aria-label="Minimum value" />
            <SliderThumb index={1} aria-label="Maximum value" />
          </SliderRoot>
          <p class="text-sm text-muted-foreground">Current value: {rangeValue.join(', ')}</p>
        </div>
      </Card>
      <Card title="Multiple Thumbs" description="Use more than two values to create multiple thumbs.">
        <div class="grid gap-space-sm">
          <SliderRoot defaultValue={[15, 45, 75]} minStepsBetweenThumbs={4} aria-label="Multiple thumbs slider" onValueChange={handleMultipleValueChange}>
            <SliderTrack><SliderRange /></SliderTrack>
            <SliderThumb index={0} aria-label="First value" />
            <SliderThumb index={1} aria-label="Second value" />
            <SliderThumb index={2} aria-label="Third value" />
          </SliderRoot>
          <p class="text-sm text-muted-foreground">Current value: {multipleValue.join(', ')}</p>
        </div>
      </Card>
      <Card title="Orientation" description="Slider supports horizontal and vertical orientation.">
        <div class="flex items-center gap-space-xl">
          <div class="w-full max-w-md">
            <SliderRoot defaultValue={[45]} aria-label="Horizontal slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Horizontal slider" /></SliderRoot>
          </div>
          <SliderRoot orientation="vertical" defaultValue={[60]} aria-label="Vertical slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Vertical slider" /></SliderRoot>
        </div>
      </Card>
      <Card title="Sizes" description="Slider supports sm, default, and lg sizes.">
        <div class="grid gap-space-md">
          <SliderRoot size="sm" defaultValue={[25]} aria-label="Small slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Small slider" /></SliderRoot>
          <SliderRoot defaultValue={[50]} aria-label="Default slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Default slider" /></SliderRoot>
          <SliderRoot size="lg" defaultValue={[75]} aria-label="Large slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Large slider" /></SliderRoot>
        </div>
      </Card>
      <Card title="Disabled" description="Disabled state blocks input.">
        <div class="grid gap-space-sm">
          <SliderRoot disabled defaultValue={[60]} aria-label="Disabled slider"><SliderTrack><SliderRange /></SliderTrack><SliderThumb aria-label="Disabled slider" /></SliderRoot>
          <p class="text-sm text-muted-foreground">Current value: 60</p>
        </div>
      </Card>
    </div>
  </div>
</main>
