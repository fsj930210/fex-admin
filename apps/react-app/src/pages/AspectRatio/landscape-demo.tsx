import { RatioDemo } from './ratio-demo'
export function LandscapeDemo() {
  return (
    <RatioDemo
      title="Landscape"
      description="A 16:9 media container."
      ratio={16 / 9}
      className="max-w-2xl"
    />
  )
}
