<script lang="ts">
  import InputNumber from '@fex-design/svelte/primitive/input-number'
  import Card from '@fex-design/svelte/ui/card'

  const parser = (text: string) => {
    const value = Number(text.replace(/[¥,\s]/g, ''))
    return Number.isFinite(value) ? value : undefined
  }
</script>

<Card title="Parser and formatter" description="Blur restores currency presentation.">
  <InputNumber
    class="max-w-sm"
    defaultValue={1234.5}
    {parser}
    formatter={(value, info) =>
      info.userTyping
        ? info.input
        : value === undefined
          ? ''
          : `¥${new Intl.NumberFormat('zh-CN').format(value)}`}
  />
</Card>
