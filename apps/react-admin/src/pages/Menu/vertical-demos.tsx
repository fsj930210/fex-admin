import {
  MenuDivider,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuList,
  MenuRoot,
} from '@fex-design/react/primitive/menu'
import { useState } from 'react'
import {
  rootClassName,
  verticalItemClassName,
  verticalListClassName,
} from './demo-styles'

function Shell({ children }: { children: React.ReactNode }) {
  return <MenuRoot className={rootClassName}><MenuList className={verticalListClassName}>{children}</MenuList></MenuRoot>
}

function Item({ value, children, selected, disabled, onClick }: { value: string; children: React.ReactNode; selected?: boolean; disabled?: boolean; onClick?: () => void }) {
  return <MenuItem value={value} selected={selected} disabled={disabled} onClick={onClick} className={verticalItemClassName}>{children}</MenuItem>
}

export function BasicDemo() {
  const [systemOpen, setSystemOpen] = useState(true)
  const [selected, setSelected] = useState('dashboard')
  return <Shell>
    <Item value="dashboard" selected={selected === 'dashboard'} onClick={() => setSelected('dashboard')}>Dashboard</Item>
    <Item value="system" onClick={() => setSystemOpen((value) => !value)}><span className="flex-1">System</span><span>{systemOpen ? '−' : '+'}</span></Item>
    {systemOpen ? <div className="ml-5"><Item value="users" selected={selected === 'users'} onClick={() => setSelected('users')}>Users</Item><Item value="roles" selected={selected === 'roles'} onClick={() => setSelected('roles')}>Roles</Item><Item value="permissions" disabled>Permissions</Item></div> : null}
    <MenuDivider className="my-1 h-px bg-border" />
    <MenuGroup><MenuGroupLabel className="px-2 py-1 text-xs font-medium text-muted-foreground">Workspace</MenuGroupLabel><Item value="settings">Settings</Item><Item value="billing">Billing</Item></MenuGroup>
  </Shell>
}

export function ControlledDemo() {
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState('users')
  return <Shell><Item value="system" onClick={() => setOpen(!open)}><span className="flex-1">System</span><span>{open ? 'open' : 'closed'}</span></Item>{open ? <div className="ml-5"><Item value="users" selected={selected === 'users'} onClick={() => setSelected('users')}>Users</Item><Item value="roles" selected={selected === 'roles'} onClick={() => setSelected('roles')}>Roles</Item></div> : null}<div className="px-2 pt-2 text-xs text-muted-foreground">expanded: {String(open)} · selected: {selected}</div></Shell>
}

export function MultipleDemo() {
  const [selected, setSelected] = useState(() => new Set(['users', 'articles']))
  function toggle(value: string) { setSelected((current) => { const next = new Set(current); next.has(value) ? next.delete(value) : next.add(value); return next }) }
  return <Shell>{['users', 'roles', 'articles', 'comments'].map((value) => <Item key={value} value={value} selected={selected.has(value)} onClick={() => toggle(value)}><span className="flex-1 capitalize">{value}</span><span>{selected.has(value) ? '✓' : ''}</span></Item>)}</Shell>
}

export function SuffixDemo() {
  return <Shell><Item value="users"><span className="flex-1">Users</span><span className="text-xs text-muted-foreground">24</span></Item><Item value="comments"><span className="flex-1">Comments</span><span className="text-xs text-muted-foreground">8</span></Item><Item value="settings"><span className="flex-1">Settings</span><span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary">new</span></Item></Shell>
}

export function CustomItemDemo() {
  return <Shell><MenuItem value="profile">{({ props }) => <a {...props} href="#profile" className={verticalItemClassName}><span className="flex-1">Custom link item</span><span className="text-xs text-primary">open →</span></a>}</MenuItem><Item value="status"><span className="mr-2 size-2 rounded-full bg-success" /><span className="flex-1">Service status</span><span className="text-xs text-muted-foreground">Healthy</span></Item></Shell>
}
