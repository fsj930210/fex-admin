import base from '@fex/config-oxc/oxlint/base'
import svelte from '@fex/config-oxc/oxlint/svelte'
export default { ...base, ...svelte, rules: { ...base.rules, ...svelte.rules } }
