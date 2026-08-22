import { DemoCascader } from './demo-cascader';import { DemoSection } from './demo-section';import { regionOptions } from './data'
export function BasicDemo(){return <DemoSection title="Basic" description="Select a leaf from columns with disabled-node handling and project Scrollbar tracks."><DemoCascader options={regionOptions}/></DemoSection>}
