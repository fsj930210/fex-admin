import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex/components-react/primitive/tabs'
import { Card } from '@fex/components-react/ui/card'

export function VariantTabsDemo() {
  return <Card title="Variants" description="The segmented default and line variant share the same behavior."><div className="grid gap-space-xl"><TabsRoot defaultValue="one"><TabsList><TabsItem value="one">One</TabsItem><TabsItem value="two">Two</TabsItem></TabsList><TabsContent value="one">Default segmented tabs.</TabsContent><TabsContent value="two">Second default panel.</TabsContent></TabsRoot><TabsRoot defaultValue="one" variant="line"><TabsList><TabsItem value="one">One</TabsItem><TabsItem value="two">Two</TabsItem></TabsList><TabsContent value="one">Line variant content.</TabsContent><TabsContent value="two">Second line panel.</TabsContent></TabsRoot></div></Card>
}
