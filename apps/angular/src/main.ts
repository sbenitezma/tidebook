import { bootstrapApplication } from '@angular/platform-browser';
import { applyTokens } from '@tidebook/tokens';
// Registers the tb-* custom elements before Angular renders them, so bindings become properties.
import '@tidebook/ui';
import { App } from './app/app';

applyTokens();

bootstrapApplication(App).catch((error: unknown) => console.error(error));
