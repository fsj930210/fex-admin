import {
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardFooterClassName,
  cardHeaderClassName,
  cardTitleClassName,
} from "@fex/components-styles/card";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

@Component({
  selector: "fex-card-primitive",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "card",
  },
  template: "<ng-content />",
})
export class Card {
  protected readonly hostClassName = createHostClassName(cardClassName);
}

@Component({
  selector: "fex-card-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "card-header",
  },
  template: "<ng-content />",
})
export class CardHeader {
  protected readonly hostClassName = createHostClassName(cardHeaderClassName);
}

@Component({
  selector: "fex-card-title",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "card-title",
  },
  template: "<ng-content />",
})
export class CardTitle {
  protected readonly hostClassName = createHostClassName(cardTitleClassName);
}

@Component({
  selector: "fex-card-description",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "card-description",
  },
  template: "<ng-content />",
})
export class CardDescription {
  protected readonly hostClassName = createHostClassName(cardDescriptionClassName);
}

@Component({
  selector: "fex-card-content",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "card-content",
  },
  template: "<ng-content />",
})
export class CardContent {
  protected readonly hostClassName = createHostClassName(cardContentClassName);
}

@Component({
  selector: "fex-card-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "card-footer",
  },
  template: "<ng-content />",
})
export class CardFooter {
  protected readonly hostClassName = createHostClassName(cardFooterClassName);
}
