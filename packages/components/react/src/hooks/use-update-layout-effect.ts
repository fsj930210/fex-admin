import { useLayoutEffect } from "react";
import { createUpdateEffect } from "./create-update-effect";

export default createUpdateEffect(useLayoutEffect);
