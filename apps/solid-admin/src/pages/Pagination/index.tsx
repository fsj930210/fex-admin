import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@fex/components-solid/primitive/pagination'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'


export function PaginationPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md"><A class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</A><h1 class="text-2xl font-semibold text-foreground">Pagination</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">分页结构只负责可访问语义和基础交互样式。</p></header>
        <Card title="Primitive" description="上一页、页码、省略号和下一页组合。"><Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#previous" text="上一页" /></PaginationItem><PaginationItem><PaginationLink href="#1">1</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="#2" isActive>2</PaginationLink></PaginationItem><PaginationItem><PaginationEllipsis /></PaginationItem><PaginationItem><PaginationNext href="#next" text="下一页" /></PaginationItem></PaginationContent></Pagination></Card>
      </div>
    </main>
  )
}
