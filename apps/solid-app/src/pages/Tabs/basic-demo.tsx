import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex-design/solid/primitive/tabs'
import { Card } from '@fex-design/solid/ui/card'
export function BasicTabsDemo() {
  return (
    <Card
      title="Primitive"
      description="Without value or defaultValue, the first enabled Item is selected."
    >
      <TabsRoot>
        <TabsList>
          <TabsItem value="overview">Overview</TabsItem>
          <TabsItem value="analytics">Analytics</TabsItem>
          <TabsItem value="disabled" disabled>
            Disabled
          </TabsItem>
        </TabsList>
        <TabsContent value="overview">Overview content is mounted initially.</TabsContent>
        <TabsContent value="analytics">
          Analytics mounts on first visit and remains mounted.
        </TabsContent>
        <TabsContent value="disabled">Disabled content.</TabsContent>
      </TabsRoot>
    </Card>
  )
}
