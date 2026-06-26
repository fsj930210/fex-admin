import { useEffect } from "react";
import { isDev, isFunction, isThenable } from "@fex/utils";

type MountCleanup = void | (() => void);
type MountCallback = () => MountCleanup | Promise<MountCleanup>;

const useMount = (fn: MountCallback) => {
  if (isDev()) {
    if (!isFunction(fn)) {
      console.error(
        `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`,
      );
    }
  }

  useEffect((): MountCleanup => {
    const result = fn?.();
    // If fn returns a Promise, don't return it as cleanup function
    if (isThenable(result)) {
      return;
    }
    return result;
  }, []);
};

export default useMount;
