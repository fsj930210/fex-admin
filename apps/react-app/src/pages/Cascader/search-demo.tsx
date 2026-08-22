import{regionOptions}from'./data';import{DemoCascader}from'./demo-cascader';import{DemoSection}from'./demo-section'
export function SearchDemo(){return <DemoSection title="Full-path search" description="Search traverses every depth; try 浙江, 杭州, 西湖, 工业园区, 娄葑街道, or 苏州 娄葑."><DemoCascader showSearch options={regionOptions}/></DemoSection>}
