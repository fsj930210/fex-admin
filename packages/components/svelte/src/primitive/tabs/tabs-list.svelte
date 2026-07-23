<script lang="ts">
  import { tabsListClassName } from '@fex/components-styles/tabs'; import { cn } from '@fex/utils'; import { getContext, type Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { tabsContextKey, type TabsContextValue } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet, render?: Snippet<[{ props: HTMLAttributes<HTMLElement> }]> }
  let { children, render, class: className, ...rest }: Props = $props(); const tabs = getContext<TabsContextValue>(tabsContextKey); if (!tabs) throw new Error('TabsList must be used inside TabsRoot.'); const renderProps = $derived({ ...rest, ...tabs.getListProps(), class: cn(tabsListClassName({ variant: tabs.variant(), orientation: tabs.orientation() }), className) })
</script>
{#if render}{@render render({ props: renderProps })}{:else}<div {...renderProps}>{@render children?.()}</div>{/if}
