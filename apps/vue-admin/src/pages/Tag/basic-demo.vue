<script setup lang="ts">import Tag from '@fex-design/vue/primitive/tag';import Card from '@fex-design/vue/ui/card'</script>
<template><Card title="基础与外观" description="Tag 可以独立展示，颜色和外观彼此独立。"><div class="flex flex-wrap items-center gap-space-md"><Tag>默认标签</Tag><Tag variant="outlined">描边标签</Tag><Tag variant="solid" color="primary">强调标签</Tag><Tag size="sm">紧凑标签</Tag></div></Card></template>
