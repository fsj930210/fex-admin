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
    // Mount callbacks intentionally run once; callers that need updates should use update-effect hooks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useMount;
