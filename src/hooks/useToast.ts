import { toast, ToastOptions } from 'react-toastify';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  message: string;
  type?: ToastType;
  options?: ToastOptions;
}

export const useToast = () => {
  const showToast = ({ message, type = 'info', options }: ToastConfig) => {
    const defaultOptions: ToastOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    };

    switch (type) {
      case 'success':
        toast.success(message, defaultOptions);
        break;
      case 'error':
        toast.error(message, defaultOptions);
        break;
      case 'warning':
        toast.warning(message, defaultOptions);
        break;
      case 'info':
      default:
        toast.info(message, defaultOptions);
        break;
    }
  };

  return {
    success: (message: string, options?: ToastOptions) =>
      showToast({ message, type: 'success', options }),
    error: (message: string, options?: ToastOptions) =>
      showToast({ message, type: 'error', options }),
    warning: (message: string, options?: ToastOptions) =>
      showToast({ message, type: 'warning', options }),
    info: (message: string, options?: ToastOptions) =>
      showToast({ message, type: 'info', options }),
  };
};


