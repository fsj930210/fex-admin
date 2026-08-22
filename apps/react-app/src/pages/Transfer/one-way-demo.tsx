import { ChevronRightIcon } from '@fex-design/react/icon/chevron'
import { TrashIcon } from '@fex-design/react/icon/trash'
import { SwitchRoot, SwitchThumb } from '@fex-design/react/primitive/switch'
import {
  TransferActions,
  useTransfer,
  type TransferPanelRenderApi,
} from '@fex-design/react/primitive/transfer'
import { Button } from '@fex-design/react/ui/button'
import { Transfer } from '@fex-design/react/primitive/transfer'
import { useState } from 'react'
import { transferFieldNames, transferMembers, type TransferMember } from './data'
import { TransferDemoSection } from './demo-section'

function OneWayTarget({ panel }: { panel: TransferPanelRenderApi<TransferMember> }) {
  const { controller, disabled } = useTransfer<TransferMember>()
  return (
    <div className="space-y-1">
      {panel.items.map((item) => (
        <div key={item.id} className="flex min-h-8 items-center gap-2 px-2 text-sm">
          <span className="min-w-0 flex-1 truncate">{item.name}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Remove ${item.name}`}
            disabled={disabled || item.disabled === true}
            onClick={() => {
              controller.setTargetCheckedKeys([item.id])
              controller.moveToSource()
            }}
          >
            <TrashIcon />
          </Button>
        </div>
      ))}
    </div>
  )
}

export function OneWayTransferDemo() {
  const [disabled, setDisabled] = useState(false)
  return (
    <TransferDemoSection
      title="One-way composition"
      description="A custom action area only moves records to the target; target rows remove themselves through the same Transfer controller."
    >
      <div className="space-y-space-md">
        <Transfer
          data-testid="one-way-transfer"
          items={transferMembers}
          fieldNames={transferFieldNames}
          defaultTargetKeys={['susan', 'katherine']}
          disabled={disabled}
          title={{ source: 'Source', target: 'Target' }}
          actions={
            <TransferActions>
              {(api) => (
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Move selected to target"
                  disabled={!api.canMoveToTarget}
                  onClick={api.moveToTarget}
                >
                  <ChevronRightIcon />
                </Button>
              )}
            </TransferActions>
          }
          panels={{
            target: {
              header: (panel) => (
                <>
                  <span className="font-medium">Target</span>
                  <span className="ml-auto text-muted-foreground">{panel.items.length} items</span>
                </>
              ),
              body: (panel) => <OneWayTarget panel={panel} />,
            },
          }}
        />
        <label className="flex w-fit items-center gap-2 text-sm text-muted-foreground">
          <SwitchRoot
            checked={disabled}
            onCheckedChange={setDisabled}
            aria-label="Disable one-way Transfer"
          >
            <SwitchThumb />
          </SwitchRoot>
          Disabled
        </label>
      </div>
    </TransferDemoSection>
  )
}
