// src/App.jsx
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AppRouter from './routes'; // Import the router setup

/**
 * Root Application Component.
 * Sets up global context providers and the main router.
 */
function App() {
  return (
    <NotificationProvider> {/* Notification context wraps Auth */}
      <AuthProvider>       {/* Auth context wraps Router */}
        <AppRouter />        {/* Router handles page rendering */}
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;