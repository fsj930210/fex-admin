import type { DependencyList } from "react";
import { useEffect } from "react";
import { isFunction } from "@fex/utils";

function isAsyncGenerator(
  val: AsyncGenerator<void, void, void> | Promise<void>,
): val is AsyncGenerator<void, void, void> {
  return isFunction((val as { [Symbol.asyncIterator]?: unknown })[Symbol.asyncIterator]);
}

function useAsyncEffect(
  effect: () => AsyncGenerator<void, void, void> | Promise<void>,
  deps?: DependencyList,
) {
  useEffect(() => {
    const e = effect();
    let cancelled = false;
    async function execute() {
      if (isAsyncGenerator(e)) {
        while (true) {
          const result = await e.next();
          if (result.done || cancelled) {
            break;
          }
        }
      } else {
        await e;
      }
    }
    execute();
    return () => {
      cancelled = true;
    };
    // Async effect follows the caller-provided dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useAsyncEffect;
