import { Rate, type RateItemRenderState } from '@fex/components-solid/primitive/rate'
import Card from '@fex/components-solid/ui/card'
import type { JSX } from 'solid-js'
function HeartIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  )
}
function renderHeart(state: RateItemRenderState) {
  return (
    <HeartIcon
      class={
        state.layer === 'filled'
          ? 'fill-danger text-danger'
          : 'fill-transparent text-muted-foreground'
      }
    />
  )
}
export function CustomIconDemo() {
  return (
    <Card
      title="Custom icon"
      description="The render function supplies empty and filled layers, so any icon can define both appearances."
    >
      <Rate defaultValue={3.6} step={0.1} size="lg" aria-label="Heart rating">
        {renderHeart}
      </Rate>
    </Card>
  )
}
