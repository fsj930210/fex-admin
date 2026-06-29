import {
  buttonClassName,
  buttonIconClassName,
  buttonSpinnerClassName,
  type ButtonStyleProps,
} from '@fex/components-styles/button'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { LoadingIcon } from '../../icon/loading'
import { Button as PrimitiveButton } from '../../primitive/button/button'

export interface ButtonProps
  extends ParentProps<Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>>,
    ButtonStyleProps {
  icon?: JSX.Element
  iconPlacement?: 'start' | 'end'
  loading?: boolean
  disabled?: boolean
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'size',
    'effect',
    'icon',
    'iconPlacement',
    'loading',
    'disabled',
    'children',
    'type',
  ])

  const variant = () => local.variant ?? 'default'
  const size = () => local.size ?? 'default'
  const iconPlacement = () => local.iconPlacement ?? 'start'
  const isLoading = () => local.loading === true
  const isDisabled = () => local.disabled === true || isLoading()
  const iconNode = () => (isLoading() ? <LoadingIcon class={buttonSpinnerClassName} /> : local.icon)

  return (
    <PrimitiveButton
      {...rest}
      type={local.type ?? 'button'}
      class={cn(buttonClassName({ variant: variant(), size: size(), effect: local.effect }), local.class)}
      data-slot="button"
      data-variant={variant()}
      data-size={size()}
      data-effect={local.effect}
      data-loading={isLoading() ? 'true' : undefined}
      disabled={isDisabled()}
    >
      <Show when={iconPlacement() === 'start' && iconNode()}>
        <span class={buttonIconClassName({ placement: 'start', effect: local.effect })} data-icon="inline-start">
          {iconNode()}
        </span>
      </Show>
      {local.children}
      <Show when={iconPlacement() === 'end' && iconNode()}>
        <span class={buttonIconClassName({ placement: 'end', effect: local.effect })} data-icon="inline-end">
          {iconNode()}
        </span>
      </Show>
    </PrimitiveButton>
  )
}

export default Button
