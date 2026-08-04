<script setup lang="ts" generic="TItem extends Record<string, unknown>">
import { createTransferController } from '@fex-design/core/transfer/create-transfer-controller'
import type {
  TransferCheckedKeys,
  TransferControllerOptions,
  TransferFieldNames,
  TransferKey,
  TransferSide,
} from '@fex-design/core/transfer/types'
import {
  readTransferDisabled,
  readTransferKey,
  resolveTransferFieldNames,
} from '@fex-design/core/transfer/utils'
import { buttonClassName } from '@fex-design/styles/button'
import {
  checkboxCheckIconClassName,
  checkboxClassName,
  checkboxIndicatorClassName,
  checkboxMinusIconClassName,
} from '@fex-design/styles/checkbox'
import { listboxItemClassName, listboxRootClassName } from '@fex-design/styles/listbox'
import {
  transferActionsClassName,
  transferLayoutClassName,
  transferMessageClassName,
  transferPanelBodyClassName,
  transferPanelFooterClassName,
  transferPanelHeaderClassName,
  transferRootClassName,
  transferSourcePanelClassName,
  transferTargetPanelClassName,
  transferWarningMessageClassName,
} from '@fex-design/styles/transfer'
import { cn } from '@fex/utils'
import { computed, useSlots, watch } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { CheckIcon } from '../../icon/check'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from '../../icon/chevron'
import { MinusIcon } from '../../icon/minus'
import Button from '../button/button.vue'
import { CheckboxIndicator, CheckboxRoot } from '../checkbox/checkbox'
import { ListboxItem, ListboxRoot } from '../listbox/listbox'

