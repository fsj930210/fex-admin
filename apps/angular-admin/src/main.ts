import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withEnabledBlockingInitialNavigation } from "@angular/router";
import { AppComponent } from "./app.component";
import { routes } from "./routes";
import "@fex/styles";

void bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withEnabledBlockingInitialNavigation())],
});
