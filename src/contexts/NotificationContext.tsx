import React from 'react';

interface Notifications {
    notifications: string[];
    appendNotification: (message: string) => void;
    removeNotification: (message: string) => void;
    clearNotifications: () => void;
}

export const NotificationsContext = React.createContext<Notifications | null>(null);

export const useNotifications = () => React.useContext(NotificationsContext)!;
