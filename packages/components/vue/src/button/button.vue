<script setup lang="ts">
import {
  buttonClassName,
  buttonIconClassName,
  buttonSpinnerClassName,
} from '@fex/components-styles/button'
import { computed, useAttrs } from 'vue'

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link' | 'dashed'
type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'
type ButtonEffect =
  | 'expand-icon'
  | 'ring-hover'
  | 'shine'
  | 'shine-hover'
  | 'gooey-left'
  | 'gooey-right'
  | 'underline'
  | 'hover-underline'
  | 'gradient-slide-show'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  effect?: ButtonEffect
  iconPlacement?: 'start' | 'end'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'default',
  iconPlacement: 'start',
  loading: false,
  disabled: false,
  type: 'button',
})

const attrs = useAttrs()
const isDisabled = computed(() => props.disabled || props.loading)
const className = computed(() =>
  buttonClassName({
    variant: props.variant,
    size: props.size,
    effect: props.effect,
    className: attrs.class as string | undefined,
  }),
)
</script>

<template>
  <button
    v-bind="{ ...attrs, class: undefined }"
    :class="className"
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :data-effect="effect"
    :data-loading="loading ? 'true' : undefined"
    :disabled="isDisabled"
    :type="type"
  >
    <span
      v-if="iconPlacement === 'start' && (loading || $slots.icon)"
      :class="buttonIconClassName({ placement: 'start', effect })"
      data-icon="inline-start"
    >
      <svg
        v-if="loading"
        :class="buttonSpinnerClassName"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        :stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <slot v-else name="icon" />
    </span>
    <slot />
    <span
      v-if="iconPlacement === 'end' && (loading || $slots.icon)"
      :class="buttonIconClassName({ placement: 'end', effect })"
      data-icon="inline-end"
    >
      <svg
        v-if="loading"
        :class="buttonSpinnerClassName"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        :stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <slot v-else name="icon" />
    </span>
  </button>
</template>
