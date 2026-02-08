import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification, NotificationType } from '@/contexts/NotificationContext';
import { useNotification } from '@/contexts/NotificationContext';

interface ToastProps {
  notification: Notification;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getBackgroundColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200';
  }
};

const getTextColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-900';
    case 'error':
      return 'text-red-900';
    case 'warning':
      return 'text-yellow-900';
    case 'info':
    default:
      return 'text-blue-900';
  }
};

export const Toast: React.FC<ToastProps> = ({ notification }) => {
  const { removeToast } = useNotification();

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${getBackgroundColor(
        notification.type
      )} ${getTextColor(notification.type)} shadow-lg animate-in fade-in slide-in-from-right-4 duration-300`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{notification.title}</h3>
        <p className="text-sm mt-1 opacity-90">{notification.message}</p>
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="text-sm font-medium mt-2 underline hover:no-underline"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => removeToast(notification.id)}
        className="flex-shrink-0 mt-0.5 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  notifications: Notification[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications }) => {
  const groupedByPosition = notifications.reduce(
    (acc, notification) => {
      const position = notification.position || 'bottom-right';
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(notification);
      return acc;
    },
    {} as Record<string, Notification[]>
  );

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <>
      {Object.entries(groupedByPosition).map(([position, toasts]) => (
        <div
          key={position}
          className={`fixed ${getPositionClasses(position)} flex flex-col gap-3 pointer-events-none z-50`}
        >
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast notification={toast} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
