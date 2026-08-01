import {
  AutoCompleteContent,
  AutoCompleteList,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex/components-react/primitive/auto-complete'
import { Card } from '@fex/components-react/ui/card'
import { fieldNames, userSuggestions, type UserSuggestion } from './data'

export function CustomDemo() {
  return (
    <div className="grid gap-space-xl md:grid-cols-2">
      <Card
        title="Custom items and disabled suggestion"
        description="Original backend items drive richer rows; Alex is disabled."
      >
        <AutoCompleteRoot<UserSuggestion> items={userSuggestions} fieldNames={fieldNames}>
          <AutoCompleteTrigger placeholder="Custom suggestion rows" clearable status="warning" />
          <AutoCompleteContent>
            <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
              People directory
            </div>
            <AutoCompleteList
              renderItem={(item, state) => {
                const user = item as UserSuggestion
                return (
                  <div className="min-w-0">
                    <div className="truncate font-medium">{user.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
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
        <AutoCompleteRoot items={userSuggestions} fieldNames={fieldNames}>
          <AutoCompleteTrigger
            name="reviewer"
            required
            aria-describedby="reviewer-error"
            placeholder="Required reviewer"
            clearable
            invalid
            status="error"
          />
          <AutoCompleteContent />
        </AutoCompleteRoot>
        <p id="reviewer-error" className="mt-space-sm text-xs text-danger">
          Choose a reviewer or enter a new name.
        </p>
      </Card>
    </div>
  )
}
