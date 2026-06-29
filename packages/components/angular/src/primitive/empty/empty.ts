import { emptyClassName, emptyContentClassName, emptyDescriptionClassName, emptyHeaderClassName, emptyMediaClassName, emptyTitleClassName, type EmptyMediaStyleProps } from "@fex/components-styles/empty";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from "@angular/core";

function initialClassName() {
  return inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.getAttribute("class") ?? "";
}

function createClass(className: string) {
  const initial = initialClassName();
  return computed(() => cn(className, initial));
}

@Component({ selector: "fex-empty", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "empty" }, template: "<ng-content />" })
export class Empty { protected readonly hostClassName = createClass(emptyClassName); }

@Component({ selector: "fex-empty-header", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "empty-header" }, template: "<ng-content />" })
export class EmptyHeader { protected readonly hostClassName = createClass(emptyHeaderClassName); }

@Component({
  selector: "fex-empty-media",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "empty-icon", "[attr.data-variant]": "variant()" },
  template: "<ng-content />",
})
export class EmptyMedia {
  readonly variant = input<EmptyMediaStyleProps["variant"]>("default");
  private readonly initialClassName = initialClassName();
  protected readonly hostClassName = computed(() => cn(emptyMediaClassName({ variant: this.variant() }), this.initialClassName));
}

@Component({ selector: "fex-empty-title", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "empty-title" }, template: "<ng-content />" })
export class EmptyTitle { protected readonly hostClassName = createClass(emptyTitleClassName); }

@Component({ selector: "fex-empty-description", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "empty-description" }, template: "<ng-content />" })
export class EmptyDescription { protected readonly hostClassName = createClass(emptyDescriptionClassName); }

@Component({ selector: "fex-empty-content", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "empty-content" }, template: "<ng-content />" })
export class EmptyContent { protected readonly hostClassName = createClass(emptyContentClassName); }
