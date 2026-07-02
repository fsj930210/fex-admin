import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
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
import { createHostClassName } from "../../signals/host-class";

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
  templateUrl: "./card.html",
})
export class Card {
  title = input<string | undefined>();
  description = input<string | undefined>();
  footer = input<TemplateRef<unknown> | undefined>();
  size = input<"sm" | "md" | "lg">("md");

  protected readonly hostClassName = createHostClassName(cardClassName);
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
export default Card;
