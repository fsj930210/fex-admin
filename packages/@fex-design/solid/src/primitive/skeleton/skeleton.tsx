import { skeletonClassName } from '@fex-design/styles/skeleton'
import { cn } from '@fex/utils'
import { splitProps, type JSX } from 'solid-js'
export function Skeleton(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      {...rest}
      aria-hidden="true"
      data-slot="skeleton"
      class={cn(skeletonClassName, local.class)}
    />
  )
}
