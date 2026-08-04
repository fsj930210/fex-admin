import { DrawerBody, DrawerClose, DrawerContent, DrawerHeader, DrawerMask, DrawerPortal, DrawerRoot, DrawerTrigger } from '@fex-design/react/primitive/drawer'

export function BasicDemo() {
  return <DrawerRoot><DrawerTrigger>{(props) => <button {...props} className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Open drawer</button>}</DrawerTrigger><DrawerPortal><DrawerMask /><DrawerContent aria-label="Basic drawer"><DrawerHeader><span className="font-medium">Basic drawer</span><DrawerClose /></DrawerHeader><DrawerBody>Drawer content is composed from independent primitives.</DrawerBody></DrawerContent></DrawerPortal></DrawerRoot>
}
