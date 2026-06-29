import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@fex/components-react/primitive/pagination'
import { Card } from '@fex/components-react/ui/card'
import { Link } from 'react-router'

export function PaginationPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link>
          <h1 className="text-2xl font-semibold text-foreground">Pagination</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">分页结构只负责可访问语义和基础交互样式。</p>
        </header>

        <Card title="Primitive" description="上一页、页码、省略号和下一页组合。">
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#previous" text="上一页" /></PaginationItem>
              <PaginationItem><PaginationLink href="#1">1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#2" isActive>2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis /></PaginationItem>
              <PaginationItem><PaginationNext href="#next" text="下一页" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </Card>
      </div>
    </main>
  )
}
