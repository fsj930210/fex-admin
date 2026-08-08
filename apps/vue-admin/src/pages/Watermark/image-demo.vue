<script setup lang="ts">
import { Watermark } from '@fex-design/vue/primitive/watermark'
import Card from '@fex-design/vue/ui/card'

const image =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22320%22 viewBox=%220 0 800 320%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22%3E%3Cstop offset=%220%22 stop-color=%22%23dbeafe%22/%3E%3Cstop offset=%221%22 stop-color=%22%23f8fafc%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22800%22 height=%22320%22 fill=%22url(%23g)%22/%3E%3Ccircle cx=%22640%22 cy=%2280%22 r=%2288%22 fill=%22%2393c5fd%22 opacity=%22.55%22/%3E%3Crect x=%2280%22 y=%2272%22 width=%22360%22 height=%22176%22 rx=%2224%22 fill=%22white%22 opacity=%22.86%22/%3E%3Cpath d=%22M126 208h268M126 162h218M126 116h150%22 stroke=%22%23334155%22 stroke-width=%2214%22 stroke-linecap=%22round%22 opacity=%22.72%22/%3E%3C/svg%3E'
</script>

<template>
  <Card title="Image Content" description="Wrap an image to add a text watermark over it.">
    <Watermark content="FEX Admin" class="rounded-md border border-border bg-background">
      <img class="block aspect-[5/2] w-full object-cover" :src="image" alt="Document preview" />
    </Watermark>
  </Card>
</template>
