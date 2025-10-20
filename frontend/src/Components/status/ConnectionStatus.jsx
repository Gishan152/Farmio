import React, { useState, useEffect } from 'react';
import { 
  checkBackendConnection, 
  getConnectionStatus, 
  attemptReconnect,
  CONNECTION_STATES
} from '../../Utils/connectionStatus';

/**
 * Component to display the current backend connection status
 * and provide reconnect functionality
 */
const ConnectionStatus = ({ onStatusChange, className = '' }) => {
  const [status, setStatus] = useState(getConnectionStatus());
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // Check connection on mount
    checkBackendConnection().then(isConnected => {
      const currentStatus = getConnectionStatus();
      setStatus(currentStatus);
      if (onStatusChange) onStatusChange(currentStatus);
    });
  }, []);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    const success = await attemptReconnect();
    setIsReconnecting(false);
    
    const currentStatus = getConnectionStatus();
    setStatus(currentStatus);
    if (onStatusChange) onStatusChange(currentStatus);
    
    return success;
  };

  const statusStyles = {
    [CONNECTION_STATES.CONNECTED]: {
      className: 'bg-green-100 text-green-800 border-green-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: 'Connected'
    },
    [CONNECTION_STATES.DISCONNECTED]: {
      className: 'bg-red-100 text-red-800 border-red-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      text: 'Disconnected'
    },
    [CONNECTION_STATES.RECONNECTING]: {
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      text: 'Reconnecting...'
    },
    [CONNECTION_STATES.UNKNOWN]: {
      className: 'bg-gray-100 text-gray-800 border-gray-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'Checking...'
    }
  };

  const currentStyle = statusStyles[status.status] || statusStyles[CONNECTION_STATES.UNKNOWN];

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-md border ${currentStyle.className} ${className}`}>
      <span>{currentStyle.icon}</span>
      <span className="text-sm font-medium">{currentStyle.text}</span>
      
      {status.status === CONNECTION_STATES.DISCONNECTED && (
        <button 
          onClick={handleReconnect}
          disabled={isReconnecting}
          className="ml-2 text-xs py-1 px-2 rounded bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          {isReconnecting ? 'Trying...' : 'Reconnect'}
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;