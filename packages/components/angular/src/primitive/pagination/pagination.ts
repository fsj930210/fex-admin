import { paginationClassName, paginationContentClassName, paginationEllipsisClassName, paginationLinkClassName, paginationSrOnlyClassName, paginationTextClassName, paginationTextLinkClassName } from "@fex/components-styles/pagination";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ChevronLeftIcon, ChevronRightIcon } from "../../icon/chevron";
import { EllipsisIcon } from "../../icon/more";
import { createHostClassName } from "../../signals/host-class";

@Component({
  selector: "nav[fexPagination]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "role": "navigation",
    "aria-label": "pagination",
    "data-slot": "pagination",
  },
  template: "<ng-content />",
})
export class Pagination {
  protected readonly hostClassName = createHostClassName(paginationClassName);
}

@Component({
  selector: "ul[fexPaginationContent]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "pagination-content",
  },
  template: "<ng-content />",
})
export class PaginationContent {
  protected readonly hostClassName = createHostClassName(paginationContentClassName);
}

@Component({
  selector: "li[fexPaginationItem]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-slot": "pagination-item",
  },
  template: "<ng-content />",
})
export class PaginationItem {}

@Component({
  selector: "a[fexPaginationLink]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "[attr.aria-current]": "isActive() ? 'page' : null", "data-slot": "pagination-link", "[attr.data-active]": "isActive() ? 'true' : null" },
  template: "<ng-content />",
})
export class PaginationLink {
  readonly isActive = input(false);
  readonly size = input<"default" | "icon">("icon");
  protected readonly hostClassName = createHostClassName(() => cn(paginationLinkClassName, this.size() === "default" ? paginationTextLinkClassName : ""));
}

@Component({
  selector: "a[fexPaginationPrevious]",
  standalone: true,
  imports: [ChevronLeftIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "aria-label": "Go to previous page",
    "data-slot": "pagination-link",
  },
  templateUrl: "./pagination-previous.html",
})
export class PaginationPrevious {
  readonly text = input("Previous");
  protected readonly textClassName = paginationTextClassName;
  protected readonly hostClassName = createHostClassName(cn(paginationLinkClassName, paginationTextLinkClassName));
}

@Component({
  selector: "a[fexPaginationNext]",
  standalone: true,
  imports: [ChevronRightIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "aria-label": "Go to next page",
    "data-slot": "pagination-link",
  },
  templateUrl: "./pagination-next.html",
})
export class PaginationNext {
  readonly text = input("Next");
  protected readonly textClassName = paginationTextClassName;
  protected readonly hostClassName = createHostClassName(cn(paginationLinkClassName, paginationTextLinkClassName));
}

@Component({
  selector: "span[fexPaginationEllipsis]",
  standalone: true,
  imports: [EllipsisIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "aria-hidden": "true",
    "data-slot": "pagination-ellipsis",
  },
  templateUrl: "./pagination-ellipsis.html",
})
export class PaginationEllipsis {
  protected readonly srOnlyClassName = paginationSrOnlyClassName;
  protected readonly hostClassName = createHostClassName(paginationEllipsisClassName);
}
