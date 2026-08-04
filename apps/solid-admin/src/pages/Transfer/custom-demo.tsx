import { ChevronLeftIcon, ChevronRightIcon } from '@fex-design/solid/icon/chevron'
import { Transfer } from '@fex-design/solid/primitive/transfer'
import { Badge } from '@fex-design/solid/ui/badge'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'
import { fieldNames, members } from './data'
export function CustomDemo() {
  return (
    <Card
      title="Custom panel regions"
      description="Source and target headers, bodies and optional footers are configured independently while the panel structure remains built in."
    >
      <Transfer
        items={members}
        fieldNames={fieldNames}
        defaultTargetKeys={['ada', 'susan']}
        actions={(controller, snapshot) => (
          <div class="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!snapshot.sourceCheckedKeys.length}
              onClick={controller.moveToTarget}
            >
              Assign <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!snapshot.targetCheckedKeys.length}
              onClick={controller.moveToSource}
            >
              <ChevronLeftIcon /> Remove
            </Button>
          </div>
        )}
        renderItem={(item) => (
          <>
            {item.name} <span class="text-muted-foreground">· {item.department}</span>
          </>
        )}
        panels={{
          source: {
            header: (api) => (
              <>
                <span class="font-medium">Candidate pool</span>
                <Badge>{api.items.length}</Badge>
              </>
            ),
            footer: () => (
              <span class="text-muted-foreground">
                Disabled members stay in their current panel.
              </span>
            ),
          },
          target: {
            header: (api) => (
              <>
                <span class="font-medium text-primary">Delivery team</span>
                <span class="ml-auto text-muted-foreground">{api.items.length} members</span>
              </>
            ),
            footer: () => (
              <span class="text-muted-foreground">
                Changes are applied when the form is submitted.
              </span>
            ),
          },
        }}
      />
    </Card>
  )
}
