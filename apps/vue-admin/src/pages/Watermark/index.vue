<script setup lang="ts">
import BasicDemo from './basic-demo.vue'
import CustomConfigDemo from './custom-config-demo.vue'
import ImageDemo from './image-demo.vue'
import ModalDrawerDemo from './modal-drawer-demo.vue'
import MultilineDemo from './multiline-demo.vue'
import RestoreDemo from './restore-demo.vue'
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">
          Back home
        </RouterLink>
        <h1 class="text-2xl font-semibold text-foreground">Watermark</h1>
        <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
          Add repeated text watermarks over content, including image previews.
        </p>
      </header>
      <div class="grid gap-space-xl">
        <BasicDemo />
        <MultilineDemo />
        <ImageDemo />
        <CustomConfigDemo />
        <ModalDrawerDemo />
        <RestoreDemo />
      </div>
    </div>
  </main>
</template>
