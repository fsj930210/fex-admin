import {
  Card as PrimitiveCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@fex/components-react/primitive/card'
import Card from '@fex/components-react/ui/card'
import { Link } from 'react-router'

export function CardPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            返回首页
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Card</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              用于承载相关内容、示例分组和管理后台中的紧凑信息块。
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <Card title="Primitive" description="卡片底层结构与 slot 语义。">
            <div className="flex min-w-0 flex-wrap items-center gap-space-md">
              <PrimitiveCard className="w-full">
                <CardHeader className="border-b border-border">
                  <CardTitle>Primitive card</CardTitle>
                  <CardDescription>底层结构展示。</CardDescription>
                </CardHeader>
                <CardContent>Content</CardContent>
              </PrimitiveCard>
            </div>
          </Card>

          <Card title="Ui" description="面向业务的默认卡片封装。">
            <div className="flex min-w-0 flex-wrap items-center gap-space-md">
              <Card title="Basic" description="包含标题、描述和内容区域。">
                <p className="text-sm leading-6 text-foreground">Card 默认使用系统边框、背景、圆角和 spacing token。</p>
              </Card>
            </div>
          </Card>

          <Card title="Basic" description="包含标题、描述和内容区域的标准卡片结构。">
            <p className="text-sm leading-6 text-foreground">
              Card 默认使用系统边框、背景、圆角和 spacing token，适合作为组件示例页的基础展示容器。
            </p>
          </Card>

          <Card
            title="With Footer"
            description="需要底部操作区时使用 footer。"
            footer={<span className="text-sm text-muted-foreground">Footer content</span>}
          >
              <p className="text-sm leading-6 text-muted-foreground">
                Header、Content 和 Footer 分别维护自己的 padding，组合时保持一致的信息密度。
              </p>
          </Card>
        </div>
      </div>
    </main>
  )
}
