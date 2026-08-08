<script lang="ts">
  import BasicDemo from './basic-demo.svelte'
  import CustomTriggerDemo from './custom-trigger-demo.svelte'
  import ParamsDemo from './params-demo.svelte'
  import PrefixDemo from './prefix-demo.svelte'
  import ValidationDemo from './validation-demo.svelte'
</script>

<svelte:head><title>Mentions</title></svelte:head>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <h1 class="text-2xl font-semibold text-foreground">Mentions primitive</h1>
      <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
        Mention primitives identify prefix queries, render caller-owned items, and notify selection.
      </p>
    </header>
    <div class="grid gap-space-xl">
      <BasicDemo />
      <PrefixDemo />
      <ParamsDemo />
      <CustomTriggerDemo />
      <ValidationDemo />
    </div>
  </div>
</main>
