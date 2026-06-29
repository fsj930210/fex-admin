import { Badge } from '@fex/components-react/primitive/badge'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@fex/components-react/primitive/table'
import { Card } from '@fex/components-react/ui/card'
import { Link } from 'react-router'

const invoices = [
  { id: 'INV-2026-001', customer: 'Acme Ops', status: 'Paid', amount: '$1,250.00' },
  { id: 'INV-2026-002', customer: 'Northwind', status: 'Pending', amount: '$840.00' },
  { id: 'INV-2026-003', customer: 'Globex', status: 'Overdue', amount: '$2,410.00' },
] as const

export function TablePage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link>
          <h1 className="text-2xl font-semibold text-foreground">Table</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">基础表格结构，不内置排序、选择和分页。</p>
        </header>

        <Card title="Primitive" description="caption、header、body、row 和 cell slot。">
          <Table>
            <TableCaption>最近三条账单记录</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell><Badge variant="outline">{invoice.status}</Badge></TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  )
}
