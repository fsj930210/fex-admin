import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Button as PrimitiveButton } from "@fex/components-angular/primitive/button";
import { Button } from "@fex/components-angular/ui/button";
import Card from "@fex/components-angular/ui/card";

@Component({
  selector: "fex-button-page",
  imports: [PrimitiveButton, Button, Card, RouterLink],
  host: { class: "block" },
  template: `
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <a class="text-sm text-muted-foreground hover:text-foreground" routerLink="/">返回首页</a>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Button</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              用于触发页面操作、表单提交和工具栏命令。示例覆盖样式、尺寸、加载、图标、效果、组合和禁用状态。
            </p>
          </div>
        </header>

        <div class="space-y-space-xl">
          <fex-card title="Primitive" description="按钮底层骨架与最小行为。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <button fex-button-primitive>Primitive button</button>
            </div>
          </fex-card>

          <fex-card title="Ui" description="面向业务的默认按钮封装。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              @for (variant of variants; track variant) {
                <button fex-button [variant]="variant">{{ variant }}</button>
              }
            </div>
          </fex-card>

          <fex-card title="Variants" description="按钮的基础视觉语义。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              @for (variant of variants; track variant) {
                <button fex-button [variant]="variant">{{ variant }}</button>
              }
            </div>
          </fex-card>

          <fex-card title="Sizes" description="文本按钮和 icon-only 按钮尺寸。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
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
          </fex-card>

          <fex-card title="Loading" description="加载态会禁用按钮，loading icon 跟随 iconPlacement。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <button fex-button [loading]="true">Loading start</button>
              <button fex-button [loading]="true" iconPlacement="end">Loading end</button>
            </div>
          </fex-card>

          <fex-card title="Icon" description="业务图标可放在文字前或文字后。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
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
          </fex-card>

          <fex-card title="Effects" description="单独展示适合基础按钮使用的视觉效果。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
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
          </fex-card>

          <fex-card title="Mixed Usage" description="不同 variant、icon、loading 和 effect 的组合。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
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
          </fex-card>

          <fex-card title="Disabled" description="禁用态和不同 variant 的组合。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <button fex-button disabled>Disabled</button>
              <button fex-button disabled variant="outline">Disabled outline</button>
            </div>
          </fex-card>
        </div>
      </div>
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
