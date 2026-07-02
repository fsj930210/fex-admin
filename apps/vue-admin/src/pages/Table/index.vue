<script setup lang="ts">
import { Badge } from '@fex/components-vue/ui/badge'
import Card from '@fex/components-vue/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@fex/components-vue/primitive/table'

const invoices = [
  { id: 'INV-001', customer: 'Acme Co.', status: 'Paid', amount: '$320.00' },
  { id: 'INV-002', customer: 'Northwind', status: 'Pending', amount: '$180.00' },
  { id: 'INV-003', customer: 'Globex', status: 'Overdue', amount: '$96.00' },
]
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink><h1 class="text-2xl font-semibold text-foreground">Table</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Basic table structure without built-in sorting, selection, or pagination.</p></header><Card title="Primitive" description="Caption, header, body, row, and cell slots."><Table><TableCaption>Latest three invoices</TableCaption><TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead class="text-right">Amount</TableHead></TableRow></TableHeader><TableBody><TableRow v-for="invoice in invoices" :key="invoice.id"><TableCell class="font-medium">{{ invoice.id }}</TableCell><TableCell>{{ invoice.customer }}</TableCell><TableCell><Badge variant="outline">{{ invoice.status }}</Badge></TableCell><TableCell class="text-right">{{ invoice.amount }}</TableCell></TableRow></TableBody></Table></Card></div></main>
</template>
