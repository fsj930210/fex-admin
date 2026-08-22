import { CheckIcon } from '@fex-design/react/icon/check'
import { ClockIcon } from '@fex-design/react/icon/clock'
import { Timeline, TimelineContent, TimelineIndicator, TimelineItem, TimelineOpposite } from '@fex-design/react/primitive/timeline'
import { Badge } from '@fex-design/react/primitive/badge'
import { Card } from '@fex-design/react/ui/card'

export function CustomNodeDemo() {
  return (
    <Card title="Custom node content" description="Content can compose existing components and indicators can use a larger custom surface.">
      <Timeline>
        <TimelineItem status="completed" className="[--timeline-indicator-size:2rem]">
          <TimelineOpposite className="flex items-center justify-end">Aug 2</TimelineOpposite>
          <TimelineIndicator className="!self-center shadow-sm"><CheckIcon /></TimelineIndicator>
          <TimelineContent className="rounded-md border border-border bg-background p-space-md shadow-sm">
            <div className="flex items-center gap-space-sm"><strong>Version 2.4 released</strong><Badge>Stable</Badge></div>
            <p className="mt-space-sm text-muted-foreground">Timeline primitives are now available.</p>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="reviewing" className="[--timeline-indicator-size:2.5rem]">
          <TimelineOpposite className="flex items-center justify-end">Aug 3</TimelineOpposite>
          <TimelineIndicator className="!self-center border-violet-600 bg-violet-100 text-violet-700 shadow-sm">
            <ClockIcon />
          </TimelineIndicator>
          <TimelineContent className="rounded-md border border-violet-200 bg-violet-50 p-space-md">
            <div className="flex items-center gap-space-sm"><strong>Design review</strong><Badge>Reviewing</Badge></div>
            <p className="mt-space-sm text-muted-foreground">The team is reviewing the horizontal layout.</p>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="pending" className="[--timeline-indicator-size:2rem]">
          <TimelineOpposite className="flex items-center justify-end">Next</TimelineOpposite>
          <TimelineIndicator className="!self-center border-dashed text-[10px] font-semibold">QA</TimelineIndicator>
          <TimelineContent className="rounded-md border border-dashed border-border p-space-md">
            <strong>Quality verification</strong>
            <p className="mt-space-sm text-muted-foreground">A fully custom text node marks the next milestone.</p>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Card>
  )
}
