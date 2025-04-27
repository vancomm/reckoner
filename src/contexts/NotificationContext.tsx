import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

interface Notifications {
    notifications: string[];
    appendNotification: (message: string) => void;
    removeNotification: (message: string) => void;
    clearNotifications: () => void;
}

const NotificationsContext = createContext<Notifications | null>(null);

interface NotificationsProviderProps {
    children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
    const [notifications, setNotifications] = useState<string[]>([]);

    const appendNotification = (message: string) => {
        setNotifications((state) => (state.includes(message) ? state : [...state, message]));
    };

    const removeNotification = (message: string) => {
        setNotifications((state) => state.filter((n) => n !== message));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const value: Notifications = useMemo(
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

export const useNotifications = () => useContext(NotificationsContext)!;
