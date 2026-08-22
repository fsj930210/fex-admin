import type { CascaderRootProps } from '@fex-design/react/primitive/cascader'
import { CascaderContent,CascaderPanel,CascaderRoot,CascaderTrigger } from '@fex-design/react/primitive/cascader'
export function DemoCascader(props:CascaderRootProps){return <CascaderRoot clearable placeholder="请选择地区" {...props}><CascaderTrigger/><CascaderContent><CascaderPanel/></CascaderContent></CascaderRoot>}
