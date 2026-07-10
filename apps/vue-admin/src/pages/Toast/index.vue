<script setup lang="ts">
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  toast,
} from '@fex/components-vue/primitive/toast'
import { CheckIcon } from '@fex/components-vue/icon/check'
import { CloseIcon } from '@fex/components-vue/icon/close'
import { ErrorIcon } from '@fex/components-vue/icon/error'
import { InfoIcon } from '@fex/components-vue/icon/info'
import { LoadingIcon } from '@fex/components-vue/icon/loading'
import { WarningIcon } from '@fex/components-vue/icon/warning'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'
import type { ToastPlacement } from '@fex/components-styles/toast'

const placements: ToastPlacement[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']
const placement = ref<ToastPlacement>('top')
const stack = ref(false)
const manualId = ref<string | null>(null)

function labelPlacement(value: ToastPlacement) {
  return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function choosePlacement(value: ToastPlacement) {
  placement.value = value
  toast.show({
    id: 'toast-position-preview',
    placement: value,
    title: `Position: ${labelPlacement(value)}`,
    duration: 2000,
  })
}

function hasToastIcon(item: { icon?: unknown | null, variant: string }) {
  return item.icon !== null && (item.icon !== undefined || isBuiltInIconVariant(item.variant))
}

function isBuiltInIconVariant(variant: string) {
  return variant === 'success' || variant === 'info' || variant === 'warning' || variant === 'error' || variant === 'loading'
}

function showManyMessages() {
  for (let index = 1; index <= 6; index += 1) {
    toast.info({
      title: `Message ${index}: ${index % 2 === 0 ? 'This is a slightly longer stacked message.' : 'This is a stacked message.'}`,
      duration: 5000,
    })
  }
}

function showManualToast() {
  manualId.value = toast.loading({ title: 'Uploading report', description: 'This toast stays until it is dismissed manually.', duration: -1 })
}

function showRichContent() {
  toast.success({
    title: 'Event has been created',
    description: 'Monday, January 3rd at 6:00pm',
    icon: 'custom',
  })
}

function showAction() {
  toast.show({
    title: 'Event has been created',
    description: 'Sunday, December 03, 2023 at 9:00 AM',
    action: 'Undo',
    duration: 6000,
  })
}

function toggleStack() {
  stack.value = !stack.value
  toast.configure({ max: stack.value ? -1 : 5 })
}
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-6xl space-y-space-lg">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <h1 class="text-2xl font-semibold text-foreground">Toast</h1>
        <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
          Primitive global feedback with quick calls, custom content, position, max count, manual destroy, stable id updates, and stacked display.
        </p>
      </header>

      <Card title="Types" description="Built-in variants only provide default semantics. Content and icon can still be customized.">
        <div class="flex flex-wrap gap-space-sm">
          <Button variant="outline" @click="toast.show('Hello, Fex Design!')">Default</Button>
          <Button variant="outline" @click="toast.success('This is a success message')">Success</Button>
          <Button variant="outline" @click="toast.info('This is an info message')">Info</Button>
          <Button variant="outline" @click="toast.warning('This is a warning message')">Warning</Button>
          <Button variant="outline" @click="toast.error('This is an error message')">Error</Button>
          <Button variant="outline" @click="toast.loading({ title: 'Loading data', duration: 2500 })">Loading</Button>
        </div>
      </Card>

      <Card title="Position" description="The viewport controls placement. Service calls do not need to know where the toast appears.">
        <div class="flex flex-wrap gap-space-sm">
          <Button
            v-for="item in placements"
            :key="item"
            :variant="placement === item ? 'default' : 'outline'"
            @click="choosePlacement(item)"
          >
            {{ labelPlacement(item) }}
          </Button>
        </div>
      </Card>

      <Card title="Custom Content" description="Primitive parts let callers replace icon, add description, and render an action without changing the manager.">
        <div class="flex flex-wrap gap-space-sm">
          <Button variant="outline" @click="showRichContent">Rich content</Button>
          <Button variant="outline" @click="showAction">With action</Button>
        </div>
      </Card>

      <Card title="Update And Destroy" description="A stable id updates one toast. Returned ids can be dismissed manually.">
        <div class="flex flex-wrap gap-space-sm">
          <Button variant="outline" @click="toast.loading({ id: 'save-user', title: 'Saving user', duration: -1 })">Open keyed loading</Button>
          <Button variant="outline" @click="toast.success({ id: 'save-user', title: 'Saved user', description: 'The same id updates the existing toast.', duration: 2500 })">Update keyed toast</Button>
          <Button variant="outline" @click="showManualToast">Manual toast</Button>
          <Button variant="outline" :disabled="!manualId" @click="manualId && toast.dismiss(manualId)">Destroy manual</Button>
          <Button variant="outline" @click="toast.clear()">Destroy all</Button>
        </div>
      </Card>

      <Card title="Multiple And Stacked" description="Max count limits the queue. Stack mode collapses older messages and leaves the latest visible.">
        <div class="flex flex-wrap gap-space-sm">
          <Button variant="outline" @click="showManyMessages">Show many</Button>
          <Button :variant="stack ? 'default' : 'outline'" @click="toggleStack">{{ stack ? 'Stack on' : 'Stack off' }}</Button>
        </div>
      </Card>
    </div>

    <ToastViewport :offset="72" :stack="stack" :stack-threshold="3">
      <template #default="{ items }">
        <ToastRoot v-for="item in items" :key="item.id" :toast="item">
          <ToastIcon v-if="hasToastIcon(item)">
            <CheckIcon v-if="item.icon !== undefined || item.variant === 'success'" class="size-4" />
            <LoadingIcon v-else-if="item.variant === 'loading'" class="size-4 animate-spin" />
            <InfoIcon v-else-if="item.variant === 'info'" class="size-4" />
            <WarningIcon v-else-if="item.variant === 'warning'" class="size-4" />
            <ErrorIcon v-else-if="item.variant === 'error'" class="size-4" />
          </ToastIcon>
          <ToastTitle>{{ item.title }}</ToastTitle>
          <ToastClose :toast="item"><CloseIcon class="size-4" /></ToastClose>
          <ToastDescription v-if="item.description">{{ item.description }}</ToastDescription>
          <ToastAction v-if="item.action"><Button size="sm">{{ item.action }}</Button></ToastAction>
        </ToastRoot>
      </template>
    </ToastViewport>
  </main>
</template>
