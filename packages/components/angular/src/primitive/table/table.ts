import { tableBodyClassName, tableCaptionClassName, tableCellClassName, tableClassName, tableContainerClassName, tableFooterClassName, tableHeadClassName, tableHeaderClassName, tableRowClassName } from "@fex/components-styles/table";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

@Component({
  selector: "fex-table-container",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "containerClassName", "data-slot": "table-container" },
  template: "<ng-content />",
})
export class TableContainer {
  protected readonly containerClassName = tableContainerClassName;
}

@Component({
  selector: "table[fexTable]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "table",
  },
  template: "<ng-content />",
})
export class Table {
  protected readonly hostClassName = createHostClassName(tableClassName);
}

@Component({
  selector: "thead[fexTableHeader]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "table-header",
  },
  template: "<ng-content />",
})
export class TableHeader {
  protected readonly hostClassName = createHostClassName(tableHeaderClassName);
}

@Component({
  selector: "tbody[fexTableBody]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "table-body",
  },
  template: "<ng-content />",
})
export class TableBody {
  protected readonly hostClassName = createHostClassName(tableBodyClassName);
}

@Component({
  selector: "tfoot[fexTableFooter]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "table-footer",
  },
  template: "<ng-content />",
})
export class TableFooter {
  protected readonly hostClassName = createHostClassName(tableFooterClassName);
}

@Component({
  selector: "tr[fexTableRow]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "table-row",
  },
  template: "<ng-content />",
})
export class TableRow {
  protected readonly hostClassName = createHostClassName(tableRowClassName);
}

@Component({
  selector: "th[fexTableHead]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "table-head",
  },
  template: "<ng-content />",
})
export class TableHead {
  protected readonly hostClassName = createHostClassName(tableHeadClassName);
}

@Component({
  selector: "td[fexTableCell]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "table-cell",
  },
  template: "<ng-content />",
})
export class TableCell {
  protected readonly hostClassName = createHostClassName(tableCellClassName);
}

@Component({
  selector: "caption[fexTableCaption]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "table-caption",
  },
  template: "<ng-content />",
})
export class TableCaption {
  protected readonly hostClassName = createHostClassName(tableCaptionClassName);
}
