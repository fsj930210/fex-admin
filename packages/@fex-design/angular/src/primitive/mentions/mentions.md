# Mentions Primitive

## Purpose

Mentions primitives provide the interaction layer for prefix-based suggestions in composer-style inputs. They detect an active prefix query, render caller-owned items, support keyboard/pointer selection, and notify the caller when an item is selected.

Mentions does not accept options, does not filter data, and does not automatically replace textarea text. Data loading, filtering, and whether selection becomes text, params, chips, commands, or AI context belong to the caller or a future ui layer.

## Import

Import each primitive from its file-level public entry. Do not use a component barrel for Mentions.

    import { MentionsRoot } from '@fex-design/angular/primitive/mentions/root'
    import { MentionsTrigger } from '@fex-design/angular/primitive/mentions/trigger'
    import { MentionsContent } from '@fex-design/angular/primitive/mentions/content'
    import { MentionsList } from '@fex-design/angular/primitive/mentions/list'
    import { MentionsItem } from '@fex-design/angular/primitive/mentions/item'
    import { MentionsPrefixCase } from '@fex-design/angular/primitive/mentions/prefix-case'
    import { MentionsTriggerInput } from '@fex-design/angular/primitive/mentions/trigger-input'

## Basic Usage

    <MentionsRoot value={value} onChange={setValue} onSelect={(item) => addParam(item)}>
      <MentionsTrigger placeholder="Type @ to mention a teammate" />
      <MentionsContent>
        <MentionsList>
          <MentionsItem value="Ada Lovelace">Ada Lovelace</MentionsItem>
        </MentionsList>
      </MentionsContent>
    </MentionsRoot>

## Prefixes

The default prefix is @. Pass a single prefix or an array to support multiple triggers:

    <MentionsRoot prefix={['@', '#', '/']} />

Use MentionsPrefixCase or the framework hook/context to render different lists for different prefixes.

## Selection Semantics

Selecting an item calls onSelect with the registered item and query metadata. It does not mutate value by default. Use replaceMentionsQuery from @fex-design/core/mentions/replace-query only when a product flow wants to write text back into the input.

## Form State

MentionsRoot accepts invalid, required, disabled, readOnly, and status. The default MentionsTrigger renders the system Textarea primitive, so validation and disabled styling stay aligned with existing form controls.

## Props

### MentionsRoot

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| value | string | undefined | Controlled text value. |
| defaultValue | string | empty string | Initial uncontrolled text value. |
| onChange | (value, meta) => void | undefined | Text value callback. |
| prefix | string or string[] | @ | Active trigger prefixes. |
| open | boolean | undefined | Controlled suggestion visibility. |
| defaultOpen | boolean | false | Initial uncontrolled visibility. |
| onOpenChange | (open, meta) => void | undefined | Visibility callback. |
| onSearch | (text, meta) => void | undefined | Fires when the active prefix query changes. |
| onSelect | (item, meta) => void | undefined | Fires when a registered item is selected. |
| parseQuery | function | default parser | Advanced query parser override. |
| invalid | boolean | false | Error styling state. |
| required | boolean | false | Required ARIA state. |
| disabled | boolean | false | Disables input interaction. |
| readOnly | boolean | false | Keeps input readable but blocks writes. |

### MentionsItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| value | string | required | Item value passed to onSelect. |
| itemKey | string or number | value | Stable registry key. |
| disabled | boolean | false | Prevents activation and selection. |
| data | unknown | undefined | Caller-owned metadata. |

## Notes

- Primitive item registration is driven by rendered MentionsItem components, not an options prop.
- Active key is internal interaction state and is not exposed as a controlled API.
- Custom trigger surfaces must preserve textarea-like value and selection behavior.
