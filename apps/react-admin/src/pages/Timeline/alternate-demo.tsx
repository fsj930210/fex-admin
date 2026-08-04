import { Timeline, TimelineContent, TimelineIndicator, TimelineItem, TimelineOpposite } from '@fex-design/react/primitive/timeline'
import { Card } from '@fex-design/react/ui/card'

export function AlternateDemo() {
  return (
    <Card title="Alternate" description="Items automatically alternate around a centered vertical axis.">
      <Timeline align="alternate">
        {['Project created', 'Design approved', 'Implementation finished', 'Release'].map((label, index) => (
          <TimelineItem key={label} status={index < 3 ? 'completed' : 'current'}>
            <TimelineOpposite>Day {index + 1}</TimelineOpposite><TimelineIndicator /><TimelineContent>{label}</TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  )
}
