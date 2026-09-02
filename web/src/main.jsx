import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import './lib/i18n'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'

// Initialize native social login providers once at startup
if (Capacitor.isNativePlatform()) {
  SocialLogin.initialize({
    google: {
      webClientId: '1038591439156-7a615n7fqd6lsumnio4590sja7bgqk32.apps.googleusercontent.com',
    },
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

