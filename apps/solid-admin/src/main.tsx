import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { App } from "./App";
import "@fex/styles";

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.querySelector("#root")!,
);
