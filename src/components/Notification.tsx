import Close from './Close';

interface NotificationProps {
    message: string;
}

export default function Notification({ message }: NotificationProps) {
    return (
        <div className="notification">
            {message}
            <Close fill="white" width="13px" height="13px" transform="translateY(2px)" />
        </div>
    );
}
