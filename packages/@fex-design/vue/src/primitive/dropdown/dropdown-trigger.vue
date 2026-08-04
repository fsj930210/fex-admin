<script setup lang="ts">
import { PopoverTrigger } from '../popover/popover'
</script>

<template>
  <PopoverTrigger v-slot="slot">
    <slot :props="{ ...slot.props, 'aria-haspopup': 'menu' }" :ref="slot.ref" :state="slot.state" />
  </PopoverTrigger>
</template>
