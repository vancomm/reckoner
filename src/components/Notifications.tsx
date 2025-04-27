import { useNotifications } from '../contexts/NotificationContext';
import Notification from './Notification';

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
