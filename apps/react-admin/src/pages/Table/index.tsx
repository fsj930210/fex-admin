import { Badge } from '@fex/components-react/ui/badge'
import { Card } from '@fex/components-react/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@fex/components-react/primitive/table'
import { Link } from 'react-router'

const invoices = [
  { id: 'INV-001', customer: 'Acme Co.', status: 'Paid', amount: '$320.00' },
  { id: 'INV-002', customer: 'Northwind', status: 'Pending', amount: '$180.00' },
  { id: 'INV-003', customer: 'Globex', status: 'Overdue', amount: '$96.00' },
]

export function TablePage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link><h1 className="text-2xl font-semibold text-foreground">Table</h1><p className="max-w-2xl text-sm leading-6 text-muted-foreground">Basic table structure without built-in sorting, selection, or pagination.</p></header>
        <Card title="Primitive" description="Caption, header, body, row, and cell slots."><Table><TableCaption>Latest three invoices</TableCaption><TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{invoices.map((invoice) => <TableRow key={invoice.id}><TableCell className="font-medium">{invoice.id}</TableCell><TableCell>{invoice.customer}</TableCell><TableCell><Badge variant="outline">{invoice.status}</Badge></TableCell><TableCell className="text-right">{invoice.amount}</TableCell></TableRow>)}</TableBody></Table></Card>
      </div>
    </main>
  )
}
