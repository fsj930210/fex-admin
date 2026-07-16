import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { BasicDemoComponent } from './basic-demo.component'
import { HeaderGroupingDemoComponent } from './header-grouping-demo.component'
import { SortingDemoComponent } from './sorting-demo.component'
import { FilteringDemoComponent } from './filtering-demo.component'
import { PaginationDemoComponent } from './pagination-demo.component'
import { SelectionDemoComponent } from './selection-demo.component'
import { ExpansionDemoComponent } from './expansion-demo.component'
import { VisibilityDemoComponent } from './visibility-demo.component'
import { OrderingDemoComponent } from './ordering-demo.component'
import { DndDemoComponent } from './dnd-demo.component'
import { ColumnPinningDemoComponent } from './column-pinning-demo.component'
import { RowPinningDemoComponent } from './row-pinning-demo.component'
import { SizingDemoComponent } from './sizing-demo.component'
import { GroupingDemoComponent } from './grouping-demo.component'
import { VirtualDemoComponent } from './virtual-demo.component'
import { CellEditingDemoComponent } from './cell-editing-demo.component'
import { RowEditingDemoComponent } from './row-editing-demo.component'
import { PresentationDemoComponent } from './presentation-demo.component'

@Component({
  selector: 'fex-data-grid-page',
  imports: [
    RouterLink,
    BasicDemoComponent,
    HeaderGroupingDemoComponent,
    SortingDemoComponent,
    FilteringDemoComponent,
    PaginationDemoComponent,
    SelectionDemoComponent,
    ExpansionDemoComponent,
    VisibilityDemoComponent,
    OrderingDemoComponent,
    DndDemoComponent,
    ColumnPinningDemoComponent,
    RowPinningDemoComponent,
    SizingDemoComponent,
    GroupingDemoComponent,
    VirtualDemoComponent,
    CellEditingDemoComponent,
    RowEditingDemoComponent,
    PresentationDemoComponent,
  ],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent {}
