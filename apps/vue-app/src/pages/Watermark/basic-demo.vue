<script setup lang="ts">
import { Watermark } from '@fex-design/vue/primitive/watermark'
import Card from '@fex-design/vue/ui/card'
</script>

<template>
  <Card title="Basic" description="Text content is rendered as a repeated canvas watermark.">
    <Watermark content="FEX Admin" class="h-56 rounded-md border border-border bg-background">
      <div class="grid h-full place-items-center p-space-xl text-center text-sm text-muted-foreground">
        Watermark protects this content area without blocking pointer events.
      </div>
    </Watermark>
  </Card>
</template>
