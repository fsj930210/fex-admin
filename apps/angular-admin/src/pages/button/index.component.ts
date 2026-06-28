import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Button as PrimitiveButton } from "@fex/components-angular/primitive/button";
import { Button } from "@fex/components-angular/ui/button";

@Component({
  selector: "fex-button-page",
  imports: [PrimitiveButton, Button, RouterLink],
  template: `
    <main class="space-y-8 p-6">
      <header class="space-y-2">
        <a routerLink="/">返回首页</a>
        <h1 class="text-2xl font-semibold">Button</h1>
      </header>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Primitive</h2>
        <div class="flex flex-wrap gap-3">
          <button fex-button-primitive>Primitive button</button>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Ui</h2>
        <div class="flex flex-wrap gap-3">
          @for (variant of variants; track variant) {
            <button fex-button [variant]="variant">{{ variant }}</button>
          }
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Variants</h2>
        <div class="flex flex-wrap gap-3">
          @for (variant of variants; track variant) {
            <button fex-button [variant]="variant">{{ variant }}</button>
          }
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Sizes</h2>
        <div class="flex flex-wrap items-center gap-3">
          @for (size of sizes; track size) {
            <button
              fex-button
              [size]="size"
              [attr.aria-label]="size.startsWith('icon') ? size : null"
            >
              @if (size.startsWith("icon")) {
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              } @else {
                {{ size }}
              }
            </button>
          }
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Loading</h2>
        <div class="flex flex-wrap gap-3">
          <button fex-button [loading]="true">Loading start</button>
          <button fex-button [loading]="true" iconPlacement="end">Loading end</button>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Icon</h2>
        <div class="flex flex-wrap gap-3">
          <button fex-button>
            <svg
              slot="start"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Icon start
          </button>
          <button fex-button iconPlacement="end">
            Icon end
            <svg
              slot="end"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Effects</h2>
        <div class="flex flex-wrap gap-3">
          @for (effect of effects; track effect) {
            <button fex-button [effect]="effect" iconPlacement="end">
              {{ effect }}
              @if (effect === "expand-icon") {
                <svg
                  slot="end"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              }
            </button>
          }
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Mixed Usage</h2>
        <div class="flex flex-wrap gap-3">
          <button fex-button effect="expand-icon" iconPlacement="end">
            Icon right
            <svg
              slot="end"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
          <button fex-button effect="expand-icon">
            <svg
              slot="start"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Icon left
          </button>
          <button fex-button variant="secondary" effect="gooey-left">Secondary gooey left</button>
          <button fex-button variant="destructive" effect="gooey-right">
            Destructive gooey right
          </button>
          <button fex-button variant="destructive" effect="shine">Destructive shine</button>
          <button fex-button variant="outline" effect="ring-hover">Outline ring hover</button>
          <button fex-button variant="link" effect="hover-underline">Link hover underline</button>
          <button fex-button variant="link" effect="underline">Link underline</button>
          <button fex-button variant="outline" effect="hover-underline">
            Outline hover underline
          </button>
          <button fex-button variant="outline" effect="underline">Outline underline</button>
          <button fex-button variant="destructive" [loading]="true">Destructive loading</button>
          <button fex-button [loading]="true" iconPlacement="end">Loading with icon</button>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Disabled</h2>
        <div class="flex flex-wrap gap-3">
          <button fex-button disabled>Disabled</button>
          <button fex-button disabled variant="outline">Disabled outline</button>
        </div>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  protected variants = [
    "default",
    "outline",
    "secondary",
    "ghost",
    "destructive",
    "link",
    "dashed",
  ] as const;
  protected sizes = ["xs", "sm", "default", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] as const;
  protected effects = [
    "expand-icon",
    "ring-hover",
    "shine",
    "shine-hover",
    "gooey-left",
    "gooey-right",
    "gradient-slide-show",
  ] as const;
}
