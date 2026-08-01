<script setup lang="ts">
import { Rate } from '@fex/components-vue/primitive/rate'
import Card from '@fex/components-vue/ui/card'
import HeartIcon from './heart-icon.vue'
</script>
<template>
  <Card
    title="Custom icon"
    description="The render function supplies empty and filled layers, so any icon can define both appearances."
    ><Rate :default-value="3.6" :step="0.1" size="lg" aria-label="Heart rating"
      ><template #default="state"
        ><HeartIcon
          :class="
            state.layer === 'filled'
              ? 'fill-danger text-danger'
              : 'fill-transparent text-muted-foreground'
          " /></template></Rate
  ></Card>
</template>
