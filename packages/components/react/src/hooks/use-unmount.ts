import { useEffect } from "react";
import { isDev, isFunction } from "@fex/utils";
import { useLatest } from "./use-latest";

const useUnmount = (fn: () => void) => {
  if (isDev()) {
    if (!isFunction(fn)) {
      console.error(`useUnmount expected parameter is a function, got ${typeof fn}`);
    }
  }

  const fnRef = useLatest(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    // fnRef is stable and always points at the latest cleanup callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};

export default useUnmount;
