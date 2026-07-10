import { useRef } from "react";
import { isDev, isFunction } from "@fex/utils";

type AnyFunction = (this: unknown, ...args: never[]) => unknown;

type PickFunction<T extends AnyFunction> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

export const useMemoizedFn = <T extends AnyFunction>(fn: T) => {
  if (isDev()) {
    if (!isFunction(fn)) {
      throw new TypeError(`useMemoizedFn expected parameter is a function, got ${typeof fn}`);
    }
  }

  const fnRef = useRef<T>(fn);

  fnRef.current = fn;

  const memoizedFn = useRef<PickFunction<T>>(undefined);

  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args) as ReturnType<T>;
    };
  }

  return memoizedFn.current;
};
