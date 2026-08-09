<script setup lang="ts">
import { InputNumber } from '@fex-design/vue/primitive/input-number'
import Card from '@fex-design/vue/ui/card'
</script>
<template>
  <Card
    title="Suffix and clear"
    description="Suffix replaces the full action area while clear remains independent."
    ><div class="grid gap-space-md md:grid-cols-3">
      <InputNumber clearable :default-value="20" aria-label="Clearable number" /><InputNumber
        :default-value="20"
        aria-label="Weight"
        ><template #suffix>kg</template></InputNumber
      ><InputNumber clearable :default-value="20" aria-label="Percentage"
        ><template #suffix>%</template></InputNumber
      >
    </div></Card
  >
</template>
