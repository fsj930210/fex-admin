import { Link } from 'react-router'
import { AsyncDemos } from './async-demos'
import { BasicDemos } from './basic-demos'
import { SearchDemos } from './search-demos'

export function TreeSelectPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto grid w-full max-w-5xl gap-space-xl">
        <header className="space-y-space-sm">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link>
          <h1 className="text-2xl font-semibold">TreeSelect</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">由输入框、弹出层和树组合而成。搜索请求与结果渲染由使用方控制，示例覆盖同步搜索和真实服务端异步搜索。</p>
        </header>
        <div className="grid gap-space-xl"><BasicDemos /><SearchDemos /><AsyncDemos /></div>
      </div>
    </main>
  )
}
