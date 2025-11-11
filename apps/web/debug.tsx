import { createRoot } from 'react-dom/client';

const el = document.getElementById('root');
console.log('[debug] root element:', el);
if (!el) throw new Error('No #root found');

createRoot(el).render(
  <div style={{ padding: 16 }}>
    <h1>Mount OK</h1>
    <p>If you see this, Vite + React are fine.</p>
  </div>
);
