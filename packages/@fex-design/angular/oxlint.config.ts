import angular from '@fex/config-oxc/oxlint/angular'
import base from '@fex/config-oxc/oxlint/base'
export default { ...base, ...angular, rules: { ...base.rules, ...angular.rules } }
