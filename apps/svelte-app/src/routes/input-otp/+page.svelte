<script lang="ts">
  import BasicDemo from './basic-demo.svelte'
  import ControlledDemo from './controlled-demo.svelte'
  import MixedRulesDemo from './mixed-rules-demo.svelte'
  import PasteDemo from './paste-demo.svelte'
  import VariableLengthDemo from './variable-length-demo.svelte'
</script>
<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><a href="/">返回首页</a><h1 class="text-2xl font-semibold">InputOTP 基础组件</h1><p class="text-sm text-muted-foreground">支持独立分段长度、输入规则和跨段粘贴的验证码输入组件。</p></header><div class="grid gap-space-xl"><BasicDemo/><VariableLengthDemo/><MixedRulesDemo/><PasteDemo/><ControlledDemo/></div></div></main>
