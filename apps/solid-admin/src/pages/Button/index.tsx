import { A } from '@solidjs/router'
import { Button as PrimitiveButton } from '@fex/components-solid/primitive/button'
import { Button } from '@fex/components-solid/ui/button'
import { Card } from '@fex/components-solid/ui/card'
import { PlusIcon } from '@fex/components-solid/icon/plus'
import { For, type JSX, type ParentProps } from 'solid-js'

const variants = [
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
  'dashed',
] as const
const sizes = ['xs', 'sm', 'default', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const
const effects = [
  'expand-icon',
  'ring-hover',
  'shine',
  'shine-hover',
  'gooey-left',
  'gooey-right',
  'gradient-slide-show',
] as const

function DemoSection(props: ParentProps<{ title: string; description: string }>) {
  return (
    <Card title={props.title} description={props.description}>
      <div class="flex min-w-0 flex-wrap items-center gap-space-md">{props.children}</div>
    </Card>
  )
}

export function ButtonPage(): JSX.Element {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            返回首页
          </A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Button</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              用于触发页面操作、表单提交和工具栏命令。示例覆盖样式、尺寸、加载、图标、效果、组合和禁用状态。
            </p>
          </div>
        </header>

        <div class="space-y-space-xl">
          <Card title="Primitive" description="按钮底层骨架与最小行为。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <PrimitiveButton>Primitive button</PrimitiveButton>
            </div>
          </Card>

          <Card title="Ui" description="面向业务的默认按钮封装。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <For each={variants}>{(variant) => <Button variant={variant}>{variant}</Button>}</For>
            </div>
          </Card>

          <DemoSection title="Variants" description="按钮的基础视觉语义。">
            <For each={variants}>{(variant) => <Button variant={variant}>{variant}</Button>}</For>
          </DemoSection>

          <DemoSection title="Sizes" description="文本按钮和 icon-only 按钮尺寸。">
            <For each={sizes}>
              {(size) => (
                <Button size={size} aria-label={size.startsWith('icon') ? size : undefined}>
                  {size.startsWith('icon') ? <PlusIcon /> : size}
                </Button>
              )}
            </For>
          </DemoSection>

          <DemoSection
            title="Loading"
            description="加载态会禁用按钮，loading icon 跟随 iconPlacement。"
          >
            <Button loading>Loading start</Button>
            <Button loading iconPlacement="end">
              Loading end
            </Button>
          </DemoSection>

          <DemoSection title="Icon" description="业务图标可放在文字前或文字后。">
            <Button icon={<PlusIcon />}>Icon start</Button>
            <Button icon={<PlusIcon />} iconPlacement="end">
              Icon end
            </Button>
          </DemoSection>

          <DemoSection title="Effects" description="单独展示适合基础按钮使用的视觉效果。">
            <For each={effects}>
              {(effect) => (
                <Button
                  effect={effect}
                  icon={effect === 'expand-icon' ? <PlusIcon /> : undefined}
                  iconPlacement="end"
                >
                  {effect}
                </Button>
              )}
            </For>
          </DemoSection>

          <DemoSection
            title="Mixed Usage"
            description="不同 variant、icon、loading 和 effect 的组合。"
          >
            <Button effect="expand-icon" icon={<PlusIcon />} iconPlacement="end">
              Icon right
            </Button>
            <Button effect="expand-icon" icon={<PlusIcon />}>
              Icon left
            </Button>
            <Button variant="secondary" effect="gooey-left">
              Secondary gooey left
            </Button>
            <Button variant="destructive" effect="gooey-right">
              Destructive gooey right
            </Button>
            <Button variant="destructive" effect="shine">
              Destructive shine
            </Button>
            <Button variant="outline" effect="ring-hover">
              Outline ring hover
            </Button>
            <Button variant="link" effect="hover-underline">
              Link hover underline
            </Button>
            <Button variant="link" effect="underline">
              Link underline
            </Button>
            <Button variant="outline" effect="hover-underline">
              Outline hover underline
            </Button>
            <Button variant="outline" effect="underline">
              Outline underline
            </Button>
            <Button variant="destructive" loading>
              Destructive loading
            </Button>
            <Button loading iconPlacement="end">
              Loading with icon
            </Button>
          </DemoSection>

          <DemoSection title="Disabled" description="禁用态和不同 variant 的组合。">
            <Button disabled>Disabled</Button>
            <Button disabled variant="outline">
              Disabled outline
            </Button>
          </DemoSection>
        </div>
      </div>
    </main>
  )
}
