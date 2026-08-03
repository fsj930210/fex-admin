import { Timeline, TimelineContent, TimelineIndicator, TimelineItem } from '@fex/components-react/primitive/timeline'
import { Card } from '@fex/components-react/ui/card'

const statuses = ['completed', 'current', 'pending', 'error', 'disabled'] as const

export function StatusDemo() {
  return (
    <Card title="Built-in and custom status" description="Built-in statuses have defaults; custom values remain available through data-status.">
      <Timeline>
        {statuses.map((status) => <TimelineItem key={status} status={status}><TimelineIndicator /><TimelineContent className="capitalize">{status}</TimelineContent></TimelineItem>)}
        <TimelineItem status="reviewing" className="data-[status=reviewing]:text-violet-600">
          <TimelineIndicator className="border-violet-600 bg-violet-100 text-violet-700" />
          <TimelineContent>Custom: reviewing</TimelineContent>
        </TimelineItem>
      </Timeline>
    </Card>
  )
}
