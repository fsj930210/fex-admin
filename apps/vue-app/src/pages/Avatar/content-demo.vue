<script setup lang="ts">
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@fex-design/vue/primitive/avatar'
import Card from '@fex-design/vue/ui/card'
</script>
<template>
  <Card title="Content" description="Use an image with fallback content and an optional badge.">
    <div class="flex items-center gap-space-lg">
      <Avatar size="lg"
        ><AvatarImage src="/avatar-demo.svg" alt="Example avatar" /><AvatarFallback
          >IM</AvatarFallback
        ><AvatarBadge aria-label="Online"
      /></Avatar>
      <Avatar size="lg"
        ><AvatarImage src="/missing-avatar.png" alt="Missing avatar" /><AvatarFallback
          >FX</AvatarFallback
        ></Avatar
      >
    </div>
  </Card>
</template>
