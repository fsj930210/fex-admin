import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  Card as PrimitiveCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fex/components-angular/primitive/card";
import Card from "@fex/components-angular/ui/card";

@Component({
  selector: "fex-card-page",
  imports: [
    PrimitiveCard,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    RouterLink,
  ],
  templateUrl: "./index.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}
