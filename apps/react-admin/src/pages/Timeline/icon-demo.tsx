import { CheckIcon } from '@fex/components-react/icon/check'
import { ClockIcon } from '@fex/components-react/icon/clock'
import { ErrorIcon } from '@fex/components-react/icon/error'
import { Timeline, TimelineContent, TimelineIndicator, TimelineItem } from '@fex/components-react/primitive/timeline'
import { Card } from '@fex/components-react/ui/card'

export function IconDemo() {
  return (
    <Card title="Custom icons" description="Indicators accept project icons or any caller-owned node.">
      <Timeline>
        <TimelineItem status="completed"><TimelineIndicator><CheckIcon /></TimelineIndicator><TimelineContent>Checks passed</TimelineContent></TimelineItem>
        <TimelineItem status="current"><TimelineIndicator><ClockIcon /></TimelineIndicator><TimelineContent>Processing</TimelineContent></TimelineItem>
        <TimelineItem status="error"><TimelineIndicator><ErrorIcon /></TimelineIndicator><TimelineContent>Deployment failed</TimelineContent></TimelineItem>
      </Timeline>
    </Card>
  )
}
