import{regionOptions}from'./data';import{DemoCascader}from'./demo-cascader';import{DemoSection}from'./demo-section'
export function HoverDemo(){return <DemoSection title="Hover expansion" description="Move across columns to expand without losing each column's project Scrollbar position."><DemoCascader expandTrigger="hover" options={regionOptions}/></DemoSection>}
