<script setup lang="ts">
import { createDialogController, type DialogOptions } from '@fex/components-core/dialog/create-dialog-controller'
import { shallowEqualObject } from '@fex/utils'
import { computed, onBeforeUnmount, provide, ref, shallowRef } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { dialogKey, type DialogRootProps } from './context'

let nextDialogId = 1
const props = withDefaults(defineProps<DialogRootProps>(), { closeDelay: 140, closeOnOverlayPointer: true, defaultOpen: false, dismiss: () => ({ escapeKey: true, overlayPointer: true }), modal: true })
const emit = defineEmits<{ openChange: [open: boolean, info: Parameters<NonNullable<DialogOptions['onOpenChange']>>[1]] }>()
const controlled = computed(() => props.open !== undefined)
const localOpen = ref(props.defaultOpen)
const triggerElement = shallowRef<HTMLButtonElement | null>(null)
const dialogId = nextDialogId++
function createOptions(): DialogOptions { return { ...props, open: controlled.value ? Boolean(props.open) : localOpen.value, onOpenChange(nextOpen, info) { if (!controlled.value) localOpen.value = nextOpen; emit('openChange', nextOpen, info) } } }
let latestOptions = createOptions()
const dialog = createDialogController(latestOptions)
const snapshot = useCoreStore(dialog)
function syncOptions() { const next = createOptions(); if (!shallowEqualObject(latestOptions, next)) { latestOptions = next; dialog.setOptions(next) }; return '' }
provide(dialogKey, { contentId: `fex-dialog-content-${dialogId}`, descriptionId: `fex-dialog-description-${dialogId}`, dialog, snapshot, titleId: `fex-dialog-title-${dialogId}`, triggerElement })
onBeforeUnmount(() => dialog.destroy())
</script>
<template>{{ syncOptions() }}<slot /></template>
