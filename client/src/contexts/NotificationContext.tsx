import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type NotificationPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // in ms, 0 = persistent
  position?: NotificationPosition;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface AlertBanner {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface InAppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  // Toast notifications
  toasts: Notification[];
  addToast: (notification: Omit<Notification, 'id'>) => string;
  removeToast: (id: string) => void;
  
  // Alert banners
  banners: AlertBanner[];
  addBanner: (banner: Omit<AlertBanner, 'id'>) => string;
  removeBanner: (id: string) => void;
  
  // Modal notifications
  modals: ModalNotification[];
  addModal: (modal: Omit<ModalNotification, 'id'>) => string;
  removeModal: (id: string) => void;
  
  // In-app notifications
  inAppNotifications: InAppNotification[];
  addInAppNotification: (notification: Omit<InAppNotification, 'id' | 'timestamp' | 'read'>) => string;
  removeInAppNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Push notifications
  requestPushPermission: () => Promise<boolean>;
  sendPushNotification: (title: string, options?: NotificationOptions) => Promise<void>;
  isPushSupported: boolean;
  isPushEnabled: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Notification[]>([]);
  const [banners, setBanners] = useState<AlertBanner[]>([]);
  const [modals, setModals] = useState<ModalNotification[]>([]);
  const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>([]);
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  const isPushSupported = 'serviceWorker' in navigator && 'PushManager' in window;

  // Toast notifications
  const addToast = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 3000,
      position: notification.position ?? 'bottom-right',
    };
    
    setToasts((prev) => [...prev, newToast]);
    
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => removeToast(id), newToast.duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Alert banners
  const addBanner = useCallback((banner: Omit<AlertBanner, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newBanner: AlertBanner = {
      ...banner,
      id,
      dismissible: banner.dismissible ?? true,
    };
    
    setBanners((prev) => [...prev, newBanner]);
    return id;
  }, []);

  const removeBanner = useCallback((id: string) => {
    setBanners((prev) => prev.filter((banner) => banner.id !== id));
  }, []);

  // Modal notifications
  const addModal = useCallback((modal: Omit<ModalNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModal: ModalNotification = {
      ...modal,
      id,
    };
    
    setModals((prev) => [...prev, newModal]);
    return id;
  }, []);

  const removeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  // In-app notifications
  const addInAppNotification = useCallback(
    (notification: Omit<InAppNotification, 'id' | 'timestamp' | 'read'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification: InAppNotification = {
        ...notification,
        id,
        timestamp: new Date(),
        read: false,
      };
      
      setInAppNotifications((prev) => [newNotification, ...prev]);
      return id;
    },
    []
  );

  const removeInAppNotification = useCallback((id: string) => {
    setInAppNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setInAppNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setInAppNotifications([]);
  }, []);

  // Push notifications
  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    if (!isPushSupported) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsPushEnabled(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting push permission:', error);
      return false;
    }
  }, [isPushSupported]);

  const sendPushNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      if (!isPushSupported || !isPushEnabled) {
        console.warn('Push notifications not available');
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    },
    [isPushSupported, isPushEnabled]
  );

  const value: NotificationContextType = {
    toasts,
    addToast,
    removeToast,
    banners,
    addBanner,
    removeBanner,
    modals,
    addModal,
    removeModal,
    inAppNotifications,
    addInAppNotification,
    removeInAppNotification,
    markAsRead,
    clearAllNotifications,
    requestPushPermission,
    sendPushNotification,
    isPushSupported,
    isPushEnabled,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
