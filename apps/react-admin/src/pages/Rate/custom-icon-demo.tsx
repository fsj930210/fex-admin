import { Rate, type RateItemRenderState } from '@fex/components-react/primitive/rate'
import { Card } from '@fex/components-react/ui/card'
import type { SVGProps } from 'react'

function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  )
}

function renderHeart({ layer }: RateItemRenderState) {
  return (
    <HeartIcon
      className={layer === 'filled'
        ? 'fill-danger text-danger'
        : 'fill-transparent text-muted-foreground'}
    />
  )
}

export function CustomIconDemo() {
  return (
    <Card title="Custom icon" description="The render function supplies empty and filled layers, so any icon can define both appearances.">
      <Rate defaultValue={3.6} step={0.1} size="lg" aria-label="Heart rating">
        {renderHeart}
      </Rate>
    </Card>
  )
}
