<script setup lang="ts">
import { ListboxGroup, ListboxGroupLabel, ListboxItem, ListboxRoot } from '@fex/components-vue/ui/listbox'
import { ListboxItem as PrimitiveListboxItem, ListboxRoot as PrimitiveListboxRoot } from '@fex/components-vue/primitive/listbox'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'

const tricks = [
  { value: 'kickflip', title: 'Kickflip', description: 'Flip the board 360 degrees along its long axis' },
  { value: 'heelflip', title: 'Heelflip', description: 'Flip the board in the opposite direction of a kickflip' },
  { value: 'tre-flip', title: 'Tre Flip', description: 'A 360 flip with a backside shove-it' },
  { value: 'fs-540', title: 'FS 540', description: 'Flip the board 540 degrees along its long axis' },
  { value: 'mc-twist', title: '360 Varial McTwist', description: 'A 540 inverted aerial with board rotation' },
  { value: 'the-900', title: 'The 900', description: 'Legendary 900 aerial rotation pioneered by Tony Hawk' },
] as const

const selectedTrick = ref<string | number | undefined>('kickflip')
const selectedTricks = ref<(string | number)[]>(['kickflip', 'heelflip'])
function updateSelectedTrick(value: string | number | undefined) { selectedTrick.value = value }
function updateSelectedTricks(values: (string | number)[]) { selectedTricks.value = values }
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Listbox</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            Selection list primitives with single, multiple, vertical, horizontal and grouped layouts.
          </p>
        </div>
      </header>

      <div class="space-y-space-xl">
        <Card title="Primitive" description="Headless root and item parts without default item layout.">
          <PrimitiveListboxRoot :items="tricks" default-value="kickflip" class="flex max-w-xl flex-col gap-2">
            <PrimitiveListboxItem
              v-for="trick in tricks.slice(0, 3)"
              :key="trick.value"
              :value="trick.value"
              class="rounded-md border border-border bg-background p-3 text-sm data-[selected=true]:border-primary/40 data-[selected=true]:bg-primary/5"
            >
              {{ trick.title }}
            </PrimitiveListboxItem>
          </PrimitiveListboxRoot>
        </Card>

        <Card title="Single" description="Controlled single selection uses onChange.">
          <ListboxRoot
            :items="tricks"
            :value="selectedTrick"
            class="max-w-xl"
            @change="updateSelectedTrick"
          >
            <ListboxItem
              v-for="trick in tricks.slice(0, 4)"
              :key="trick.value"
              :value="trick.value"
              :title="trick.title"
              :description="trick.description"
            />
          </ListboxRoot>
        </Card>

        <Card title="Multiple" description="Multiple selection returns an array.">
          <ListboxRoot
            multiple
            :items="tricks"
            :value="selectedTricks"
            class="max-w-xl"
            @change="updateSelectedTricks"
          >
            <ListboxItem
              v-for="trick in tricks.slice(0, 4)"
              :key="trick.value"
              :value="trick.value"
              :title="trick.title"
              :description="trick.description"
            />
          </ListboxRoot>
        </Card>

        <Card title="Horizontal" description="Horizontal orientation lays items out in rows.">
          <ListboxRoot :items="tricks" default-value="tre-flip" orientation="horizontal">
            <ListboxItem
              v-for="trick in tricks.slice(0, 4)"
              :key="trick.value"
              class="w-56"
              :value="trick.value"
              :title="trick.title"
              :description="trick.description"
            />
          </ListboxRoot>
        </Card>

        <Card title="Grouped Items" description="Group related options with the same controller.">
          <ListboxRoot multiple :items="tricks" :default-value="['kickflip', 'heelflip']" class="mx-auto max-w-xl">
            <ListboxGroup>
              <ListboxGroupLabel>Basic Tricks</ListboxGroupLabel>
              <ListboxItem
                v-for="trick in tricks.slice(0, 2)"
                :key="trick.value"
                :value="trick.value"
                :title="trick.title"
                :description="trick.description"
              />
            </ListboxGroup>
            <ListboxGroup>
              <ListboxGroupLabel>Advanced Tricks</ListboxGroupLabel>
              <ListboxItem
                v-for="trick in tricks.slice(4)"
                :key="trick.value"
                :value="trick.value"
                :title="trick.title"
                :description="trick.description"
              />
            </ListboxGroup>
          </ListboxRoot>
        </Card>

        <Card title="Disabled" description="Disabled values can be displayed as selected but cannot be changed by user actions.">
          <ListboxRoot :items="tricks" default-value="fs-540" class="max-w-xl">
            <ListboxItem
              v-for="trick in tricks.slice(2, 5)"
              :key="trick.value"
              :value="trick.value"
              :disabled="trick.value === 'fs-540'"
              :title="trick.title"
              :description="trick.description"
            />
          </ListboxRoot>
        </Card>
      </div>
    </div>
  </main>
</template>
