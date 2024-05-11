import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import StoreContextProvider from './context/StoreContext.jsx';
import { env } from './config/EnvironmentConfig.js';


ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={env.REACT_APP_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
