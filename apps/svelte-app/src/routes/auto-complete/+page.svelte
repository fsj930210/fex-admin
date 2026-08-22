<script lang="ts">
  import BasicDemo from './basic-demo.svelte'
  import ControlledDemo from './controlled-demo.svelte'
  import CustomDemo from './custom-demo.svelte'
  import RemoteDemo from './remote-demo.svelte'
</script>
<svelte:head><title>AutoComplete</title></svelte:head>
<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <h1 class="text-2xl font-semibold text-foreground">AutoComplete</h1>
      <p class="max-w-2xl text-sm text-muted-foreground">Free text input with optional local or remote suggestions. Selection metadata preserves complete backend records.</p>
    </header>
    <div class="grid gap-space-xl"><BasicDemo /><ControlledDemo /><RemoteDemo /><CustomDemo /></div>
  </div>
</main>