export interface TransferPanelApi<T extends Record<string, unknown>> {
  side: TransferSide
  items: readonly T[]
  checkedKeys: readonly TransferKey[]
  controller: ReturnType<typeof createTransferController<T>>
  setCheckedKeys(keys: readonly TransferKey[]): void
  isChecked(key: TransferKey): boolean
}
export interface TransferPanels {
  source?: { header?: boolean; footer?: boolean }
  target?: { header?: boolean; footer?: boolean }
}
export interface TransferValidation {
  status: 'error' | 'warning'
  message: string
}
interface TransferProps<T extends Record<string, unknown>> {
  items: readonly T[]
  fieldNames?: TransferFieldNames | undefined
  disabled?: boolean | undefined
  targetKeys?: readonly TransferKey[] | undefined
  defaultTargetKeys?: readonly TransferKey[] | undefined
  checkedKeys?: Partial<TransferCheckedKeys> | undefined
  defaultCheckedKeys?: Partial<TransferCheckedKeys> | undefined
  title?: { source?: string; target?: string } | undefined
  panels?: TransferPanels | undefined
  validation?: TransferValidation | undefined
  class?: string | undefined
}
const props = withDefaults(defineProps<TransferProps<TItem>>(), {
  title: () => ({}),
  panels: () => ({}),
})
const emit = defineEmits<{
  change: [keys: readonly TransferKey[], meta: unknown]
  checkedChange: [keys: TransferCheckedKeys, meta: unknown]
}>()
const slots = useSlots()
const options = (): TransferControllerOptions<TItem> => ({
  ...props,
  onChange: (keys, meta) => emit('change', keys, meta),
  onCheckedChange: (keys, meta) => emit('checkedChange', keys, meta),
})
const controller = createTransferController(options())
const snapshot = useCoreStore(controller)
watch(
  () =>
    [props.items, props.targetKeys, props.checkedKeys, props.disabled, props.fieldNames] as const,
  () => controller.updateOptions(options()),
  { flush: 'sync' },
)
const fields = computed(() => resolveTransferFieldNames(props.fieldNames))
function api(side: TransferSide): TransferPanelApi<TItem> {
  const source = side === 'source'
  const state = snapshot.value
  const keys = source ? state.sourceCheckedKeys : state.targetCheckedKeys
  return {
    side,
    items: source ? state.sourceItems : state.targetItems,
    checkedKeys: keys,
    controller,
    setCheckedKeys: source ? controller.setSourceCheckedKeys : controller.setTargetCheckedKeys,
    isChecked: (key) => keys.includes(key),
  }
}
function enabledKeys(side: TransferSide) {
  return api(side)
    .items.filter((item) => !readTransferDisabled(item, fields.value))
    .map((item) => readTransferKey(item, fields.value))
}
function allState(side: TransferSide) {
  const keys = enabledKeys(side)
  const count = keys.filter((key) => api(side).checkedKeys.includes(key)).length
  return count === keys.length && keys.length ? true : count ? 'indeterminate' : false
}
function toggleAll(side: TransferSide, checked: boolean) {
  api(side).setCheckedKeys(checked ? enabledKeys(side) : [])
}
function can(action: 'target' | 'source' | 'allTarget' | 'allSource') {
  void snapshot.value
  return action === 'target'
    ? controller.canMoveToTarget()
    : action === 'source'
      ? controller.canMoveToSource()
      : action === 'allTarget'
        ? controller.canMoveAllToTarget()
        : controller.canMoveAllToSource()
}
function listChange(side: TransferSide, value: unknown) {
  api(side).setCheckedKeys(
    Array.isArray(value) ? (value as TransferKey[]) : value == null ? [] : [value as TransferKey],
  )
}
function hasRegion(side: TransferSide, region: 'header' | 'footer') {
  return region === 'header'
    ? props.panels?.[side]?.header !== false
    : props.panels?.[side]?.footer === true || Boolean(slots[`${side}Footer`])
}
</script>
<template>
  <div
    data-slot="transfer-root"
    :data-invalid="validation?.status === 'error' || undefined"
    :aria-invalid="validation?.status === 'error' || undefined"
    :class="
      cn(
        transferRootClassName,
        validation?.status === 'warning' &&
          '[&_[data-slot=transfer-panel]]:border-warning [&_[data-slot=transfer-panel]]:ring-3 [&_[data-slot=transfer-panel]]:ring-warning/20',
        props.class,
      )
    "
  >
    <div data-slot="transfer-layout" :class="transferLayoutClassName">
      <section
        v-for="side in ['source', 'target'] as const"
        :key="side"
        data-slot="transfer-panel"
        :data-side="side"
        :class="
          cn(
            side === 'source' ? transferSourcePanelClassName : transferTargetPanelClassName,
            'row-start-1',
            side === 'source' ? 'col-start-1' : 'col-start-3',
          )
        "
      >
        <header
          v-if="hasRegion(side, 'header')"
          data-slot="transfer-panel-header"
          :class="transferPanelHeaderClassName"
        >
          <slot :name="`${side}Header`" :api="api(side)">
            <CheckboxRoot
              :checked="allState(side)"
              :disabled="props.disabled || enabledKeys(side).length === 0"
              :class="checkboxClassName()"
              :aria-label="`Select all ${props.title?.[side] ?? (side === 'source' ? 'Source' : 'Target')}`"
              @checked-change="toggleAll(side, $event === true)"
              ><CheckboxIndicator :checked="allState(side)" :class="checkboxIndicatorClassName"
                ><CheckIcon :class="checkboxCheckIconClassName" /><MinusIcon
                  :class="checkboxMinusIconClassName" /></CheckboxIndicator
            ></CheckboxRoot>
            <span class="min-w-0 flex-1 truncate font-medium">{{
              props.title?.[side] ?? (side === 'source' ? 'Source' : 'Target')
            }}</span
            ><span class="shrink-0 text-muted-foreground"
              >{{ api(side).checkedKeys.length }}/{{ api(side).items.length }}</span
            >
          </slot>
        </header>
        <div data-slot="transfer-panel-body" :class="transferPanelBodyClassName">
          <slot :name="`${side}Body`" :api="api(side)">
            <ListboxRoot
              data-variant="transfer"
              multiple
              :disabled="props.disabled"
              :items="api(side).items"
              :value="api(side).checkedKeys"
              :get-item-value="(item) => readTransferKey(item as TItem, fields)"
              :get-item-disabled="
                (item) => props.disabled || readTransferDisabled(item as TItem, fields)
              "
              :class="listboxRootClassName({ variant: 'transfer' })"
              @change="listChange(side, $event)"
            >
              <ListboxItem
                v-for="item in api(side).items"
                :key="readTransferKey(item, fields)"
                :value="readTransferKey(item, fields)"
                :class="listboxItemClassName({ size: 'sm' })"
                ><span
                  aria-hidden="true"
                  :data-checked="api(side).isChecked(readTransferKey(item, fields)) || undefined"
                  class="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-border text-primary-foreground data-[checked=true]:border-primary data-[checked=true]:bg-primary"
                  ><CheckIcon
                    v-if="api(side).isChecked(readTransferKey(item, fields))"
                    class="size-3" /></span
                ><span class="min-w-0 flex-1 truncate text-sm"
                  ><slot name="item" :item="item" :side="side">{{ item[fields.label] }}</slot></span
                ></ListboxItem
              >
            </ListboxRoot>
          </slot>
        </div>
        <footer
          v-if="hasRegion(side, 'footer')"
          data-slot="transfer-panel-footer"
          :class="transferPanelFooterClassName"
        >
          <slot :name="`${side}Footer`" :api="api(side)" />
        </footer>
      </section>
      <div
        data-slot="transfer-actions"
        :class="cn(transferActionsClassName, 'col-start-2 row-start-1')"
      >
        <slot name="actions" :controller="controller" :snapshot="snapshot">
          <Button
            type="button"
            :class="buttonClassName({ variant: 'outline', size: 'icon' })"
            :disabled="!can('target')"
            aria-label="Move selected to target"
            @click="controller.moveToTarget()"
            ><ChevronRightIcon
          /></Button>
          <Button
            type="button"
            :class="buttonClassName({ variant: 'outline', size: 'icon' })"
            :disabled="!can('source')"
            aria-label="Move selected to source"
            @click="controller.moveToSource()"
            ><ChevronLeftIcon
          /></Button>
          <Button
            type="button"
            :class="buttonClassName({ variant: 'outline', size: 'icon' })"
            :disabled="!can('allTarget')"
            aria-label="Move all to target"
            @click="controller.moveAllToTarget()"
            ><ChevronsRightIcon
          /></Button>
          <Button
            type="button"
            :class="buttonClassName({ variant: 'outline', size: 'icon' })"
            :disabled="!can('allSource')"
            aria-label="Move all to source"
            @click="controller.moveAllToSource()"
            ><ChevronsLeftIcon
          /></Button>
        </slot>
      </div>
    </div>
    <div
      v-if="validation"
      data-slot="transfer-message"
      :role="validation.status === 'error' ? 'alert' : undefined"
      :class="
        validation.status === 'warning' ? transferWarningMessageClassName : transferMessageClassName
      "
    >
      {{ validation.message }}
    </div>
  </div>
</template>
