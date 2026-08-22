<script lang="ts">
  import BasicDemo from './basic-demo.svelte'
  import CustomConfigDemo from './custom-config-demo.svelte'
  import ImageDemo from './image-demo.svelte'
  import ModalDrawerDemo from './modal-drawer-demo.svelte'
  import MultilineDemo from './multiline-demo.svelte'
  import RestoreDemo from './restore-demo.svelte'
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <h1 class="text-2xl font-semibold text-foreground">Watermark</h1>
      <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
        Add repeated text watermarks over content, including image previews.
      </p>
    </header>
    <div class="grid gap-space-xl">
      <BasicDemo />
      <MultilineDemo />
      <ImageDemo />
      <CustomConfigDemo />
      <ModalDrawerDemo />
      <RestoreDemo />
    </div>
  </div>
</main>
