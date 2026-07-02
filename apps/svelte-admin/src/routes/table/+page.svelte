<script lang="ts">
  import Badge from '@fex/components-svelte/ui/badge'
  import Card from '@fex/components-svelte/ui/card'
  import Table from '@fex/components-svelte/primitive/table'
  import TableBody from '@fex/components-svelte/primitive/table-body'
  import TableCaption from '@fex/components-svelte/primitive/table-caption'
  import TableCell from '@fex/components-svelte/primitive/table-cell'
  import TableHead from '@fex/components-svelte/primitive/table-head'
  import TableHeader from '@fex/components-svelte/primitive/table-header'
  import TableRow from '@fex/components-svelte/primitive/table-row'

  const invoices = [
    { id: 'INV-001', customer: 'Acme Co.', status: 'Paid', amount: '$320.00' },
    { id: 'INV-002', customer: 'Northwind', status: 'Pending', amount: '$180.00' },
    { id: 'INV-003', customer: 'Globex', status: 'Overdue', amount: '$96.00' },
  ]
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a><h1 class="text-2xl font-semibold text-foreground">Table</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Basic table structure without built-in sorting, selection, or pagination.</p></header><Card title="Primitive" description="Caption, header, body, row, and cell slots."><Table><TableCaption>Latest three invoices</TableCaption><TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead class="text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{#each invoices as invoice (invoice.id)}<TableRow><TableCell class="font-medium">{invoice.id}</TableCell><TableCell>{invoice.customer}</TableCell><TableCell><Badge variant="outline">{invoice.status}</Badge></TableCell><TableCell class="text-right">{invoice.amount}</TableCell></TableRow>{/each}</TableBody></Table></Card></div></main>
