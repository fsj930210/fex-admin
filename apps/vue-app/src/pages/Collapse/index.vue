<script setup lang="ts">
import AccordionDemo from './accordion-demo.vue'
import BasicDemo from './basic-demo.vue'
import ControlledDemo from './controlled-demo.vue'
import CustomDemo from './custom-demo.vue'
import NestedDemo from './nested-demo.vue'
import RefDemo from './ref-demo.vue'
import VariantDemo from './variant-demo.vue'
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-sm">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Collapse</h1>
          <p class="max-w-3xl text-sm leading-6 text-muted-foreground">
            Composable disclosure panels with multiple mode, accordion mode, controlled state,
            instance methods and complete custom rendering.
          </p>
        </div>
      </header>
      <div class="space-y-space-xl">
        <BasicDemo />
        <AccordionDemo />
        <ControlledDemo />
        <RefDemo />
        <CustomDemo />
        <VariantDemo />
        <NestedDemo />
      </div>
    </div>
  </main>
</template>
