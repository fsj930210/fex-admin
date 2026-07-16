import { A } from '@solidjs/router'
import {
  Card as PrimitiveCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@fex/components-solid/primitive/card'
import Card from '@fex/components-solid/ui/card'
import { createMemo, createSignal } from 'solid-js'

type SpacingOption = {
  label: string
  value: 'sm' | 'md' | 'lg' | 'custom'
  size: 'sm' | 'md' | 'lg'
  rootStyle?: { '--card-spacing': string }
}

const defaultSpacingOption: SpacingOption = { label: 'md', value: 'md', size: 'md' }

const spacingOptions: SpacingOption[] = [
  { label: 'sm', value: 'sm', size: 'sm' },
  defaultSpacingOption,
  { label: 'lg', value: 'lg', size: 'lg' },
  { label: '40px', value: 'custom', size: 'md', rootStyle: { '--card-spacing': '40px' } },
]

export function CardPage() {
  const [spacing, setSpacing] = createSignal<SpacingOption['value']>('md')
  const selectedSpacing = createMemo(
    () => spacingOptions.find((option) => option.value === spacing()) ?? defaultSpacingOption,
  )

  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            返回首页
          </A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Card</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              用于承载相关内容、示例分组和管理后台中的紧凑信息块。
            </p>
          </div>
        </header>

        <div class="space-y-space-xl">
          <Card title="Primitive" description="卡片底层结构与 slot 语义。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <PrimitiveCard class="w-full">
                <CardHeader class="border-b border-border">
                  <CardTitle>Primitive card</CardTitle>
                  <CardDescription>底层结构展示。</CardDescription>
                </CardHeader>
                <CardContent>Content</CardContent>
              </PrimitiveCard>
            </div>
          </Card>

          <Card title="Ui" description="面向业务的默认卡片封装。">
            <div class="flex min-w-0 flex-wrap items-center gap-space-md">
              <Card title="Basic" description="包含标题、描述和内容区域。">
                <p class="text-sm leading-6 text-foreground">
                  Card 默认使用系统边框、背景、圆角和 spacing token。
                </p>
              </Card>
            </div>
          </Card>

          <Card title="Basic" description="包含标题、描述和内容区域的标准卡片结构。">
            <p class="text-sm leading-6 text-foreground">
              Card 默认使用系统边框、背景、圆角和 spacing token，适合作为组件示例页的基础展示容器。
            </p>
          </Card>

          <Card
            title="Spacing"
            description="size 提供 sm、md、lg 三档；不满足时覆盖 --card-spacing。"
          >
            <div class="flex flex-wrap gap-space-sm">
              {spacingOptions.map((option) => (
                <button
                  class={[
                    'rounded-md border px-space-lg py-space-xs text-sm transition-colors',
                    spacing() === option.value
                      ? 'border-focus bg-muted-background text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted-background hover:text-foreground',
                  ].join(' ')}
                  type="button"
                  onClick={() => setSpacing(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div class="mt-space-xl flex justify-center">
              <Card
                size={selectedSpacing().size}
                title="Login to your account"
                description="Enter your email below to login to your account"
                footer={
                  <div class="grid w-full gap-space-md">
                    <div class="rounded-md bg-foreground px-space-lg py-space-sm text-center text-sm font-medium text-background">
                      Login
                    </div>
                    <div class="rounded-md border border-border bg-background px-space-lg py-space-sm text-center text-sm font-medium text-foreground">
                      Login with Google
                    </div>
                  </div>
                }
                class={{ root: 'w-full max-w-md' }}
                style={{ root: selectedSpacing().rootStyle ?? {} }}
              >
                <div class="grid gap-space-lg">
                  <div class="grid gap-space-sm">
                    <div class="text-sm font-medium text-foreground">Email</div>
                    <div class="h-9 rounded-md border border-border bg-background px-space-lg py-space-sm text-sm text-muted-foreground">
                      m@example.com
                    </div>
                  </div>
                  <div class="grid gap-space-sm">
                    <div class="flex items-center justify-between gap-space-md text-sm font-medium text-foreground">
                      <span>Password</span>
                      <span class="font-normal text-muted-foreground">Forgot your password?</span>
                    </div>
                    <div class="h-9 rounded-md border border-border bg-background" />
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          <Card
            title="With Footer"
            description="需要底部操作区时使用 footer。"
            footer={<span class="text-sm text-muted-foreground">Footer content</span>}
          >
            <p class="text-sm leading-6 text-muted-foreground">
              Header、Content 和 Footer 分别维护自己的 padding，组合时保持一致的信息密度。
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}
