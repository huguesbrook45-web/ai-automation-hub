import { useNotification, NotificationType } from '@/contexts/NotificationContext';
import { useCallback } from 'react';

export const useNotificationManager = () => {
  const {
    addToast,
    addBanner,
    addModal,
    addInAppNotification,
    sendPushNotification,
  } = useNotification();

  // Success notification
  const notifySuccess = useCallback(
    (title: string, message: string, duration = 3000) => {
      return addToast({
        type: 'success',
        title,
        message,
        duration,
      });
    },
    [addToast]
  );

  // Error notification
  const notifyError = useCallback(
    (title: string, message: string, duration = 5000) => {
      return addToast({
        type: 'error',
        title,
        message,
        duration,
      });
    },
    [addToast]
  );

  // Info notification
  const notifyInfo = useCallback(
    (title: string, message: string, duration = 3000) => {
      return addToast({
        type: 'info',
        title,
        message,
        duration,
      });
    },
    [addToast]
  );

  // Warning notification
  const notifyWarning = useCallback(
    (title: string, message: string, duration = 4000) => {
      return addToast({
        type: 'warning',
        title,
        message,
        duration,
      });
    },
    [addToast]
  );

  // Banner notification
  const showBanner = useCallback(
    (type: NotificationType, title: string, message: string, dismissible = true) => {
      return addBanner({
        type,
        title,
        message,
        dismissible,
      });
    },
    [addBanner]
  );

  // Confirmation modal
  const confirmAction = useCallback(
    (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
      return addModal({
        type: 'info',
        title,
        message,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm,
        onCancel,
      });
    },
    [addModal]
  );

  // Alert modal
  const alertUser = useCallback(
    (title: string, message: string, type: NotificationType = 'info') => {
      return addModal({
        type,
        title,
        message,
        confirmText: 'OK',
      });
    },
    [addModal]
  );

  // In-app notification
  const notifyInApp = useCallback(
    (type: NotificationType, title: string, message: string) => {
      return addInAppNotification({
        type,
        title,
        message,
      });
    },
    [addInAppNotification]
  );

  // Push notification
  const notifyPush = useCallback(
    async (title: string, message: string, icon?: string) => {
      await sendPushNotification(title, {
        body: message,
        icon: icon || '/favicon.ico',
      });
    },
    [sendPushNotification]
  );

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
    showBanner,
    confirmAction,
    alertUser,
    notifyInApp,
    notifyPush,
  };
};
