<script setup lang="ts">
import type { CSSProperties } from 'vue'
import {
  Card as PrimitiveCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../primitive/card/card'

type SectionClass = {
  root?: string
  header?: string
  title?: string
  description?: string
  content?: string
  footer?: string
}

type SectionStyle = {
  root?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
  content?: CSSProperties
  footer?: CSSProperties
}

type CardSize = 'sm' | 'md' | 'lg'

export interface CardProps {
  title?: unknown
  description?: unknown
  footer?: unknown
  size?: CardSize
  class?: SectionClass
  style?: SectionStyle
}

defineOptions({ inheritAttrs: false })
const props = defineProps<CardProps>()
</script>

<template>
  <PrimitiveCard
    v-bind="$attrs"
    :data-size="size ?? 'md'"
    :class="props.class?.root"
    :style="props.style?.root"
  >
    <CardHeader v-if="title || description" :class="props.class?.header" :style="props.style?.header">
      <CardTitle v-if="title" :class="props.class?.title" :style="props.style?.title">{{ title }}</CardTitle>
      <CardDescription v-if="description" :class="props.class?.description" :style="props.style?.description">
        {{ description }}
      </CardDescription>
    </CardHeader>
    <CardContent :class="props.class?.content" :style="props.style?.content">
      <slot />
    </CardContent>
    <CardFooter v-if="$slots.footer || footer" :class="props.class?.footer" :style="props.style?.footer">
      <slot name="footer">{{ footer }}</slot>
    </CardFooter>
  </PrimitiveCard>
</template>
