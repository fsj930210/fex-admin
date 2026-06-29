import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  type TemplateRef,
} from "@angular/core";
import { cardClassName } from "@fex/components-styles/card";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@fex/components-angular/primitive/card";
import { cn } from "@fex/utils";

@Component({
  selector: "fex-card",
  standalone: true,
  imports: [CardHeader, CardTitle, CardDescription, CardContent, CardFooter, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "card",
    "[attr.data-size]": "size()",
  },
  template: `
    @if (title() || description()) {
      <fex-card-header>
        @if (title()) {
          <fex-card-title>{{ title() }}</fex-card-title>
        }
        @if (description()) {
          <fex-card-description>{{ description() }}</fex-card-description>
        }
      </fex-card-header>
    }
    <fex-card-content>
      <ng-content />
    </fex-card-content>
    @if (footer()) {
      <fex-card-footer>
        <ng-container *ngTemplateOutlet="footer() ?? null" />
      </fex-card-footer>
    }
  `,
})
export class Card {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly initialClassName = this.elementRef.nativeElement.getAttribute("class") ?? "";

  title = input<string | undefined>();
  description = input<string | undefined>();
  footer = input<TemplateRef<unknown> | undefined>();
  size = input<"sm" | "md" | "lg">("md");

  protected readonly hostClassName = computed(() => cn(cardClassName, this.initialClassName));
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
export default Card;
