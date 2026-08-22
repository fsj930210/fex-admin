import { Separator } from '@fex-design/react/primitive/separator'
import { Card } from '@fex-design/react/ui/card'
export const MenuDemo = () => (
  <Card title="Menu" description="Divide groups without splitting related menu items.">
    <div className="grid max-w-sm gap-space-sm">
      <div>
        <div className="font-medium">Settings</div>
        <div className="text-sm text-muted-foreground">Manage preferences</div>
      </div>
      <div>
        <div className="font-medium">Account</div>
        <div className="text-sm text-muted-foreground">Profile and security</div>
      </div>
      <Separator />
      <div>
        <div className="font-medium">Sign out</div>
        <div className="text-sm text-muted-foreground">End the current session</div>
      </div>
    </div>
  </Card>
)
