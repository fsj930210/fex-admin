<script lang="ts">
  import { breadcrumbClassName, breadcrumbEllipsisClassName, breadcrumbItemClassName, breadcrumbLinkClassName, breadcrumbListClassName, breadcrumbPageClassName, breadcrumbSeparatorClassName } from '@fex-design/styles/breadcrumb'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  interface Props { part?: 'root' | 'list' | 'item' | 'link' | 'page' | 'separator' | 'ellipsis'; class?: string; href?: string; children?: Snippet }
  let { part = 'root', class: className, href, children }: Props = $props()
  const classes = { root: breadcrumbClassName({}), list: breadcrumbListClassName, item: breadcrumbItemClassName, link: breadcrumbLinkClassName, page: breadcrumbPageClassName, separator: breadcrumbSeparatorClassName, ellipsis: breadcrumbEllipsisClassName }
</script>
{#if part === 'root'}<nav aria-label="Breadcrumb" class={cn(classes.root, className)} data-slot="breadcrumb">{@render children?.()}</nav>
{:else if part === 'list'}<ol class={cn(classes.list, className)} data-slot="breadcrumb-list">{@render children?.()}</ol>
{:else if part === 'item'}<li class={cn(classes.item, className)} data-slot="breadcrumb-item">{@render children?.()}</li>
{:else if part === 'link'}<a {href} class={cn(classes.link, className)} data-slot="breadcrumb-link">{@render children?.()}</a>
{:else if part === 'page'}<span aria-current="page" class={cn(classes.page, className)} data-slot="breadcrumb-page">{@render children?.()}</span>
{:else if part === 'separator'}<li aria-hidden="true" class={cn(classes.separator, className)} data-slot="breadcrumb-separator">{#if children}{@render children()}{:else}/{/if}</li>
{:else}<span aria-hidden="true" class={cn(classes.ellipsis, className)} data-slot="breadcrumb-ellipsis">{#if children}{@render children()}{:else}...{/if}</span>{/if}
