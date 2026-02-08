import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { AlertBanner as AlertBannerType, NotificationType } from '@/contexts/NotificationContext';
import { useNotification } from '@/contexts/NotificationContext';

interface AlertBannerProps {
  banner: AlertBannerType;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5" />;
    case 'error':
      return <AlertCircle className="w-5 h-5" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5" />;
    case 'info':
    default:
      return <Info className="w-5 h-5" />;
  }
};

const getStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-900',
        icon: 'text-green-500',
        button: 'hover:bg-green-100',
      };
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-900',
        icon: 'text-red-500',
        button: 'hover:bg-red-100',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-900',
        icon: 'text-yellow-500',
        button: 'hover:bg-yellow-100',
      };
    case 'info':
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        icon: 'text-blue-500',
        button: 'hover:bg-blue-100',
      };
  }
};

export const AlertBanner: React.FC<AlertBannerProps> = ({ banner }) => {
  const { removeBanner } = useNotification();
  const styles = getStyles(banner.type);

  return (
    <div
      className={`w-full ${styles.bg} border-b ${styles.border} ${styles.text} px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      <div className="container flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>
          {getIcon(banner.type)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{banner.title}</h3>
          <p className="text-sm mt-1 opacity-90">{banner.message}</p>
          {banner.action && (
            <button
              onClick={banner.action.onClick}
              className="text-sm font-medium mt-2 underline hover:no-underline"
            >
              {banner.action.label}
            </button>
          )}
        </div>
        {banner.dismissible && (
          <button
            onClick={() => removeBanner(banner.id)}
            className={`flex-shrink-0 mt-0.5 p-1 rounded transition-colors ${styles.button}`}
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

interface AlertBannerContainerProps {
  banners: AlertBannerType[];
}

export const AlertBannerContainer: React.FC<AlertBannerContainerProps> = ({ banners }) => {
  return (
    <>
      {banners.map((banner) => (
        <AlertBanner key={banner.id} banner={banner} />
      ))}
    </>
  );
};
