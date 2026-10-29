import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { applyTokens } from '@tidebook/tokens';
// Registers the tb-* custom elements before React renders them, so props become properties.
import '@tidebook/ui';
import { App } from './App';
import './styles.css';

applyTokens();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
