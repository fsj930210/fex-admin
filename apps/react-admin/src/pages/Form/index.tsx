import { Card } from '@fex/components-react/ui/card'
import { useState } from 'react'
import { Link } from 'react-router'
import { BasicValidationDemo } from './basic-validation-demo'
import { CoordinationDemo } from './coordination-demo'
import { DependencyDemo } from './dependency-demo'
import { DynamicNestedDemo } from './dynamic-nested-demo'
import { InstanceDemo } from './instance-demo'
import { LayoutDemo } from './layout-demo'
import { ScrollDemo } from './scroll-demo'

export function FormPage() {
  const [result, setResult] = useState('尚未提交')

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Form and Field primitives</h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Form 提供提交边界和 form 实例上下文；Field 是唯一字段状态入口。FieldRoot、Label、Control、Description 和 Error 只负责 DOM 语义、可访问性与结构。
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <BasicValidationDemo setResult={setResult} />
          <DependencyDemo setResult={setResult} />
          <LayoutDemo />
          <InstanceDemo />
          <DynamicNestedDemo setResult={setResult} />
          <CoordinationDemo setResult={setResult} />
          <ScrollDemo setResult={setResult} />
          <Card title="Latest result">
            <pre className="overflow-auto rounded-md bg-muted p-3 text-sm text-muted-foreground">{result}</pre>
          </Card>
        </div>
      </div>
    </main>
  )
}
