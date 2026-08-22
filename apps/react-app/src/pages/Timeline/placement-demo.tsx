import { Timeline, TimelineContent, TimelineIndicator, TimelineItem } from '@fex-design/react/primitive/timeline'
import { Card } from '@fex-design/react/ui/card'

export function PlacementDemo() {
  return (
    <Card title="Per-item placement" description="Each item can override the root alignment for deliberately staggered layouts.">
      <Timeline align="alternate">
        <TimelineItem placement="start" status="completed"><TimelineIndicator /><TimelineContent>Start side</TimelineContent></TimelineItem>
        <TimelineItem placement="end" status="completed"><TimelineIndicator /><TimelineContent>End side</TimelineContent></TimelineItem>
        <TimelineItem placement="end" status="current"><TimelineIndicator /><TimelineContent>Another end-side item</TimelineContent></TimelineItem>
        <TimelineItem placement="start" status="pending"><TimelineIndicator /><TimelineContent>Back to start</TimelineContent></TimelineItem>
      </Timeline>
    </Card>
  )
}
