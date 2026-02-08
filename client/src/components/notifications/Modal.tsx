import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ModalNotification, NotificationType } from '@/contexts/NotificationContext';
import { useNotification } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';

interface ModalProps {
  modal: ModalNotification;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-8 h-8 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
    case 'info':
    default:
      return <Info className="w-8 h-8 text-blue-500" />;
  }
};

const getButtonColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-600 hover:bg-green-700';
    case 'error':
      return 'bg-red-600 hover:bg-red-700';
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700';
    case 'info':
    default:
      return 'bg-blue-600 hover:bg-blue-700';
  }
};

export const Modal: React.FC<ModalProps> = ({ modal }) => {
  const { removeModal } = useNotification();

  const handleConfirm = () => {
    modal.onConfirm?.();
    removeModal(modal.id);
  };

  const handleCancel = () => {
    modal.onCancel?.();
    removeModal(modal.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full p-6 animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4">{getIcon(modal.type)}</div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">{modal.title}</h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">{modal.message}</p>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            {modal.onCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                {modal.cancelText || 'Cancel'}
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              className={`flex-1 text-white ${getButtonColor(modal.type)}`}
            >
              {modal.confirmText || 'Confirm'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModalContainerProps {
  modals: ModalNotification[];
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ modals }) => {
  return (
    <>
      {modals.map((modal) => (
        <Modal key={modal.id} modal={modal} />
      ))}
    </>
  );
};
