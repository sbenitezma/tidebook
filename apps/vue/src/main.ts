import { createApp } from 'vue';
import { applyTokens } from '@tidebook/tokens';
// Registers the tb-* custom elements before Vue mounts, so bindings become properties.
import '@tidebook/ui';
import '@tidebook/ui/layout.css';
import App from './App.vue';

applyTokens();

createApp(App).mount('#app');
