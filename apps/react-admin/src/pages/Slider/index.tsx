import { SliderRange, SliderRoot, SliderThumb, SliderTrack, type SliderRootProps } from '@fex/components-react/primitive/slider'
import { Card } from '@fex/components-react/ui/card'
import { useState } from 'react'
import { Link } from 'react-router'

interface DemoSliderProps extends SliderRootProps {
  showValue?: boolean
}

function DemoSlider({ showValue = false, value, defaultValue, onValueChange, ...props }: DemoSliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? [props.min ?? 0])
  const currentValue = value ?? internalValue

  return (
    <div className="grid gap-space-sm">
      <SliderRoot
        {...props}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(nextValue) => {
          if (value === undefined) setInternalValue(nextValue)
          onValueChange?.(nextValue)
        }}
      >
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        {currentValue.map((_, index) => (
          <SliderThumb key={index} index={index} aria-label={props['aria-label']} />
        ))}
      </SliderRoot>
      {showValue ? <p className="text-sm text-muted-foreground">Current value: {currentValue.join(', ')}</p> : null}
    </div>
  )
}

export function SliderPage() {
  const [value, setValue] = useState([48])
  const [rangeValue, setRangeValue] = useState([20, 80])
  const [multipleValue, setMultipleValue] = useState([15, 45, 75])

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Slider</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">Primitive slider with shared core value logic.</p>
          </div>
        </header>
        <div className="space-y-space-xl">
          <Card title="Basic" description="Uncontrolled slider uses defaultValue.">
            <DemoSlider defaultValue={[32]} aria-label="Volume" showValue />
          </Card>
          <Card title="Controlled" description="Controlled slider uses value and onValueChange.">
            <DemoSlider value={value} onValueChange={setValue} showValue aria-label="Controlled slider" />
          </Card>
          <Card title="Range" description="Use an array with two values for a range slider.">
            <div className="grid gap-space-sm">
              <SliderRoot defaultValue={[20, 80]} minStepsBetweenThumbs={4} aria-label="Range slider" onValueChange={setRangeValue}>
                <SliderTrack>
                  <SliderRange />
                </SliderTrack>
                <SliderThumb index={0} aria-label="Minimum value" />
                <SliderThumb index={1} aria-label="Maximum value" />
              </SliderRoot>
              <p className="text-sm text-muted-foreground">Current value: {rangeValue.join(', ')}</p>
            </div>
          </Card>
          <Card title="Multiple Thumbs" description="Use more than two values to create multiple thumbs.">
            <div className="grid gap-space-sm">
              <SliderRoot defaultValue={[15, 45, 75]} minStepsBetweenThumbs={4} aria-label="Multiple thumbs slider" onValueChange={setMultipleValue}>
                <SliderTrack>
                  <SliderRange />
                </SliderTrack>
                <SliderThumb index={0} aria-label="First value" />
                <SliderThumb index={1} aria-label="Second value" />
                <SliderThumb index={2} aria-label="Third value" />
              </SliderRoot>
              <p className="text-sm text-muted-foreground">Current value: {multipleValue.join(', ')}</p>
            </div>
          </Card>
          <Card title="Orientation" description="Slider supports horizontal and vertical orientation.">
            <div className="flex items-center gap-space-xl">
              <div className="w-full max-w-md">
                <DemoSlider defaultValue={[45]} aria-label="Horizontal slider" />
              </div>
              <DemoSlider orientation="vertical" defaultValue={[60]} aria-label="Vertical slider" />
            </div>
          </Card>
          <Card title="Sizes" description="Slider supports sm, default, and lg sizes.">
            <div className="grid gap-space-md">
              <DemoSlider size="sm" defaultValue={[25]} aria-label="Small slider" />
              <DemoSlider defaultValue={[50]} aria-label="Default slider" />
              <DemoSlider size="lg" defaultValue={[75]} aria-label="Large slider" />
            </div>
          </Card>
          <Card title="Disabled" description="Disabled state blocks input.">
            <DemoSlider disabled defaultValue={[60]} showValue aria-label="Disabled slider" />
          </Card>
        </div>
      </div>
    </main>
  )
}
