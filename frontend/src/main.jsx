import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import { WasteAgentProvider } from './Contexts/Farmer/WasteAgentContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <WasteAgentProvider>
            <App />
      </WasteAgentProvider>
  </StrictMode>,
)
