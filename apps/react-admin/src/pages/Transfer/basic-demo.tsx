import { Transfer } from '@fex/components-react/primitive/transfer'
import { useState } from 'react'
import { transferFieldNames, transferMembers } from './data'
import { TransferDemoSection } from './demo-section'

export function BasicTransferDemo() {
  const [targetKeys, setTargetKeys] = useState<readonly (string | number)[]>(['susan'])
  return (
    <TransferDemoSection
      title="Basic, controlled and uncontrolled"
      description="The first Transfer owns its target keys; the second exposes target keys and complete moved items through onChange meta."
    >
      <div className="grid gap-space-lg xl:grid-cols-2">
        <section className="space-y-space-sm">
          <h3 className="text-sm font-medium">Uncontrolled</h3>
          <Transfer
            items={transferMembers}
            fieldNames={transferFieldNames}
            defaultTargetKeys={['grace']}
            title={{ source: 'Available', target: 'Assigned' }}
          />
        </section>
        <section className="space-y-space-sm">
          <h3 className="text-sm font-medium">Controlled</h3>
          <Transfer
            data-testid="controlled-transfer"
            items={transferMembers}
            fieldNames={transferFieldNames}
            targetKeys={targetKeys}
            onChange={(keys) => setTargetKeys(keys)}
            title={{ source: 'Team directory', target: 'Project team' }}
          />
          <p className="text-xs text-muted-foreground">
            Target keys: {targetKeys.join(', ') || 'none'}
          </p>
        </section>
      </div>
    </TransferDemoSection>
  )
}
