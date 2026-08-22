<script lang="ts">
  import AdvancedDemo from './advanced-demo.svelte'
  import BasicDemo from './basic-demo.svelte'
  import ColorDemo from './color-demo.svelte'
  import CustomStatusDemo from './custom-status-demo.svelte'
  import DownloadDemo from './download-demo.svelte'
  import ErrorLevelDemo from './error-level-demo.svelte'
  import IconDemo from './icon-demo.svelte'
  import RenderTypeDemo from './render-type-demo.svelte'
  import SizeDemo from './size-demo.svelte'
  import StatusDemo from './status-demo.svelte'
</script>

<svelte:head><title>QRCode - Svelte Admin</title></svelte:head>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <h1 class="text-2xl font-semibold text-foreground">QRCode</h1>
      <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
        使用 primitive 部件组合二维码结构、渲染面、中心内容和自定义状态。
      </p>
    </header>
    <div class="grid gap-space-xl">
      <BasicDemo />
      <IconDemo />
      <StatusDemo />
      <CustomStatusDemo />
      <RenderTypeDemo />
      <SizeDemo />
      <ColorDemo />
      <DownloadDemo />
      <ErrorLevelDemo />
      <AdvancedDemo />
    </div>
  </div>
</main>
