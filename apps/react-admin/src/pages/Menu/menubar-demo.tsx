import * as Dropdown from '@fex-design/react/primitive/dropdown'
import { MenuDivider, MenuItem, MenuList, MenuRoot } from '@fex-design/react/primitive/menu'
import * as Popover from '@fex-design/react/primitive/popover'
import { menuShortcutClassName, menubarClassName, menubarTriggerClassName, popupClassName, verticalItemClassName, verticalListClassName } from './demo-styles'

type Command = { label?: string; shortcut?: string; disabled?: boolean; divider?: boolean }
const menus: Record<string, Command[]> = {
  File: [{ label: 'New Tab', shortcut: '⌘T' }, { label: 'New Window', shortcut: '⌘N' }, { divider: true }, { label: 'Share' }, { label: 'Print…', shortcut: '⌘P' }],
  Edit: [{ label: 'Undo', shortcut: '⌘Z' }, { label: 'Redo', shortcut: '⇧⌘Z' }, { divider: true }, { label: 'Cut' }, { label: 'Copy' }, { label: 'Paste' }],
  View: [{ label: 'Always Show Bookmarks Bar' }, { label: 'Always Show Full URLs', disabled: true }, { divider: true }, { label: 'Reload', shortcut: '⌘R' }, { label: 'Toggle Fullscreen' }],
  Profiles: [{ label: 'Andy' }, { label: 'Benoit' }, { label: 'Luis' }, { divider: true }, { label: 'Edit…' }, { label: 'Add Profile…' }],
}

function CommandMenu({ name }: { name: string }) {
  return <Popover.PopoverRoot trigger={['click']} side="bottom" align="start"><Popover.PopoverTrigger>{(trigger) => <MenuItem value={name} submenu>{({ props }) => <button {...props} {...trigger} className={menubarTriggerClassName}>{name}</button>}</MenuItem>}</Popover.PopoverTrigger><Popover.PopoverPortal><Dropdown.DropdownContent className={popupClassName}><MenuList orientation="vertical" parentValue={name} className={verticalListClassName}>{menus[name].map((item, index) => item.divider ? <MenuDivider key={index} className="my-1 h-px bg-border" /> : <MenuItem key={item.label} value={`${name}-${item.label}`} disabled={item.disabled} className={verticalItemClassName}><span className="flex-1">{item.label}</span>{item.shortcut ? <span className={menuShortcutClassName}>{item.shortcut}</span> : null}</MenuItem>)}</MenuList></Dropdown.DropdownContent></Popover.PopoverPortal></Popover.PopoverRoot>
}

export function MenubarDemo() {
  return <MenuRoot role="menubar" aria-label="Editor commands" className={menubarClassName}><MenuList orientation="horizontal" className="flex items-center">{Object.keys(menus).map((name) => <CommandMenu key={name} name={name} />)}</MenuList></MenuRoot>
}
