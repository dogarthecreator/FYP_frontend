import { toast } from 'react-toastify';

const showNotification = (type, message) => {
  const style = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    style: {
      backgroundColor: '#F8F8F8', // Light background color for the toast
      color: '#343434', // Dark text color
      border: '1px solid #343434', // Border color
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    },
    progressStyle: {
      backgroundColor: '#343434', // Progress bar color
    },
  };
  if (type === 'error') {
    toast.error(message, style);
  }
  if (type === 'success') {
    toast.success(message, style);
  }
  if (type === 'warning') {
    toast.warning(message, style);
  }
  if (type === 'info') {
    toast.info(message, style);
  }
};
export { showNotification };
