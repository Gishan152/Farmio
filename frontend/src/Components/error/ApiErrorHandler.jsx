// ApiErrorHandler.jsx - Component for displaying API error messages
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error message component for API-related issues
 */
const ApiErrorHandler = ({ 
  isAuthError, 
  isApiError,
  isCorsError,
  diagnosticInfo,
  onRetry
}) => {
  const hasErrors = isAuthError || isApiError || isCorsError;
  
  if (!hasErrors) return null;
  
  return (
    <div className="mb-6">
      {/* Authentication Error Alert */}
      {isAuthError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">Authentication Error</p>
              <p className="text-sm">You need to be logged in with proper permissions to access this data.</p>
              <div className="mt-2 flex space-x-2">
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-xs"
                >
                  Login
                </button>
                <button 
                  onClick={onRetry}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-xs"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* API Connection Error Alert */}
      {isApiError && (
        <div className="mb-4 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg" role="alert">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-orange-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">API Connection Error</p>
              <p className="text-sm">Unable to connect to the API services. This could be due to:</p>
              <ul className="list-disc ml-5 text-sm">
                <li>Backend services not running</li>
                <li>Network connectivity problems</li>
                <li>Server maintenance</li>
              </ul>
              <div className="mt-2 flex space-x-2">
                <button 
                  onClick={onRetry}
                  className="bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 rounded text-xs"
                >
                  Retry Connection
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-xs"
                >
                  Reload Page
                </button>
              </div>
              
              {diagnosticInfo && (
                <div className="mt-2">
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium">Diagnostic Information</summary>
                    <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(diagnosticInfo, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* CORS Error Alert */}
      {isCorsError && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg" role="alert">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">CORS Policy Error</p>
              <p className="text-sm">The browser blocked requests to the API due to CORS policy. This is typically a server configuration issue.</p>
              <ul className="list-disc ml-5 text-sm mt-1">
                <li>The API server needs to allow requests from this origin</li>
                <li>Request headers may need to be adjusted</li>
              </ul>
              <div className="mt-2">
                <button 
                  onClick={onRetry}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded text-xs"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ApiErrorHandler.propTypes = {
  isAuthError: PropTypes.bool,
  isApiError: PropTypes.bool,
  isCorsError: PropTypes.bool,
  diagnosticInfo: PropTypes.object,
  onRetry: PropTypes.func
};

ApiErrorHandler.defaultProps = {
  isAuthError: false,
  isApiError: false,
  isCorsError: false,
  diagnosticInfo: null,
  onRetry: () => window.location.reload()
};

export default ApiErrorHandler;