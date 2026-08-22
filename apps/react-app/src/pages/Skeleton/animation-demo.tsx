import { Skeleton } from '@fex-design/react/primitive/skeleton'
import { skeletonAnimationClassName } from '@fex-design/styles/skeleton'
import { Card } from '@fex-design/react/ui/card'
export function AnimationDemo() {
  return (
    <Card
      title="Animation"
      description="Apply the built-in animation class when loading should be emphasized."
    >
      <div className="grid max-w-sm gap-space-md">
        <Skeleton className={`h-5 w-full ${skeletonAnimationClassName}`} />
        <Skeleton className={`h-5 w-11/12 ${skeletonAnimationClassName}`} />
        <Skeleton className={`h-5 w-4/5 ${skeletonAnimationClassName}`} />
        <Skeleton className={`h-5 w-2/3 ${skeletonAnimationClassName}`} />
        <Skeleton className={`h-5 w-1/2 ${skeletonAnimationClassName}`} />
      </div>
    </Card>
  )
}
