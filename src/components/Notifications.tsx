import Notification from '@/components/Notification';
import { useNotifications } from '@/contexts/NotificationContext';

export default function Notifications() {
    const { notifications } = useNotifications();

    return (
        <div className="notifications">
            {notifications.map((message, index) => (
                <Notification key={index} message={message} />
            ))}
        </div>
    );
}
