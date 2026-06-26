import base from '@fex/config-oxc/oxlint/base'
import react from '@fex/config-oxc/oxlint/react'
export default { ...base, ...react, rules: { ...base.rules, ...react.rules } }
