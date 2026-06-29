import { tableBodyClassName, tableCaptionClassName, tableCellClassName, tableClassName, tableContainerClassName, tableFooterClassName, tableHeadClassName, tableHeaderClassName, tableRowClassName } from "@fex/components-styles/table";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject } from "@angular/core";

function createClass(className: string) {
  const initial = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.getAttribute("class") ?? "";
  return computed(() => cn(className, initial));
}

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

@Component({ selector: "table[fex-table]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "table" }, template: "<ng-content />" })
export class Table { protected readonly hostClassName = createClass(tableClassName); }

@Component({ selector: "thead[fex-table-header]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "table-header" }, template: "<ng-content />" })
export class TableHeader { protected readonly hostClassName = createClass(tableHeaderClassName); }

@Component({ selector: "tbody[fex-table-body]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "table-body" }, template: "<ng-content />" })
export class TableBody { protected readonly hostClassName = createClass(tableBodyClassName); }

@Component({ selector: "tfoot[fex-table-footer]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "table-footer" }, template: "<ng-content />" })
export class TableFooter { protected readonly hostClassName = createClass(tableFooterClassName); }

@Component({ selector: "tr[fex-table-row]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "table-row" }, template: "<ng-content />" })
export class TableRow { protected readonly hostClassName = createClass(tableRowClassName); }

@Component({ selector: "th[fex-table-head]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "table-head" }, template: "<ng-content />" })
export class TableHead { protected readonly hostClassName = createClass(tableHeadClassName); }

@Component({ selector: "td[fex-table-cell]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "table-cell" }, template: "<ng-content />" })
export class TableCell { protected readonly hostClassName = createClass(tableCellClassName); }

@Component({ selector: "caption[fex-table-caption]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "table-caption" }, template: "<ng-content />" })
export class TableCaption { protected readonly hostClassName = createClass(tableCaptionClassName); }
