<script setup lang="ts">
import Button from '@fex-design/vue/ui/button'
import { useDatePickerContext } from '@fex-design/vue/primitive/date-picker'

const picker = useDatePickerContext('CustomPanel')
</script>

<template>
  <div class="grid gap-space-sm p-space-md">
    <p class="text-sm text-muted-foreground">
      这是完全自定义面板，仍可访问 DatePicker primitive 暴露的关闭方法。
    </p>
    <Button size="sm" @click="picker.close()">关闭面板</Button>
  </div>
</template>
