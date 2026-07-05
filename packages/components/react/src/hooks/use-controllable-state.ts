import { isFunction } from "@fex/utils";
import { useRef } from "react";
import type { SetStateAction } from "react";
import { useMemoizedFn } from "./use-memoized-fn";
import { useUpdate } from "./use-update";

export interface Options<T> {
  defaultValue?: T;
  defaultValuePropName?: string;
  valuePropName?: string;
  trigger?: string;
  isEqual?: (prev: T, next: T) => boolean;
  isControlled?: (props: Props<T>, valuePropName: string) => boolean;
}

export type Props<T = unknown> = Record<string, unknown> & Partial<StandardProps<T>>;

export interface StandardProps<T> {
  value?: T | undefined;
  defaultValue?: T | undefined;
  onChange?: ((val: T) => void) | undefined;
  isEqual?: ((prev: T, next: T) => boolean) | undefined;
}

function isStateUpdater<T>(value: SetStateAction<T>): value is (prevState: T) => T {
  return typeof value === "function";
}

function isTriggerHandler<T>(value: unknown): value is (val: T, ...args: unknown[]) => void {
  return isFunction(value);
}

export function useControllableState<T = unknown>(
  props: StandardProps<T>
): [T, (v: SetStateAction<T>) => T];
export function useControllableState<T = unknown>(
  props?: Props<T>,
  options?: Options<T>
): [T, (v: SetStateAction<T>, ...args: unknown[]) => T];
export function useControllableState<T = unknown>(
  defaultProps?: StandardProps<T> | Props<T>,
  options: Options<T> = {},
) {
  const props = (defaultProps ?? {}) as Props<T>;

  const {
    defaultValue,
    defaultValuePropName = "defaultValue",
    valuePropName = "value",
    trigger = "onChange",
    isEqual = props.isEqual ?? Object.is,
    isControlled: getIsControlled,
  } = options;

  const value = props[valuePropName] as T | undefined;
  const isControlled = getIsControlled
    ? getIsControlled(props, valuePropName)
    : value !== undefined;

  const initialValueRef = useRef<T | undefined>(undefined);
  const hasInitialValueRef = useRef(false);

  if (!hasInitialValueRef.current) {
    hasInitialValueRef.current = true;
    initialValueRef.current = isControlled
      ? value
      : Object.prototype.hasOwnProperty.call(props, defaultValuePropName)
        ? (props[defaultValuePropName] as T | undefined)
        : defaultValue;
  }

  const stateRef = useRef<T>(initialValueRef.current as T);
  if (isControlled) {
    stateRef.current = value as T;
  }

  const update = useUpdate();

  function setState(v: SetStateAction<T>, ...args: unknown[]) {
    const next = isStateUpdater(v) ? v(stateRef.current) : v;

    if (isEqual(stateRef.current, next)) {
      return next;
    }

    if (!isControlled) {
      stateRef.current = next;
      update();
    }
    const triggerHandler = props[trigger];
    if (isTriggerHandler<T>(triggerHandler)) {
      triggerHandler(next, ...args);
    }

    return next;
  }

  return [stateRef.current, useMemoizedFn(setState)] as const;
}
