import { defineComponent, type PropType, type VNodeChild } from 'vue'

type TemplateRenderer = (context: unknown) => VNodeChild

function isTemplateRenderer(template: unknown): template is TemplateRenderer {
  return typeof template === 'function'
}

// TanStack column templates are intentionally framework-defined dynamic values;
// this tiny factory is the only programmatic renderer, while DataGrid structure stays in an SFC template.
export const DataGridTemplate = defineComponent({
  name: 'DataGridTemplate',
  props: {
    template: { type: null as unknown as PropType<unknown>, required: false },
    context: { type: null as unknown as PropType<unknown>, required: true },
    revision: { type: Number, default: 0 },
  },
  setup(props) {
    return () => {
      void props.revision
      return isTemplateRenderer(props.template)
        ? props.template(props.context)
        : (props.template as VNodeChild)
    }
  },
})
