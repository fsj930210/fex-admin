import { separatorClassName } from '@fex-design/styles/separator'
import { cn } from '@fex/utils'
import { splitProps, type JSX } from 'solid-js'
export function Separator(
  props: JSX.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  },
) {
  const [local, rest] = splitProps(props, ['class', 'orientation', 'decorative'])
  const orientation = () => local.orientation ?? 'horizontal'
  return (
    <div
      {...rest}
      role={(local.decorative ?? true) ? 'none' : 'separator'}
      aria-orientation={(local.decorative ?? true) ? undefined : orientation()}
      data-slot="separator"
      data-orientation={orientation()}
      class={cn(separatorClassName, local.class)}
    />
  )
}
