import { Button as PrimitiveButton } from '@fex/components-react/primitive/button'
import { Card } from '@fex/components-react/ui/card'
import { Button } from '@fex/components-react/ui/button'
import { PlusIcon } from '@fex/components-react/icon/plus'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

const variants = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link', 'dashed'] as const
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

function DemoSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card title={title} description={description}>
      <div className="flex min-w-0 flex-wrap items-center gap-space-md">{children}</div>
    </Card>
  )
}

export function ButtonPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            返回首页
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Button</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              用于触发页面操作、表单提交和工具栏命令。示例覆盖样式、尺寸、加载、图标、效果、组合和禁用状态。
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <Card title="Primitive" description="按钮底层骨架与最小行为。">
            <div className="flex min-w-0 flex-wrap items-center gap-space-md">
              <PrimitiveButton>Primitive button</PrimitiveButton>
            </div>
          </Card>

          <Card title="Ui" description="面向业务的默认按钮封装。">
            <div className="flex min-w-0 flex-wrap items-center gap-space-md">
              {variants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
          </Card>

          <DemoSection title="Variants" description="按钮的基础视觉语义。">
            {variants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </DemoSection>

          <DemoSection title="Sizes" description="文本按钮和 icon-only 按钮尺寸。">
            {sizes.map((size) => (
              <Button key={size} size={size} aria-label={size.startsWith('icon') ? size : undefined}>
                {size.startsWith('icon') ? <PlusIcon /> : size}
              </Button>
            ))}
          </DemoSection>

          <DemoSection title="Loading" description="加载态会禁用按钮，loading icon 跟随 iconPlacement。">
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
            {effects.map((effect) => (
              <Button
                key={effect}
                effect={effect}
                icon={effect === 'expand-icon' ? <PlusIcon /> : undefined}
                iconPlacement="end"
              >
                {effect}
              </Button>
            ))}
          </DemoSection>

          <DemoSection title="Mixed Usage" description="不同 variant、icon、loading 和 effect 的组合。">
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
