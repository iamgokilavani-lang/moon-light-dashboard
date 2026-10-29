import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Auto-migrate any legacy cached customer name in browser localStorage to Gokilavani
try {
  ['novastore_user', 'moonlight_user'].forEach(key => {
    const val = localStorage.getItem(key);
    if (val && (val.includes('Alex Morgan') || val.includes('Aarav Sharma'))) {
      const parsed = JSON.parse(val);
      parsed.name = 'Gokilavani';
      parsed.email = 'gokilavani@example.com';
      localStorage.setItem('moonlight_user', JSON.stringify(parsed));
      if (key !== 'moonlight_user') localStorage.removeItem(key);
    }
  });

  ['novastore_orders', 'moonlight_orders'].forEach(key => {
    const val = localStorage.getItem(key);
    if (val && (val.includes('Alex Morgan') || val.includes('Aarav Sharma'))) {
      const updated = val.replaceAll('Alex Morgan', 'Gokilavani').replaceAll('Aarav Sharma', 'Gokilavani');
      localStorage.setItem('moonlight_orders', updated);
      if (key !== 'moonlight_orders') localStorage.removeItem(key);
    }
  });
} catch {
  // Ignore migration errors
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
