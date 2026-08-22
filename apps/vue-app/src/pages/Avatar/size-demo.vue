<script setup lang="ts">
import { Avatar, AvatarFallback } from '@fex-design/vue/primitive/avatar'
import Card from '@fex-design/vue/ui/card'
</script>
<template>
  <Card title="Size" description="Avatar provides small, medium and large sizes.">
    <div class="flex items-center gap-space-lg">
      <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
      <Avatar size="md"><AvatarFallback>MD</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
    </div>
  </Card>
</template>
