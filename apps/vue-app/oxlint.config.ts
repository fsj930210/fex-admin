import base from '@fex/config-oxc/oxlint/base'
import vue from '@fex/config-oxc/oxlint/vue'
export default { ...base, ...vue, rules: { ...base.rules, ...vue.rules } }
