# Textarea Primitive

## Purpose

Textarea primitives expose a composable multi-line input contract. TextareaRoot owns value state, validation state, autosize, clear behavior and footer layout. TextareaInput is the only native textarea node.

## Import

    import {
      TextareaClear,
      TextareaFooter,
      TextareaInput,
      TextareaRoot,
      useTextarea,
    } from '@fex-design/react/primitive/textarea'

## Basic Usage

    <TextareaRoot defaultValue="Review the latest support request.">
      <TextareaInput aria-label="Remark" placeholder="Write a note" />
    </TextareaRoot>

## Controlled and Uncontrolled

    const [value, setValue] = useState('')

    <TextareaRoot value={value} onChange={setValue}>
      <TextareaInput aria-label="Controlled textarea" />
      <TextareaClear />
    </TextareaRoot>

    <TextareaRoot defaultValue="Initial value">
      <TextareaInput aria-label="Uncontrolled textarea" />
      <TextareaClear />
    </TextareaRoot>

## Autosize

    <TextareaRoot autoSize={{ minRows: 1, maxRows: 8 }}>
      <TextareaInput aria-label="Autosize textarea" />
    </TextareaRoot>

autoSize accepts true or { minRows, maxRows }. The DOM height is synchronized from the shared core autosize utility and switches to internal scrolling after maxRows.

## Footer Composition

    <TextareaRoot value={message} onChange={setMessage} autoSize={{ minRows: 1, maxRows: 8 }}>
      <TextareaInput aria-label="Message" placeholder="Ask anything" />
      <TextareaClear />
      <TextareaFooter>
        <Button variant="ghost" size="icon-sm" icon={<PlusIcon />} aria-label="Attach" />
        <Button disabled={!message.trim()}>Send</Button>
      </TextareaFooter>
    </TextareaRoot>

TextareaFooter is only a layout slot. Count, submit, model selection, attachments and AI-specific behavior belong to the caller.

## Props

### TextareaRoot

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| value | string | undefined | Controlled value. |
| defaultValue | string | empty string | Initial uncontrolled value. |
| onChange | (value, meta) => void | undefined | Value callback for input and clear. |
| disabled | boolean | false | Disables input and clear behavior. |
| readOnly | boolean | false | Keeps focusable input but blocks writes and clear. |
| invalid | boolean | false | Error state. |
| status | error or warning | undefined | Visual status. |
| autoSize | boolean or minRows/maxRows object | undefined | Enables height sync. |
| allowClear | boolean or render function | undefined | Optional inline clear shortcut. |
| onClear | (meta) => void | undefined | Fires after a clear action. |

### TextareaInput

Accepts native textarea props except value, which is supplied by TextareaRoot. Native onChange, onInput, onFocus and onBlur still pass through.

### TextareaClear

Accepts native button props and optional forceMount. It clears to an empty string, preserves input focus on pointer down and renders a project CloseIcon by default.

### TextareaFooter

Accepts native div props and renders caller-owned footer content.

## Notes

- Primitive does not export a standalone Textarea; a future ui/textarea can wrap these parts.
- Clear styling is local to textarea through textareaClearClassName; it does not import Input styles.
