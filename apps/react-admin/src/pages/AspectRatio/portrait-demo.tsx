import { RatioDemo } from './ratio-demo'
export function PortraitDemo() {
  return (
    <RatioDemo
      title="Portrait"
      description="A 9:16 media container."
      ratio={9 / 16}
      className="max-w-48"
    />
  )
}
