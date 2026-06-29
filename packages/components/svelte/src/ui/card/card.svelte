<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import PrimitiveCard from '../../primitive/card/card.svelte'
  import CardContent from '../../primitive/card/card-content.svelte'
  import CardDescription from '../../primitive/card/card-description.svelte'
  import CardFooter from '../../primitive/card/card-footer.svelte'
  import CardHeader from '../../primitive/card/card-header.svelte'
  import CardTitle from '../../primitive/card/card-title.svelte'

  type SectionClass = {
    root?: string
    header?: string
    title?: string
    description?: string
    content?: string
    footer?: string
  }

  type SectionStyle = {
    root?: HTMLAttributes<HTMLDivElement>['style']
    header?: HTMLAttributes<HTMLDivElement>['style']
    title?: HTMLAttributes<HTMLDivElement>['style']
    description?: HTMLAttributes<HTMLDivElement>['style']
    content?: HTMLAttributes<HTMLDivElement>['style']
    footer?: HTMLAttributes<HTMLDivElement>['style']
  }

  type CardSize = 'sm' | 'md' | 'lg'

  interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'style' | 'title'> {
    title?: Snippet | string
    description?: Snippet | string
    footer?: Snippet | string
    size?: CardSize
    class?: SectionClass
    style?: SectionStyle
    children?: Snippet
  }

  let { title, description, footer, size, class: className, style, children, ...rest }: CardProps = $props()

  const rootProps = $derived({
    'data-size': size ?? 'md',
    ...(className?.root ? { class: className.root } : {}),
    ...(style?.root ? { style: style.root } : {}),
  })
  const headerProps = $derived({
    ...(className?.header ? { class: className.header } : {}),
    ...(style?.header ? { style: style.header } : {}),
  })
  const titleProps = $derived({
    ...(className?.title ? { class: className.title } : {}),
    ...(style?.title ? { style: style.title } : {}),
  })
  const descriptionProps = $derived({
    ...(className?.description ? { class: className.description } : {}),
    ...(style?.description ? { style: style.description } : {}),
  })
  const contentProps = $derived({
    ...(className?.content ? { class: className.content } : {}),
    ...(style?.content ? { style: style.content } : {}),
  })
  const footerProps = $derived({
    ...(className?.footer ? { class: className.footer } : {}),
    ...(style?.footer ? { style: style.footer } : {}),
  })
</script>

<PrimitiveCard {...rest} {...rootProps}>
  {#if title || description}
    <CardHeader {...headerProps}>
      {#if title}
        <CardTitle {...titleProps}>
          {#if typeof title === 'function'}
            {@render title()}
          {:else}
            {title}
          {/if}
        </CardTitle>
      {/if}
      {#if description}
        <CardDescription {...descriptionProps}>
          {#if typeof description === 'function'}
            {@render description()}
          {:else}
            {description}
          {/if}
        </CardDescription>
      {/if}
    </CardHeader>
  {/if}
  <CardContent {...contentProps}>
    {@render children?.()}
  </CardContent>
  {#if footer}
    <CardFooter {...footerProps}>
      {#if typeof footer === 'function'}
        {@render footer()}
      {:else}
        {footer}
      {/if}
    </CardFooter>
  {/if}
</PrimitiveCard>
