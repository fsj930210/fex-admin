<script setup lang="ts">
import Breadcrumb, { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@fex-design/vue/primitive/breadcrumb'
defineProps<{ separator?: string }>()
</script>
<template><Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/">Workspace</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator>{{ separator ?? '/' }}</BreadcrumbSeparator><BreadcrumbItem><BreadcrumbLink href="/projects">Projects</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator>{{ separator ?? '/' }}</BreadcrumbSeparator><BreadcrumbItem><BreadcrumbPage>Quarterly plan</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb></template>
