<script setup lang="ts">
import {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldRequiredIndicator,
  FieldRoot,
  FieldSet,
  FieldTitle,
} from '@fex/components-vue/primitive/field'
import { Form as FormHost } from '@fex/components-vue/primitive/form'
import { InputControl, InputRoot } from '@fex/components-vue/primitive/input'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import { Checkbox } from '@fex/components-vue/ui/checkbox'
import { useFormDemoContext } from './form-demo-context'

const {
  accountValidators,
  cascadeForm,
  changeProvince,
  confirmValidators,
  contactEmailValidators,
  contactNameValidators,
  contactsForm,
  contactsValidators,
  createContact,
  deliveryAddressValidators,
  displayNameValidators,
  dynamicRuleForm,
  errors,
  invalid,
  instanceForm,
  instanceResult,
  locations,
  loginForm,
  loginPasswordValidators,
  newPasswordValidators,
  nicknameValidators,
  prefixedForm,
  profileEmailValidators,
  profileForm,
  queueScrollToAddress,
  requiredEmailValidators,
  scrollForm,
  scrollToAddress,
  securityForm,
  selectClassName,
  usernameValidators,
  validationForm,
} = useFormDemoContext()
type Province = keyof typeof locations
</script>

<template>
<Card
  title="Dynamic validation and cascading updates"
  description="业务联动在用户事件中完成；校验依赖使用 TanStack validators.onChangeListenTo。"
  ><div class="grid gap-space-xl lg:grid-cols-2">
    <FormHost :form="dynamicRuleForm" class="grid gap-space-lg"
      ><Field name="nicknameRequired" v-slot="{ field, state }"
        ><FieldRoot orientation="horizontal"
          ><FieldControl v-slot="{ props }"
            ><Checkbox
              v-bind="props"
              :checked="state.value"
              @checked-change="field.handleChange($event === true)" /></FieldControl
          ><FieldContent
            ><FieldLabel>昵称必填</FieldLabel
            ><FieldDescription
              >开关改变后，昵称字段的 onChange 校验会自动重跑。</FieldDescription
            ></FieldContent
          ></FieldRoot
        ></Field
      ><Field name="nickname" :validators="nicknameValidators" v-slot="{ field, state }"
        ><FieldRoot
          :required="dynamicRuleForm.getFieldValue('nicknameRequired')"
          :invalid="invalid(state)"
          :has-error="invalid(state)"
          ><FieldLabel>昵称</FieldLabel
          ><FieldControl v-slot="{ props }"
            ><InputRoot
              :value="state.value"
              :invalid="invalid(state)"
              @value-change="field.handleChange"
              ><InputControl
                v-bind="props"
                @blur="field.handleBlur" /></InputRoot></FieldControl></FieldRoot></Field
      ><Button class="w-fit" type="submit">检查规则</Button></FormHost
    ><FormHost :form="cascadeForm" class="grid gap-space-lg"
      ><Field name="province" v-slot="{ field, state }"
        ><FieldRoot
          ><FieldLabel>省份</FieldLabel
          ><FieldControl v-slot="{ props }"
            ><select
              v-bind="props"
              :class="selectClassName"
              :value="state.value"
              @change="changeProvince(field, $event)"
            >
              <option v-for="(_, province) in locations" :key="province" :value="province">
                {{ province }}
              </option>
            </select></FieldControl
          ></FieldRoot
        ></Field
      ><component
        :is="cascadeForm.Subscribe"
          :selector="(state: any) => state.values.province"
        v-slot="province"
        ><Field name="city" v-slot="{ field, state }"
          ><FieldRoot has-description
            ><FieldLabel>城市</FieldLabel
            ><FieldControl v-slot="{ props }"
              ><select
                v-bind="props"
                :class="selectClassName"
                :value="state.value"
                @change="field.handleChange(($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="city in locations[province as Province]"
                  :key="city"
                  :value="city"
                >
                  {{ city }}
                </option>
              </select></FieldControl
            ><FieldDescription>省份 change 事件中同步重设城市。</FieldDescription></FieldRoot
          ></Field
        ></component
      ><Button class="w-fit" type="submit">保存地区</Button></FormHost
    >
  </div></Card
>
</template>
