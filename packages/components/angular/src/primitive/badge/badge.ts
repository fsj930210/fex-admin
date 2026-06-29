import { badgeClassName, type BadgeStyleProps } from "@fex/components-styles/badge";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from "@angular/core";

@Component({
  selector: "fex-badge",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "badge", "[attr.data-variant]": "variant()" },
  template: "<ng-content />",
})
export class Badge {
  readonly variant = input<BadgeStyleProps["variant"]>("default");
  private readonly initialClassName = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.getAttribute("class") ?? "";
  protected readonly hostClassName = computed(() => cn(badgeClassName({ variant: this.variant() }), this.initialClassName));
}
