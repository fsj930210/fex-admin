import { FieldGroup, FieldLabel, FieldRoot } from '@fex/components-react/primitive/field'
import { InputControl, InputRoot } from '@fex/components-react/primitive/input'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { selectClassName } from './shared'

export function LayoutDemo() {
  return (
    <Card title="Field structure and primitive layouts" description="布局属于 Field 的 DOM 结构能力，不是 Form 的 labelCol/wrapperCol 配置；UI 层以后只组合这些 primitive。">
      <FieldGroup>
        <FieldRoot orientation="vertical"><FieldLabel>Vertical</FieldLabel><InputRoot value=""><InputControl placeholder="标签在上方" /></InputRoot></FieldRoot>
        <FieldRoot orientation="horizontal"><FieldLabel>Horizontal</FieldLabel><InputRoot value=""><InputControl placeholder="标签按内容宽度排列" /></InputRoot></FieldRoot>
        <FieldRoot orientation="responsive"><FieldLabel>Responsive</FieldLabel><InputRoot value=""><InputControl placeholder="窄屏纵向，变宽后横向" /></InputRoot></FieldRoot>
      </FieldGroup>
      <FieldGroup orientation="inline" className="mt-space-lg">
        <FieldRoot orientation="inline"><FieldLabel>关键字</FieldLabel><InputRoot value=""><InputControl className="w-48" placeholder="内联筛选" /></InputRoot></FieldRoot>
        <FieldRoot orientation="inline"><FieldLabel>状态</FieldLabel><select className={`${selectClassName} w-32`}><option>全部</option><option>启用</option></select></FieldRoot>
        <Button type="button" variant="outline">查询</Button>
      </FieldGroup>
    </Card>
  )
}
