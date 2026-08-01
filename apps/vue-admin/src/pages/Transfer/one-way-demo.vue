<script setup lang="ts">
import { ChevronRightIcon } from '@fex/components-vue/icon/chevron'
import { TrashIcon } from '@fex/components-vue/icon/trash'
import { SwitchRoot, SwitchThumb } from '@fex/components-vue/primitive/switch'
import { Transfer } from '@fex/components-vue/primitive/transfer'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'
import { fieldNames, members } from './data'
const disabled = ref(false)
const targetKeys = ref<readonly (string | number)[]>(['susan', 'katherine'])
</script>
<template>
  <Card
    title="One-way composition"
    description="A custom action area only moves records to the target; target rows remove themselves through the same Transfer controller."
    ><div class="space-y-space-md">
      <Transfer
        :items="members"
        :field-names="fieldNames"
        :target-keys="targetKeys"
        :disabled="disabled"
        :title="{ source: 'Source', target: 'Target' }"
        @change="targetKeys = $event"
        ><template #actions="{ controller, snapshot }"
          ><Button
            variant="outline"
            size="icon"
            aria-label="Move selected to target"
            :disabled="!snapshot.sourceCheckedKeys.length"
            @click="controller.moveToTarget()"
            ><ChevronRightIcon /></Button></template
        ><template #targetHeader="{ api }"
          ><span class="font-medium">Target</span
          ><span class="ml-auto text-muted-foreground">{{ api.items.length }} items</span></template
        ><template #targetBody="{ api }"
          ><div class="space-y-1">
            <div
              v-for="item in api.items"
              :key="item.id"
              class="flex min-h-8 items-center gap-2 px-2 text-sm"
            >
              <span class="min-w-0 flex-1 truncate">{{ item.name }}</span
              ><Button
                variant="ghost"
                size="icon-xs"
                :aria-label="`Remove ${item.name}`"
                v-bind="disabled || item.disabled ? { disabled: true } : {}"
                @click="
                  api.setCheckedKeys([item.id])
                  api.controller.moveToSource()
                "
                ><TrashIcon
              /></Button>
            </div></div></template></Transfer
      ><label class="flex w-fit items-center gap-2 text-sm text-muted-foreground"
        ><SwitchRoot
          :checked="disabled"
          aria-label="Disable one-way Transfer"
          @checked-change="disabled = $event"
          ><template #default="{ checked }"
            ><SwitchThumb :checked="checked" /></template></SwitchRoot
        >Disabled</label
      >
    </div></Card
  >
</template>
