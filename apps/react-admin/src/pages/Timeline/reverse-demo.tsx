import { Timeline, TimelineContent, TimelineIndicator, TimelineItem } from '@fex-design/react/primitive/timeline'
import { Card } from '@fex-design/react/ui/card'

export function ReverseDemo() {
  return (
    <Card title="Reverse and connector status" description="Reverse changes visual order; connector status can differ from its item.">
      <Timeline reverse>
        <TimelineItem status="completed"><TimelineIndicator /><TimelineContent>Created</TimelineContent></TimelineItem>
        <TimelineItem status="completed" connectorStatus="current"><TimelineIndicator /><TimelineContent>Reviewed</TimelineContent></TimelineItem>
        <TimelineItem status="current"><TimelineIndicator /><TimelineContent>Published first visually</TimelineContent></TimelineItem>
      </Timeline>
    </Card>
  )
}
