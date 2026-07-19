import { FieldContent, FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldRequiredIndicator, FieldRoot, FieldSeparator, FieldSet, FieldTitle } from '@fex/components-react/primitive/field'
import { Form, useForm, type AnyFieldApi } from '@fex/components-react/primitive/form'
import { InputControl, InputRoot } from '@fex/components-react/primitive/input'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { Checkbox } from '@fex/components-react/ui/checkbox'
import { useState } from 'react'
import { Link } from 'react-router'

const locations = {
  浙江: ['杭州', '宁波', '温州'],
  江苏: ['南京', '苏州', '无锡'],
  广东: ['广州', '深圳', '珠海'],
} as const

const selectClassName = 'h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50'

function errorsOf(field: AnyFieldApi) {
  return field.state.meta.errors.map((error) => String(error))
}

export function FormPage() {
  const [result, setResult] = useState('尚未提交')
  const [instanceResult, setInstanceResult] = useState('点击按钮读取或设置字段值')

  const loginForm = useForm({ defaultValues: { account: '', password: '', remember: false }, onSubmit: async ({ value }) => { await new Promise((resolve) => setTimeout(resolve, 300)); setResult(`登录：${JSON.stringify(value)}`) } })
  const validationForm = useForm({ defaultValues: { username: '', password: '', confirmPassword: '' }, onSubmit: ({ value }) => setResult(`校验：${JSON.stringify(value)}`) })
  const dynamicForm = useForm({ defaultValues: { nicknameRequired: true, nickname: '' }, onSubmit: ({ value }) => setResult(`动态规则：${JSON.stringify(value)}`) })
  const cascadeForm = useForm({ defaultValues: { province: '浙江' as keyof typeof locations, city: '杭州' }, onSubmit: ({ value }) => setResult(`级联：${JSON.stringify(value)}`) })
  const scrollForm = useForm({ defaultValues: { note: '', deliveryAddress: '' }, onSubmit: ({ value }) => setResult(`长表单：${JSON.stringify(value)}`) })
  const instanceForm = useForm({ defaultValues: { source: '来自 Form defaultValues', nickname: '' }, onSubmit: ({ value }) => setResult(`实例方法：${JSON.stringify(value)}`) })
  const layoutForm = useForm({ defaultValues: { vertical: '', horizontal: '', responsive: '' } })
  const preferencesForm = useForm({ defaultValues: { productUpdates: false, securityAlerts: true }, onSubmit: ({ value }) => setResult(`通知偏好：${JSON.stringify(value)}`) })
  const nestedForm = useForm({ defaultValues: { nickname: '' }, onSubmit: ({ value }) => setResult(`无 DOM：${value.nickname}`) })

  return <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div className="mx-auto w-full max-w-5xl space-y-space-xl">
    <header className="space-y-space-md"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link><h1 className="text-2xl font-semibold text-foreground">Form and Field primitives</h1><p className="max-w-3xl text-sm leading-6 text-muted-foreground">TanStack Form 是唯一状态源；每个示例独立展示一个可直接复用的 Form 场景。</p></header>

    <Card title="Basic form" description="必填、原生 TanStack validators、自定义 Checkbox、异步提交、重置和提交状态。"><Form form={loginForm} className="grid max-w-xl gap-space-lg">
      <loginForm.Field name="account" rules={[{ required: true, message: '请输入账号', validateTrigger: 'blur' }]}>{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <FieldRoot required invalid={invalid} hasDescription hasError={invalid}><FieldLabel>账号 <FieldRequiredIndicator /></FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange} invalid={invalid}><InputControl {...props} name={field.name} autoComplete="username" placeholder="admin" onBlur={field.handleBlur} /></InputRoot>}</FieldControl><FieldDescription>失焦时校验必填。</FieldDescription>{invalid && <FieldError errors={errorsOf(field)} />}</FieldRoot> }}</loginForm.Field>
      <loginForm.Field name="password" validators={{ onChange: ({ value }) => value.length >= 6 ? undefined : '密码至少 6 位' }}>{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <FieldRoot required invalid={invalid} hasError={invalid}><FieldLabel>密码 <FieldRequiredIndicator /></FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange} invalid={invalid}><InputControl {...props} name={field.name} type="password" autoComplete="current-password" onBlur={field.handleBlur} /></InputRoot>}</FieldControl>{invalid && <FieldError errors={errorsOf(field)} />}</FieldRoot> }}</loginForm.Field>
      <loginForm.Field name="remember">{(field) => <FieldRoot orientation="horizontal"><FieldControl>{({ props }) => <Checkbox {...props} checked={field.state.value} onCheckedChange={(checked) => field.handleChange(checked === true)} />}</FieldControl><FieldContent><FieldLabel>记住登录状态</FieldLabel><FieldDescription>自定义控件只需显式绑定值和变更事件。</FieldDescription></FieldContent></FieldRoot>}</loginForm.Field>
      <div className="flex flex-wrap items-center gap-space-sm"><loginForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>{([canSubmit, isSubmitting]) => <Button type="submit" disabled={!canSubmit || isSubmitting}>{isSubmitting ? '提交中…' : '登录'}</Button>}</loginForm.Subscribe><Button type="button" variant="outline" onClick={() => loginForm.reset()}>重置</Button></div>
    </Form></Card>

    <Card title="Validation timing and dependencies" description="校验时机、防抖异步校验、自定义 validator，以及密码确认依赖。"><Form form={validationForm} className="grid max-w-xl gap-space-lg">
      <validationForm.Field name="username" validateTrigger={['blur', 'change']} validateDebounce={400} rules={[{ required: true, message: '请输入用户名', validateTrigger: 'blur' }, { validateTrigger: 'change', validator: async (_, value) => { await new Promise((resolve) => setTimeout(resolve, 200)); if (value === 'admin') throw new Error('用户名已被占用') } }]}>{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <FieldRoot required invalid={invalid} hasDescription hasError={invalid}><FieldLabel>用户名 <FieldRequiredIndicator /></FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange} invalid={invalid}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}</FieldControl><FieldDescription>失焦校验必填；输入 admin 触发 400ms 防抖异步校验。</FieldDescription>{invalid && <FieldError errors={errorsOf(field)} />}</FieldRoot> }}</validationForm.Field>
      <validationForm.Field name="password" rules={[{ required: true, message: '请输入密码' }, { min: 8, message: '密码至少 8 位' }]}>{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <FieldRoot required invalid={invalid} hasError={invalid}><FieldLabel>新密码 <FieldRequiredIndicator /></FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange} invalid={invalid}><InputControl {...props} type="password" onBlur={field.handleBlur} /></InputRoot>}</FieldControl>{invalid && <FieldError errors={errorsOf(field)} />}</FieldRoot> }}</validationForm.Field>
      <validationForm.Field name="confirmPassword" dependencies={['password']} rules={[{ required: true, message: '请再次输入密码' }, ({ getFieldValue }) => ({ validator: (_, value) => value === getFieldValue('password') ? undefined : '两次密码不一致' })]}>{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <FieldRoot required invalid={invalid} hasDescription hasError={invalid}><FieldLabel>确认密码 <FieldRequiredIndicator /></FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange} invalid={invalid}><InputControl {...props} type="password" onBlur={field.handleBlur} /></InputRoot>}</FieldControl><FieldDescription>密码更新后，dependencies 会自动重新校验确认密码。</FieldDescription>{invalid && <FieldError errors={errorsOf(field)} />}</FieldRoot> }}</validationForm.Field>
      <Button className="w-fit" type="submit">验证</Button>
    </Form></Card>

    <Card title="Dynamic validation rules" description="规则工厂读取当前表单值，根据开关动态决定字段是否必填。"><Form form={dynamicForm} className="grid max-w-xl gap-space-lg">
      <dynamicForm.Field name="nicknameRequired">{(field) => <FieldRoot orientation="horizontal"><FieldControl>{({ props }) => <Checkbox {...props} checked={field.state.value} onCheckedChange={(checked) => field.handleChange(checked === true)} />}</FieldControl><FieldContent><FieldLabel>昵称必填</FieldLabel><FieldDescription>切换后立即改变下方字段的校验规则。</FieldDescription></FieldContent></FieldRoot>}</dynamicForm.Field>
      <dynamicForm.Field name="nickname" dependencies={['nicknameRequired']} rules={[({ getFieldValue }) => ({ required: getFieldValue('nicknameRequired'), message: '请输入昵称' })]}>{(field) => { const required = dynamicForm.getFieldValue('nicknameRequired'); const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <FieldRoot required={required} invalid={invalid} hasError={invalid}><FieldLabel>昵称 {required && <FieldRequiredIndicator />}</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange} invalid={invalid}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}</FieldControl>{invalid && <FieldError errors={errorsOf(field)} />}</FieldRoot> }}</dynamicForm.Field>
      <Button className="w-fit" type="submit">检查动态规则</Button>
    </Form></Card>

    <Card title="Cascading fields" description="省份变化时在同一个 change 事件中更新城市，不依赖 effect 监听。"><Form form={cascadeForm} className="grid max-w-xl gap-space-lg">
      <cascadeForm.Field name="province">{(field) => <FieldRoot><FieldLabel>省份</FieldLabel><FieldControl>{({ props }) => <select {...props} className={selectClassName} value={field.state.value} onBlur={field.handleBlur} onChange={(event) => { const province = event.target.value as keyof typeof locations; field.handleChange(province); cascadeForm.setFieldValue('city', locations[province][0]) }}>{Object.keys(locations).map((province) => <option key={province} value={province}>{province}</option>)}</select>}</FieldControl></FieldRoot>}</cascadeForm.Field>
      <cascadeForm.Subscribe selector={(state) => state.values.province}>{(province) => <cascadeForm.Field name="city">{(field) => <FieldRoot hasDescription><FieldLabel>城市</FieldLabel><FieldControl>{({ props }) => <select {...props} className={selectClassName} value={field.state.value} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)}>{locations[province].map((city) => <option key={city} value={city}>{city}</option>)}</select>}</FieldControl><FieldDescription>城市选项由当前省份派生。</FieldDescription></FieldRoot>}</cascadeForm.Field>}</cascadeForm.Subscribe>
      <Button className="w-fit" type="submit">提交地区</Button>
    </Form></Card>

    <Card title="Form instance and initialValue" description="字段 initialValue，以及 getFieldValue、setFieldValue、reset 实例方法。"><Form form={instanceForm} className="grid max-w-xl gap-space-lg">
      <instanceForm.Field name="source">{(field) => <FieldRoot hasDescription><FieldLabel>Form 初始值</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}</FieldControl><FieldDescription>来自 useForm.defaultValues。</FieldDescription></FieldRoot>}</instanceForm.Field>
      <instanceForm.Field name="nickname" initialValue="来自 Field initialValue">{(field) => <FieldRoot hasDescription><FieldLabel>字段初始值</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}</FieldControl><FieldDescription>initialValue 是对 TanStack Field defaultValue 的语义别名。</FieldDescription></FieldRoot>}</instanceForm.Field>
      <div className="flex flex-wrap gap-space-sm"><Button type="button" onClick={() => instanceForm.setFieldValue('nickname', '通过 setFieldValue 设置')}>设置昵称</Button><Button type="button" variant="outline" onClick={() => setInstanceResult(instanceForm.getFieldValue('nickname'))}>读取昵称</Button><Button type="button" variant="outline" onClick={() => instanceForm.reset()}>重置</Button></div>
      <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground" aria-live="polite">{instanceResult}</p>
    </Form></Card>

    <Card title="Scroll to first error" description="点击顶部按钮提交长表单；校验失败后自动滚动并聚焦底部第一个错误字段。"><Form form={scrollForm} scrollToFirstError={{ behavior: 'smooth', block: 'center', focus: true }} className="grid max-w-xl gap-space-lg">
      <Button className="w-fit" type="submit">校验并滚动到错误字段</Button>
      <scrollForm.Field name="note">{(field) => <FieldRoot><FieldLabel>备注（选填）</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}</FieldControl></FieldRoot>}</scrollForm.Field>
      <div className="flex min-h-[28rem] items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">模拟较长的表单内容</div>
      <scrollForm.Field name="deliveryAddress" validateTrigger="submit" rules={[{ required: true, message: '请输入收货地址', validateTrigger: 'submit' }]}>{(field) => { const invalid = field.state.meta.isTouched && !field.state.meta.isValid; return <FieldRoot required invalid={invalid} hasDescription hasError={invalid}><FieldLabel>收货地址 <FieldRequiredIndicator /></FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange} invalid={invalid}><InputControl {...props} placeholder="此字段位于长表单底部" onBlur={field.handleBlur} /></InputRoot>}</FieldControl><FieldDescription>这是提交失败后的定位目标。</FieldDescription>{invalid && <FieldError errors={errorsOf(field)} />}</FieldRoot> }}</scrollForm.Field>
    </Form></Card>

    <Card title="Form layouts" description="vertical、horizontal、responsive 三种字段布局；responsive 在窄屏自动回到纵向。"><Form form={layoutForm} component={false}><FieldGroup>
      <layoutForm.Field name="vertical">{(field) => <FieldRoot orientation="vertical" hasDescription><FieldLabel>Vertical</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange}><InputControl {...props} placeholder="标签在控件上方" /></InputRoot>}</FieldControl><FieldDescription>默认布局。</FieldDescription></FieldRoot>}</layoutForm.Field>
      <layoutForm.Field name="horizontal">{(field) => <FieldRoot orientation="horizontal" hasDescription><FieldLabel>Horizontal</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange}><InputControl {...props} placeholder="标签与控件同一行" /></InputRoot>}</FieldControl><FieldDescription>适合桌面端紧凑表单。</FieldDescription></FieldRoot>}</layoutForm.Field>
      <layoutForm.Field name="responsive">{(field) => <FieldRoot orientation="responsive" hasDescription><FieldLabel>Responsive</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange}><InputControl {...props} placeholder="调整窗口宽度查看变化" /></InputRoot>}</FieldControl><FieldDescription>窄屏纵向，md 以上横向。</FieldDescription></FieldRoot>}</layoutForm.Field>
    </FieldGroup></Form></Card>

    <Card title="Grouped fields" description="FieldSet、Legend、Group、Content、Title、Separator 组合相关字段。"><Form form={preferencesForm} className="grid max-w-xl gap-space-lg"><FieldSet><FieldLegend>通知偏好</FieldLegend><FieldGroup><preferencesForm.Field name="productUpdates">{(field) => <FieldRoot orientation="horizontal"><FieldControl>{({ props }) => <Checkbox {...props} checked={field.state.value} onCheckedChange={(checked) => field.handleChange(checked === true)} />}</FieldControl><FieldContent><FieldTitle>产品更新</FieldTitle><FieldDescription>接收版本与维护通知。</FieldDescription></FieldContent></FieldRoot>}</preferencesForm.Field><FieldSeparator /><preferencesForm.Field name="securityAlerts">{(field) => <FieldRoot orientation="horizontal"><FieldControl>{({ props }) => <Checkbox {...props} checked={field.state.value} onCheckedChange={(checked) => field.handleChange(checked === true)} />}</FieldControl><FieldContent><FieldTitle>安全提醒</FieldTitle><FieldDescription>异常登录和敏感操作提醒。</FieldDescription></FieldContent></FieldRoot>}</preferencesForm.Field></FieldGroup></FieldSet><Button className="w-fit" type="submit">保存通知偏好</Button></Form></Card>

    <Card title="component=false" description="嵌套逻辑表单不输出第二个 form DOM；提交通过实例显式触发。"><Form form={nestedForm} component={false}><nestedForm.Field name="nickname">{(field) => <FieldRoot className="max-w-md"><FieldLabel>昵称</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}</FieldControl></FieldRoot>}</nestedForm.Field><Button className="mt-space-md" type="button" onClick={() => void nestedForm.handleSubmit()}>提交无 DOM 表单</Button></Form></Card>

    <Card title="Latest result" description="所有可提交示例共用的结果输出。"><pre className="overflow-auto rounded-md bg-muted p-3 text-sm text-muted-foreground">{result}</pre></Card>
  </div></main>
}
