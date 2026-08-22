<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@fex-design/vue/icon/chevron'
import { Transfer } from '@fex-design/vue/primitive/transfer'
import { Badge } from '@fex-design/vue/primitive/badge'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { fieldNames, members } from './data'
</script>
<template>
  <Card
    title="Custom panel regions"
    description="Source and target headers, bodies and optional footers are configured independently while the panel structure remains built in."
    ><Transfer
      :items="members"
      :field-names="fieldNames"
      :default-target-keys="['ada', 'susan']"
      :panels="{ source: { footer: true }, target: { footer: true } }"
      ><template #actions="{ controller, snapshot }"
        ><div class="flex flex-col items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="!snapshot.sourceCheckedKeys.length"
            @click="controller.moveToTarget()"
            >Assign <ChevronRightIcon /></Button
          ><Button
            variant="outline"
            size="sm"
            :disabled="!snapshot.targetCheckedKeys.length"
            @click="controller.moveToSource()"
            ><ChevronLeftIcon /> Remove</Button
          >
        </div></template
      ><template #sourceHeader="{ api }"
        ><span class="font-medium">Candidate pool</span
        ><Badge>{{ api.items.length }}</Badge></template
      ><template #targetHeader="{ api }"
        ><span class="font-medium text-primary">Delivery team</span
        ><span class="ml-auto text-muted-foreground">{{ api.items.length }} members</span></template
      ><template #item="{ item }"
        ><span
          >{{ item.name }} <span class="text-muted-foreground">· {{ item.department }}</span></span
        ></template
      ><template #sourceFooter
        ><span class="text-muted-foreground"
          >Disabled members stay in their current panel.</span
        ></template
      ><template #targetFooter
        ><span class="text-muted-foreground"
          >Changes are applied when the form is submitted.</span
        ></template
      ></Transfer
    ></Card
  >
</template>
