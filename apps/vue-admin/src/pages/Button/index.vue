<script setup lang="ts">
import PrimitiveButton from "@fex/components-vue/primitive/button";
import Button from "@fex/components-vue/ui/button";

const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
  "dashed",
] as const;
const sizes = ["xs", "sm", "default", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] as const;
const effects = [
  "expand-icon",
  "ring-hover",
  "shine",
  "shine-hover",
  "gooey-left",
  "gooey-right",
  "gradient-slide-show",
] as const;
</script>

<template>
  <main class="p-6">
    <header class="space-y-2">
      <RouterLink to="/">返回首页</RouterLink>
      <h1 class="text-2xl font-semibold">Button</h1>
    </header>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Primitive</h2>
      <div class="flex flex-wrap gap-3">
        <PrimitiveButton>Primitive button</PrimitiveButton>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Ui</h2>
      <div class="flex flex-wrap gap-3">
        <Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant }}</Button>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Variants</h2>
      <div class="flex flex-wrap gap-3">
        <Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant }}</Button>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Sizes</h2>
      <div class="flex flex-wrap items-center gap-3">
        <Button
          v-for="size in sizes"
          :key="size"
          :size="size"
          :aria-label="size.startsWith('icon') ? size : undefined"
        >
          <svg
            v-if="size.startsWith('icon')"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          <template v-else>{{ size }}</template>
        </Button>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Loading</h2>
      <div class="flex flex-wrap gap-3">
        <Button loading>Loading start</Button>
        <Button loading icon-placement="end">Loading end</Button>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Icon</h2>
      <div class="flex flex-wrap gap-3">
        <Button>
          <template #icon
            ><svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" /></svg
          ></template>
          Icon start
        </Button>
        <Button icon-placement="end">
          <template #icon
            ><svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" /></svg
          ></template>
          Icon end
        </Button>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Effects</h2>
      <div class="flex flex-wrap gap-3">
        <Button v-for="effect in effects" :key="effect" :effect="effect" icon-placement="end">
          <template v-if="effect === 'expand-icon'" #icon>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </template>
          {{ effect }}
        </Button>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Mixed Usage</h2>
      <div class="flex flex-wrap gap-3">
        <Button effect="expand-icon" icon-placement="end">
          <template #icon
            ><svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" /></svg
          ></template>
          Icon right
        </Button>
        <Button effect="expand-icon">
          <template #icon
            ><svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" /></svg
          ></template>
          Icon left
        </Button>
        <Button variant="secondary" effect="gooey-left">Secondary gooey left</Button>
        <Button variant="destructive" effect="gooey-right">Destructive gooey right</Button>
        <Button variant="destructive" effect="shine">Destructive shine</Button>
        <Button variant="outline" effect="ring-hover">Outline ring hover</Button>
        <Button variant="link" effect="hover-underline">Link hover underline</Button>
        <Button variant="link" effect="underline">Link underline</Button>
        <Button variant="outline" effect="hover-underline">Outline hover underline</Button>
        <Button variant="outline" effect="underline">Outline underline</Button>
        <Button variant="destructive" loading>Destructive loading</Button>
        <Button loading icon-placement="end">Loading with icon</Button>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-medium">Disabled</h2>
      <div class="flex flex-wrap gap-3">
        <Button disabled>Disabled</Button>
        <Button disabled variant="outline">Disabled outline</Button>
      </div>
    </section>
  </main>
</template>
