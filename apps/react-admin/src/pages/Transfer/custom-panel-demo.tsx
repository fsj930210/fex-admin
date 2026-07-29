import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-react/icon/chevron'
import { TransferActions } from '@fex/components-react/primitive/transfer'
import { Transfer } from '@fex/components-react/primitive/transfer'
import { Badge } from '@fex/components-react/ui/badge'
import { Button } from '@fex/components-react/ui/button'
import { transferFieldNames, transferMembers } from './data'
import { TransferDemoSection } from './demo-section'

export function CustomPanelTransferDemo() {
  return (
    <TransferDemoSection title="Custom panel regions" description="Source and target headers, bodies and optional footers are configured independently while the panel structure remains built in.">
      <Transfer
        items={transferMembers}
        fieldNames={transferFieldNames}
        defaultTargetKeys={['ada', 'susan']}
        actions={(
          <TransferActions className="flex flex-col items-center gap-2">
            {(api) => (
              <>
                <Button variant="outline" size="sm" icon={<ChevronRightIcon />} iconPlacement="end" disabled={!api.canMoveToTarget} onClick={api.moveToTarget}>Assign</Button>
                <Button variant="outline" size="sm" icon={<ChevronLeftIcon />} disabled={!api.canMoveToSource} onClick={api.moveToSource}>Remove</Button>
              </>
            )}
          </TransferActions>
        )}
        renderItem={(member) => <span>{member.name as string} <span className="text-muted-foreground">· {member.department as string}</span></span>}
        panels={{
          source: {
            header: (panel) => <><span className="font-medium">Candidate pool</span><Badge>{panel.items.length}</Badge></>,
            footer: <span className="text-muted-foreground">Disabled members stay in their current panel.</span>,
          },
          target: {
            header: (panel) => <><span className="font-medium text-primary">Delivery team</span><span className="ml-auto text-muted-foreground">{panel.items.length} members</span></>,
            footer: <span className="text-muted-foreground">Changes are applied when the form is submitted.</span>,
          },
        }}
      />
    </TransferDemoSection>
  )
}
