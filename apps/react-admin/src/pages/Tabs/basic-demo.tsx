import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex-design/react/primitive/tabs'
import { Card } from '@fex-design/react/ui/card'

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
          Analytics mounts on first visit and remains in the DOM afterwards.
        </TabsContent>
        <TabsContent value="disabled">Disabled content.</TabsContent>
      </TabsRoot>
    </Card>
  )
}
