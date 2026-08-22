<script setup lang="ts">
import BasicDemo from './basic-demo.vue'
import ConstraintsDemo from './constraints-demo.vue'
import CustomLogicDemo from './custom-logic-demo.vue'
import FormatterDemo from './formatter-demo.vue'
import KeyboardDemo from './keyboard-demo.vue'
import MinMaxDemo from './min-max-demo.vue'
import StatesDemo from './states-demo.vue'
import SuffixDemo from './suffix-demo.vue'
import ValidationDemo from './validation-demo.vue'
</script>
<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/"
          >Back home</RouterLink
        >
        <h1 class="text-2xl font-semibold text-foreground">InputNumber primitive</h1>
        <p class="max-w-2xl text-sm text-muted-foreground">
          Numeric behavior composed over Input primitives.
        </p>
      </header>
      <div class="grid gap-space-xl">
        <BasicDemo /><ConstraintsDemo /><MinMaxDemo /><FormatterDemo /><SuffixDemo /><KeyboardDemo /><StatesDemo /><ValidationDemo /><CustomLogicDemo />
      </div>
    </div>
  </main>
</template>
