import { AspectRatio } from '@fex-design/react/primitive/aspect-ratio'
import { Card } from '@fex-design/react/ui/card'

interface RatioDemoProps {
  title: string
  description: string
  ratio: number
  className: string
}
export function RatioDemo({ title, description, ratio, className }: RatioDemoProps) {
  return (
    <Card title={title} description={description}>
      <AspectRatio ratio={ratio} className={`rounded-md ${className}`}>
        <img
          src="/aspect-ratio-demo.svg"
          alt="Mountain landscape"
          className="size-full object-cover"
        />
      </AspectRatio>
    </Card>
  )
}
