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
  header?: string
  content?: string
  footer?: string
}

type SectionStyle = {
  header?: CSSProperties
  content?: CSSProperties
  footer?: CSSProperties
}

export interface CardProps {
  title?: unknown
  description?: unknown
  footer?: unknown
  class?: SectionClass
  style?: SectionStyle
}

defineOptions({ inheritAttrs: false })
const props = defineProps<CardProps>()
</script>

<template>
  <PrimitiveCard v-bind="$attrs">
    <CardHeader v-if="title || description" :class="props.class?.header" :style="props.style?.header">
      <CardTitle v-if="title">{{ title }}</CardTitle>
      <CardDescription v-if="description">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent :class="props.class?.content" :style="props.style?.content">
      <slot />
    </CardContent>
    <CardFooter v-if="footer" :class="props.class?.footer" :style="props.style?.footer">
      {{ footer }}
    </CardFooter>
  </PrimitiveCard>
</template>
