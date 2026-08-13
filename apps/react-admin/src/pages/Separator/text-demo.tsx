import { Separator } from '@fex-design/react/primitive/separator'
import { Card } from '@fex-design/react/ui/card'
const Labeled = ({
  label,
  placement,
}: {
  label: string
  placement: 'start' | 'center' | 'end'
}) => (
  <div className="flex items-center gap-space-md">
    <Separator
      className={placement === 'start' ? 'w-12' : placement === 'end' ? 'flex-1' : 'flex-1'}
    />
    <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
    <Separator className={placement === 'end' ? 'w-12' : 'flex-1'} />
  </div>
)
export const TextDemo = () => (
  <Card
    title="With Text"
    description="Compose a label between two separators and control its placement."
  >
    <div className="grid max-w-xl gap-space-xl">
      <Labeled label="Start" placement="start" />
      <Labeled label="Center" placement="center" />
      <Labeled label="End" placement="end" />
    </div>
  </Card>
)
