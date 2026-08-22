<script>
  import BasicDemo from './basic-demo.svelte'
  import ConstraintsDemo from './constraints-demo.svelte'
  import CustomLogicDemo from './custom-logic-demo.svelte'
  import FormatterDemo from './formatter-demo.svelte'
  import KeyboardDemo from './keyboard-demo.svelte'
  import MinMaxDemo from './min-max-demo.svelte'
  import StatesDemo from './states-demo.svelte'
  import SuffixDemo from './suffix-demo.svelte'
  import ValidationDemo from './validation-demo.svelte'
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header>
      <a href="/">Back home</a>
      <h1 class="text-2xl font-semibold">InputNumber primitive</h1>
    </header>
    <div class="grid gap-space-xl">
      <BasicDemo />
      <ConstraintsDemo />
      <MinMaxDemo />
      <FormatterDemo />
      <SuffixDemo />
      <KeyboardDemo />
      <StatesDemo />
      <ValidationDemo />
      <CustomLogicDemo />
    </div>
  </div>
</main>
