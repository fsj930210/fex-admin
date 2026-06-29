import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@fex/components-solid/primitive/empty'
import { Badge } from '@fex/components-solid/primitive/badge'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'


export function EmptyPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md"><A class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</A><h1 class="text-2xl font-semibold text-foreground">Empty</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">用于列表、搜索结果或过滤结果为空的场景。</p></header>
        <Card title="Primitive" description="覆盖媒体、标题、说明和内容 slot。"><Empty><EmptyHeader><EmptyMedia variant="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={2} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="m5.45 5.11-3.27 6A2 2 0 0 0 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-.18-.89l-3.27-6A2 2 0 0 0 16.79 4H7.21a2 2 0 0 0-1.76 1.11Z" /></svg></EmptyMedia><EmptyTitle>暂无审批任务</EmptyTitle><EmptyDescription>调整筛选条件后再试，或创建一条新的流程记录。</EmptyDescription></EmptyHeader><EmptyContent><Badge variant="outline">0 items</Badge></EmptyContent></Empty></Card>
      </div>
    </main>
  )
}
