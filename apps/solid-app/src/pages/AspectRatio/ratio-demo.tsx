import { AspectRatio } from '@fex-design/solid/primitive/aspect-ratio'
import { Card } from '@fex-design/solid/ui/card'
export function RatioDemo(props: {
  title: string
  description: string
  ratio: number
  class: string
}) {
  return (
    <Card title={props.title} description={props.description}>
      <AspectRatio ratio={props.ratio} class={`rounded-md ${props.class}`}>
        <img src="/aspect-ratio-demo.svg" alt="Mountain landscape" class="size-full object-cover" />
      </AspectRatio>
    </Card>
  )
}
