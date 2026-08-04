import base from '@fex/config-oxc/oxlint/base'
import solid from '@fex/config-oxc/oxlint/solid'
export default { ...base, ...solid, rules: { ...base.rules, ...solid.rules } }
