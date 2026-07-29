<script setup lang="ts">
import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
import { createDataGridSelectionColumn, DataGrid, tableFeatures } from '@fex/components-vue/primitive/data-grid'
import type { TransferPanelApi } from '@fex/components-vue/primitive/transfer'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { watchEffect } from 'vue'
import type { Member } from './data'
const props=defineProps<{api:TransferPanelApi<Member>}>(); const features=tableFeatures({rowSelectionFeature}); const columns=[createDataGridSelectionColumn({mode:'multiple'}),{accessorKey:'name',header:'Name'},{accessorKey:'department',header:'Department'}]
const options=()=>({features,data:[...props.api.items],columns,getRowId:(row:Member)=>row.id,enableRowSelection:(row:any)=>row.original.disabled!==true,state:{rowSelection:Object.fromEntries(props.api.checkedKeys.map(key=>[String(key),true]))},onRowSelectionChange:(updater:any)=>{const current=Object.fromEntries(props.api.checkedKeys.map(key=>[String(key),true]));const next=typeof updater==='function'?updater(current):updater;props.api.setCheckedKeys(Object.keys(next).filter(key=>next[key]))}})
const table=useDataGridTable(options() as any); watchEffect(()=>table.setDataGridOptions(options() as any))
</script>
<template><DataGrid :table="table" /></template>
