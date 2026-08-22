import { Timeline, TimelineContent, TimelineIndicator, TimelineItem, TimelineOpposite } from '@fex-design/react/primitive/timeline'
import { Card } from '@fex-design/react/ui/card'

export function HorizontalDemo() {
  return (
    <Card title="Horizontal" description="The same anatomy creates a horizontally scrollable timeline.">
      <Timeline orientation="horizontal" aria-label="Order progress">
        {['Ordered', 'Paid', 'Shipped', 'Delivered'].map((label, index) => (
          <TimelineItem key={label} status={index < 2 ? 'completed' : index === 2 ? 'current' : 'pending'}>
            <TimelineOpposite>Step {index + 1}</TimelineOpposite><TimelineIndicator /><TimelineContent>{label}</TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  )
}
