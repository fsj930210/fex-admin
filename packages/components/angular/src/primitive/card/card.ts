import {
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardFooterClassName,
  cardHeaderClassName,
  cardTitleClassName,
} from "@fex/components-styles/card";
import { cn } from "@fex/utils";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
} from "@angular/core";

function createHostClass(className: () => string) {
  const elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  const initialClassName = elementRef.nativeElement.getAttribute("class") ?? "";

  return computed(() => cn(className(), initialClassName));
}

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
  protected readonly hostClassName = createHostClass(cardClassName);
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
  protected readonly hostClassName = createHostClass(cardHeaderClassName);
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
  protected readonly hostClassName = createHostClass(cardTitleClassName);
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
  protected readonly hostClassName = createHostClass(cardDescriptionClassName);
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
  protected readonly hostClassName = createHostClass(cardContentClassName);
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
  protected readonly hostClassName = createHostClass(cardFooterClassName);
}
