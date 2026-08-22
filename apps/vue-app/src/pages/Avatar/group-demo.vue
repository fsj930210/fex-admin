<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarGroup } from '@fex-design/vue/primitive/avatar'
import Card from '@fex-design/vue/ui/card'
const names = ['AM', 'BL', 'CS', 'DT', 'ER']
</script>
<template><Card title="Avatar group" description="Keep the first avatars visible and summarize the rest."><AvatarGroup :max-count="3"><Avatar v-for="name in names" :key="name"><AvatarFallback>{{ name }}</AvatarFallback></Avatar></AvatarGroup></Card></template>
