import { Skeleton } from '@fex-design/solid/primitive/skeleton'
import { skeletonAnimationClassName } from '@fex-design/styles/skeleton'
import { Card } from '@fex-design/solid/ui/card'
export const BasicDemo = () => (
  <Card title="Basic" description="A single placeholder with a custom size.">
    <Skeleton class="h-5 max-w-sm" />
  </Card>
)
export const AvatarDemo = () => (
  <Card title="Avatar" description="Compose circular and text placeholders.">
    <div class="flex max-w-md items-center gap-space-lg">
      <Skeleton class="size-12 rounded-full" />
      <div class="grid flex-1 gap-space-sm">
        <Skeleton class="h-4 w-2/5" />
        <Skeleton class="h-4 w-4/5" />
      </div>
    </div>
  </Card>
)
export const CardDemo = () => (
  <Card title="Card" description="Preserve a media card layout while loading.">
    <div class="grid max-w-sm gap-space-md">
      <Skeleton class="aspect-video w-full" />
      <Skeleton class="h-5 w-3/5" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-4/5" />
    </div>
  </Card>
)
export const TextDemo = () => (
  <Card title="Text" description="Use varied widths to suggest paragraph rhythm.">
    <div class="grid max-w-xl gap-space-sm">
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-2/3" />
    </div>
  </Card>
)
export const FormDemo = () => (
  <Card title="Form" description="Match labels, controls and actions.">
    <div class="grid max-w-md gap-space-lg">
      <div class="grid gap-space-sm">
        <Skeleton class="h-4 w-24" />
        <Skeleton class="h-9 w-full" />
      </div>
      <div class="grid gap-space-sm">
        <Skeleton class="h-4 w-32" />
        <Skeleton class="h-9 w-full" />
      </div>
      <Skeleton class="h-9 w-24" />
    </div>
  </Card>
)
export const TableDemo = () => (
  <Card title="Table" description="Repeat stable row shapes for data loading.">
    <div class="grid max-w-2xl gap-space-md">
      <div class="grid grid-cols-3 gap-space-lg border-b pb-space-md">
        <Skeleton class="h-4 w-24" />
        <Skeleton class="h-4 w-20" />
        <Skeleton class="h-4 w-16" />
      </div>
      {['w-2/5', 'w-3/5', 'w-1/2'].map((width) => (
        <div class="grid grid-cols-3 gap-space-lg">
          <div class="flex items-center gap-space-sm">
            <Skeleton class="size-8 rounded-full" />
            <Skeleton class={`h-4 ${width}`} />
          </div>
          <Skeleton class="h-4 w-2/3" />
          <Skeleton class="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </Card>
)
export const AnimationDemo = () => (
  <Card
    title="Animation"
    description="Apply the built-in animation class when loading should be emphasized."
  >
    <div class="grid max-w-sm gap-space-md">
      <Skeleton class={`h-5 w-full ${skeletonAnimationClassName}`} />
      <Skeleton class={`h-5 w-11/12 ${skeletonAnimationClassName}`} />
      <Skeleton class={`h-5 w-4/5 ${skeletonAnimationClassName}`} />
      <Skeleton class={`h-5 w-2/3 ${skeletonAnimationClassName}`} />
      <Skeleton class={`h-5 w-1/2 ${skeletonAnimationClassName}`} />
    </div>
  </Card>
)
