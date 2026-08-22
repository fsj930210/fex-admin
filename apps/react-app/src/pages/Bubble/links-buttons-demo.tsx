import { Bubble, BubbleContent } from '@fex-design/react/primitive/bubble'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'
export function LinksButtonsDemo() { return <Card title="Links and buttons" description="BubbleContent render keeps the bubble surface while callers choose the actual interactive element."><div className="grid gap-2"><Bubble><BubbleContent render={({ props }) => <Button {...props} variant="secondary">I forgot my password</Button>} /></Bubble><Bubble><BubbleContent render={({ props }) => <a {...props} href="#subscription">I need help with my subscription</a>} /></Bubble></div></Card> }
