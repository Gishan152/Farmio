import { useState, useEffect } from 'react';

// Custom icons
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Notification component
const Notification = ({
  id,
  type = 'info',
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Different types of notifications
  const typeConfig = {
    info: {
      icon: <InfoIcon />,
      bgColor: 'bg-pastel-blue',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300'
    },
    success: {
      icon: <SuccessIcon />,
      bgColor: 'bg-pastel-green',
      textColor: 'text-green-800',
      borderColor: 'border-green-300'
    },
    warning: {
      icon: <WarningIcon />,
      bgColor: 'bg-pastel-yellow',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300'
    },
    error: {
      icon: <ErrorIcon />,
      bgColor: 'bg-pastel-red',
      textColor: 'text-red-800',
      borderColor: 'border-red-300'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose && onClose(id), 300); // Allow time for animation to complete
      }, duration);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(id), 300);
  };
  
  return (
    <div 
      className={`transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'} 
      flex items-center p-4 mb-3 rounded-lg border shadow-sm ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <div className="flex-shrink-0">
        {config.icon}
      </div>
      <div className="ml-3 flex-grow">
        {message}
      </div>
      <button 
        className="ml-auto flex-shrink-0 p-1 rounded-full hover:bg-white hover:bg-opacity-20 focus:outline-none"
        onClick={handleClose}
      >
        <CloseIcon />
      </button>
    </div>
  );
};

// Notifications container
const NotificationsContainer = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-full space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export { Notification, NotificationsContainer };