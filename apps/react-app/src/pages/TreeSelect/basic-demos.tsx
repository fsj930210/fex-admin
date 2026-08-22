import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
import { departmentTreeData } from '../Tree/data'
import { DemoTreeSelect } from './demo-shell'

export function BasicDemos() {
  const [controlled, setControlled] = useState<string | number>('platform')
  return (
    <>
      <Card title="非受控" description="只读输入框聚焦后打开树，选择节点后回填标签，并支持清除。">
        <DemoTreeSelect treeData={departmentTreeData} defaultValue="frontend" />
      </Card>
      <Card title="受控与回显" description="由应用管理选中值，TreeSelect 负责解析并显示已注册节点的标签。">
        <DemoTreeSelect treeData={departmentTreeData} value={controlled} onChange={(value) => setControlled(value as string | number)} />
        <p className="mt-space-sm text-sm text-muted-foreground">当前值：{controlled}</p>
      </Card>
      <Card title="多选与选中反馈" description="多选时建议使用复选框反馈，使用方也可以完全自定义选中状态的展示。">
        <DemoTreeSelect treeData={departmentTreeData} multiple defaultValue={['frontend', 'research']} />
      </Card>
    </>
  )
}
