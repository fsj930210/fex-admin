import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./routes";
import "@fex/styles";

createApp(App).use(router).mount("#root");
