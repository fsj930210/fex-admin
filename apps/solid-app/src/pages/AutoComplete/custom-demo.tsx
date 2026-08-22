import {
  AutoCompleteContent,
  AutoCompleteList,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/solid/primitive/auto-complete'
import Card from '@fex-design/solid/ui/card'
import { fieldNames, users, type UserSuggestion } from './data'

export function CustomDemo() {
  return (
    <div class="grid gap-space-xl md:grid-cols-2">
      <Card
        title="Custom items and disabled suggestion"
        description="Original backend items drive richer rows; Alex is disabled."
      >
        <AutoCompleteRoot items={users} fieldNames={fieldNames}>
          <AutoCompleteTrigger placeholder="Custom suggestion rows" clearable status="warning" />
          <AutoCompleteContent>
            <div class="border-b border-border px-3 py-2 text-xs text-muted-foreground">
              People directory
            </div>
            <AutoCompleteList
              item={(item, state) => {
                const user = item as unknown as UserSuggestion
                return (
                  <div>
                    <div class="font-medium">{user.name}</div>
                    <div class="text-xs text-muted-foreground">
                      {user.department} · {user.email}
                      {state.disabled ? ' · unavailable' : ''}
                    </div>
                  </div>
                )
              }}
            />
          </AutoCompleteContent>
        </AutoCompleteRoot>
      </Card>
      <Card
        title="Validation and native props"
        description="Input validation styles and native form attributes are preserved."
      >
        <AutoCompleteRoot items={users} fieldNames={fieldNames}>
          <AutoCompleteTrigger
            name="reviewer"
            required
            aria-describedby="reviewer-error-solid"
            placeholder="Required reviewer"
            clearable
            invalid
            status="error"
          />
          <AutoCompleteContent />
        </AutoCompleteRoot>
        <p id="reviewer-error-solid" class="mt-space-sm text-xs text-danger">
          Choose a reviewer or enter a new name.
        </p>
      </Card>
    </div>
  )
}
