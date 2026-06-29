import { paginationClassName, paginationContentClassName, paginationEllipsisClassName, paginationLinkClassName, paginationSrOnlyClassName, paginationTextClassName, paginationTextLinkClassName } from "@fex/components-styles/pagination";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from "@angular/core";
import { ChevronLeftIcon, ChevronRightIcon } from "../../icon/chevron";
import { EllipsisIcon } from "../../icon/more";

function initialClassName() {
  return inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.getAttribute("class") ?? "";
}

function createClass(className: string) {
  const initial = initialClassName();
  return computed(() => cn(className, initial));
}

@Component({ selector: "nav[fex-pagination]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "role": "navigation", "aria-label": "pagination", "data-slot": "pagination" }, template: "<ng-content />" })
export class Pagination { protected readonly hostClassName = createClass(paginationClassName); }

@Component({ selector: "ul[fex-pagination-content]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "pagination-content" }, template: "<ng-content />" })
export class PaginationContent { protected readonly hostClassName = createClass(paginationContentClassName); }

@Component({ selector: "li[fex-pagination-item]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "data-slot": "pagination-item" }, template: "<ng-content />" })
export class PaginationItem {}

@Component({
  selector: "a[fex-pagination-link]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "[attr.aria-current]": "isActive() ? 'page' : null", "data-slot": "pagination-link", "[attr.data-active]": "isActive() ? 'true' : null" },
  template: "<ng-content />",
})
export class PaginationLink {
  readonly isActive = input(false);
  readonly size = input<"default" | "icon">("icon");
  private readonly initialClassName = initialClassName();
  protected readonly hostClassName = computed(() => cn(paginationLinkClassName, this.size() === "default" ? paginationTextLinkClassName : "", this.initialClassName));
}

@Component({ selector: "a[fex-pagination-previous]", standalone: true, imports: [ChevronLeftIcon], changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "aria-label": "Go to previous page", "data-slot": "pagination-link" }, template: '<fex-chevron-left-icon /><span [class]="textClassName">{{ text() }}</span>' })
export class PaginationPrevious {
  readonly text = input("Previous");
  protected readonly textClassName = paginationTextClassName;
  private readonly initialClassName = initialClassName();
  protected readonly hostClassName = computed(() => cn(paginationLinkClassName, paginationTextLinkClassName, this.initialClassName));
}

@Component({ selector: "a[fex-pagination-next]", standalone: true, imports: [ChevronRightIcon], changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "aria-label": "Go to next page", "data-slot": "pagination-link" }, template: '<span [class]="textClassName">{{ text() }}</span><fex-chevron-right-icon />' })
export class PaginationNext {
  readonly text = input("Next");
  protected readonly textClassName = paginationTextClassName;
  private readonly initialClassName = initialClassName();
  protected readonly hostClassName = computed(() => cn(paginationLinkClassName, paginationTextLinkClassName, this.initialClassName));
}

@Component({ selector: "span[fex-pagination-ellipsis]", standalone: true, imports: [EllipsisIcon], changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "aria-hidden": "true", "data-slot": "pagination-ellipsis" }, template: '<fex-ellipsis-icon /><span [class]="srOnlyClassName">More pages</span>' })
export class PaginationEllipsis {
  protected readonly srOnlyClassName = paginationSrOnlyClassName;
  protected readonly hostClassName = createClass(paginationEllipsisClassName);
}
