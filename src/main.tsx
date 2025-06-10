import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CharacterProvider } from './contexts/CharacterContext.tsx' // ← これを追加

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CharacterProvider> {/* ← これで囲む */}
        <App />
      </CharacterProvider>
    </BrowserRouter>
  </React.StrictMode>,
)