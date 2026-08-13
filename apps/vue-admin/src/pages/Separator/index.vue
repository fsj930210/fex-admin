<script setup lang="ts">
import { Separator } from '@fex-design/vue/primitive/separator'
import Card from '@fex-design/vue/ui/card'
const items = [
  ['Workspace', 'Fex Admin'],
  ['Plan', 'Team'],
  ['Region', 'Asia Pacific'],
]
</script>
<template>
  <main class="grid gap-space-xl p-page-padding">
    <Card title="Basic" description="Separate related sections with a semantic horizontal rule."
      ><div class="grid max-w-xl gap-space-md">
        <div>
          <div class="font-medium">Fex Design</div>
          <div class="text-sm text-muted-foreground">
            Composable components for five frameworks.
          </div>
        </div>
        <Separator :decorative="false" />
        <div class="text-sm">React · Vue · Solid · Svelte · Angular</div>
      </div></Card
    ><Card title="Vertical" description="Use vertical separators between compact inline items."
      ><div class="flex h-5 items-center gap-space-md">
        <span>Blog</span><Separator orientation="vertical" /><span>Docs</span
        ><Separator orientation="vertical" /><span>Source</span>
      </div></Card
    ><Card title="Menu" description="Divide groups without splitting related menu items."
      ><div class="grid max-w-sm gap-space-sm">
        <div>
          <div class="font-medium">Settings</div>
          <div class="text-sm text-muted-foreground">Manage preferences</div>
        </div>
        <div>
          <div class="font-medium">Account</div>
          <div class="text-sm text-muted-foreground">Profile and security</div>
        </div>
        <Separator />
        <div>
          <div class="font-medium">Sign out</div>
          <div class="text-sm text-muted-foreground">End the current session</div>
        </div>
      </div></Card
    ><Card title="List" description="Place separators between rows, not after the final item."
      ><div class="grid max-w-lg">
        <div v-for="([label, value], index) in items" :key="label">
          <div class="flex justify-between py-space-md">
            <span>{{ label }}</span
            ><span class="text-muted-foreground">{{ value }}</span>
          </div>
          <Separator v-if="index < items.length - 1" />
        </div></div></Card
    ><Card
      title="With Text"
      description="Compose a label between two separators and control its placement."
      ><div class="grid max-w-xl gap-space-xl">
        <div
          v-for="placement in ['Start', 'Center', 'End']"
          :key="placement"
          class="flex items-center gap-space-md"
        >
          <Separator :class="placement === 'Start' ? 'w-12' : 'flex-1'" /><span
            class="shrink-0 text-sm text-muted-foreground"
            >{{ placement }}</span
          ><Separator :class="placement === 'End' ? 'w-12' : 'flex-1'" />
        </div></div></Card
    ><Card title="Variants" description="Use class composition for solid, dashed and dotted rules."
      ><div class="grid max-w-xl gap-space-lg">
        <div class="grid gap-space-sm"><span class="text-sm">Solid</span><Separator /></div>
        <div class="grid gap-space-sm">
          <span class="text-sm">Dashed</span
          ><Separator class="h-0 border-t border-dashed bg-transparent" />
        </div>
        <div class="grid gap-space-sm">
          <span class="text-sm">Dotted</span
          ><Separator class="h-0 border-t border-dotted bg-transparent" />
        </div></div
    ></Card>
  </main>
</template>
