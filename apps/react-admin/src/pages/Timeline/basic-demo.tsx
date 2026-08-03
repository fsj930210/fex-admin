import {
  Timeline,
  TimelineContent,
  TimelineIndicator,
  TimelineItem,
  TimelineOpposite,
} from '@fex/components-react/primitive/timeline'
import { Card } from '@fex/components-react/ui/card'

export function BasicDemo() {
  return (
    <Card title="Basic" description="A semantic ordered list with content, time and connecting lines.">
      <Timeline aria-label="Release history">
        <TimelineItem status="completed">
          <TimelineOpposite>09:00</TimelineOpposite><TimelineIndicator />
          <TimelineContent><strong>Build completed</strong><p className="text-muted-foreground">Artifacts are ready.</p></TimelineContent>
        </TimelineItem>
        <TimelineItem status="current">
          <TimelineOpposite>09:20</TimelineOpposite><TimelineIndicator />
          <TimelineContent><strong>Deploying</strong><p className="text-muted-foreground">Rolling out to production.</p></TimelineContent>
        </TimelineItem>
        <TimelineItem status="pending">
          <TimelineOpposite>Next</TimelineOpposite><TimelineIndicator />
          <TimelineContent><strong>Verification</strong><p className="text-muted-foreground">Waiting for deployment.</p></TimelineContent>
        </TimelineItem>
      </Timeline>
    </Card>
  )
}
