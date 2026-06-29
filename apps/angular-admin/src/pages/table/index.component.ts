import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@fex/components-angular/primitive/table'
import { Badge } from '@fex/components-angular/primitive/badge'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-table-page',
  imports: [RouterLink, Card, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Badge],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  protected readonly invoices = [{ id: 'INV-2026-001', customer: 'Acme Ops', status: 'Paid', amount: '$1,250.00' }, { id: 'INV-2026-002', customer: 'Northwind', status: 'Pending', amount: '$840.00' }, { id: 'INV-2026-003', customer: 'Globex', status: 'Overdue', amount: '$2,410.00' }] as const
}
