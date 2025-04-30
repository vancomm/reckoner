import React from 'react';

import { NotificationsContext } from '@/contexts/NotificationContext';

interface Notifications {
    notifications: string[];
    appendNotification: (message: string) => void;
    removeNotification: (message: string) => void;
    clearNotifications: () => void;
}

interface NotificationsProviderProps {
    children: React.ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
    const [notifications, setNotifications] = React.useState<string[]>([]);

    const appendNotification = (message: string) => {
        setNotifications((state) => (state.includes(message) ? state : [...state, message]));
    };

    const removeNotification = (message: string) => {
        setNotifications((state) => state.filter((n) => n !== message));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const value: Notifications = React.useMemo(
        () => ({
            notifications,
            appendNotification,
            removeNotification,
            clearNotifications,
        }),
        [notifications]
    );

    return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
