import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { InAppNotification, NotificationType } from '@/contexts/NotificationContext';
import { useNotification } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';

interface NotificationCenterProps {
  notifications: InAppNotification[];
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

const getBackgroundColor = (type: NotificationType, read: boolean) => {
  if (read) return 'bg-gray-50';
  
  switch (type) {
    case 'success':
      return 'bg-green-50';
    case 'error':
      return 'bg-red-50';
    case 'warning':
      return 'bg-yellow-50';
    case 'info':
    default:
      return 'bg-blue-50';
  }
};

const NotificationItem: React.FC<{
  notification: InAppNotification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}> = ({ notification, onMarkAsRead, onRemove }) => {
  return (
    <div
      className={`p-4 border-l-4 ${
        notification.type === 'success'
          ? 'border-green-500'
          : notification.type === 'error'
            ? 'border-red-500'
            : notification.type === 'warning'
              ? 'border-yellow-500'
              : 'border-blue-500'
      } ${getBackgroundColor(notification.type, notification.read)} cursor-pointer hover:bg-opacity-75 transition-colors`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
            {notification.title}
          </h4>
          <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </span>
            {notification.action && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  notification.action?.onClick();
                }}
                className="text-xs font-medium text-primary hover:underline"
              >
                {notification.action.label}
              </button>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notification.id);
          }}
          className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="Remove notification"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { markAsRead, removeInAppNotification, clearAllNotifications } = useNotification();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={() => clearAllNotifications()}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onRemove={removeInAppNotification}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-center text-primary hover:bg-primary/10"
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
