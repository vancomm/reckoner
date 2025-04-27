import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppStateProvider } from './contexts/AppStateProvider';
import { NotificationsProvider } from './contexts/NotificationProvider';
import './index.css';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <AppStateProvider>
                <NotificationsProvider>
                    <RouterProvider router={router} />
                </NotificationsProvider>
            </AppStateProvider>
        </React.StrictMode>
    );
}
