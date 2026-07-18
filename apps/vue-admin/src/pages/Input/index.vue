<script setup lang="ts">
import { InputAddonAfter, InputAddonBefore, InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '@fex/components-vue/primitive/input'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'

const controlledValue = ref('fex-admin')
const manualValue = ref('manual-value')
const focusControl = ref<{ focus: () => void; blur: () => void } | null>(null)
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</RouterLink>
        <h1 class="text-2xl font-semibold text-foreground">Input primitives</h1>
        <p class="max-w-2xl text-sm leading-6 text-muted-foreground">原生输入、值状态、前后缀、附加内容与清空行为均由独立 primitive 显式组合。</p>
      </header>

      <div class="space-y-space-xl">
        <Card title="Basic" description="InputRoot 管理输入协议，InputControl 保留原生 input 语义。"><InputRoot class="max-w-md"><InputControl name="email" placeholder="admin@example.com" type="email" /></InputRoot></Card>
        <Card title="Controlled and uncontrolled" description="受控值由调用方维护；非受控值只声明初始值。"><div class="grid gap-space-lg md:grid-cols-2"><div class="space-y-space-sm"><InputRoot :value="controlledValue" @value-change="controlledValue = $event"><InputControl aria-label="受控输入" placeholder="受控输入" /></InputRoot><p class="text-sm text-muted-foreground">受控值：{{ controlledValue || '（空）' }}</p></div><InputRoot default-value="uncontrolled-value"><InputControl aria-label="非受控输入" placeholder="非受控输入" /></InputRoot></div></Card>
        <Card title="Prefix" description="InputPrefix 位于输入框内部、原生输入内容之前。"><InputRoot class="max-w-md"><InputPrefix aria-hidden="true">@</InputPrefix><InputControl aria-label="用户名" placeholder="username" /></InputRoot></Card>
        <Card title="Suffix" description="InputSuffix 位于输入框内部、原生输入内容之后。"><InputRoot class="max-w-md"><InputControl aria-label="域名" placeholder="example" /><InputSuffix>.com</InputSuffix></InputRoot></Card>
        <Card title="Addons" description="AddonBefore 和 AddonAfter 位于输入框两端，并与 Root 边框连成整体。"><InputRoot class="max-w-xl"><InputAddonBefore>https://</InputAddonBefore><InputControl aria-label="站点地址" placeholder="example" /><InputAddonAfter>/console</InputAddonAfter></InputRoot></Card>
        <Card title="Clear" description="InputClear 仅在有值且可编辑时显示，清空后恢复输入焦点。"><InputRoot default-value="clearable-value" class="max-w-md"><InputControl aria-label="可清空输入" /><InputClear aria-label="清空输入" /></InputRoot></Card>
        <Card title="Manual focus and clear" description="调用方可以通过原生 ref 聚焦或移除焦点，并通过受控值手动清空。"><div class="max-w-md space-y-space-md"><InputRoot :value="manualValue" @value-change="manualValue = $event"><InputControl ref="focusControl" aria-label="手动控制输入" placeholder="手动控制输入" /></InputRoot><div class="flex flex-wrap gap-space-sm"><Button size="sm" @click="focusControl?.focus()">聚焦</Button><Button size="sm" variant="outline" @click="focusControl?.blur()">移除焦点</Button><Button size="sm" variant="outline" @click="manualValue = ''">手动清空</Button></div></div></Card>
        <Card title="States" description="禁用、只读和校验失败状态由 Root 统一下发。"><div class="grid gap-space-lg md:grid-cols-3"><InputRoot disabled default-value="禁用内容"><InputControl aria-label="禁用示例" /></InputRoot><InputRoot read-only default-value="只读内容"><InputControl aria-label="只读示例" /></InputRoot><InputRoot invalid><InputControl aria-label="错误示例" placeholder="校验失败" /></InputRoot></div></Card>
      </div>
    </div>
  </main>
</template>
