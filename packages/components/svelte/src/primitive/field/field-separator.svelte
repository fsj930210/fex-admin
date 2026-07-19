<script lang="ts">import { fieldSeparatorClassName } from '@fex/components-styles/field'; import { cn } from '@fex/utils'; import type { HTMLAttributes } from 'svelte/elements'; let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props()</script>
<div {...rest} role={rest.role ?? 'separator'} data-slot="field-separator" class={cn(fieldSeparatorClassName, className)}></div>
