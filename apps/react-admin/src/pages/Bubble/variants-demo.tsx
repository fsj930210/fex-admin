import { Bubble,BubbleContent } from '@fex-design/react/primitive/bubble';import { Card } from '@fex-design/react/ui/card'
const variants=['solid','soft','outline','plain','danger'] as const
export function VariantsDemo(){return <Card title="Variants and rich content" description="Visual treatment stays independent from sender role and content remains fully composable."><div className="grid gap-3">{variants.map(variant=><Bubble key={variant} variant={variant}><BubbleContent><strong>{variant}</strong> — arbitrary text, code, links, or custom content.</BubbleContent></Bubble>)}</div></Card>}
