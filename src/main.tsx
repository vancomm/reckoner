import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { AppStateProvider } from './contexts/AppStateContext';
import { NotificationsProvider } from './contexts/NotificationContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <AppStateProvider>
            <NotificationsProvider>
                <App />
            </NotificationsProvider>
        </AppStateProvider>
    </React.StrictMode>
);
