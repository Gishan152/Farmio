import React, { useState } from 'react';
import api from '../API/client';

const TestConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      // Test API Gateway health
      const response = await api.get('/api/auth/health');
      setResult(`✅ Connection successful! Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.error('Connection test failed:', error);
      if (error.response) {
        setResult(`❌ Connection failed with status ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        setResult(`❌ Network error: Unable to reach backend at ${import.meta.env.VITE_API_GATEWAY_URL}`);
      } else {
        setResult(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testWithFallback = async () => {
    setLoading(true);
    setResult('Testing with fallback endpoints...');
    
    try {
      // Try different endpoints to test connectivity
      const endpoints = [
        '/api/auth/health',
        '/api/test/admin',
        '/api/auth/status'
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint);
          setResult(`✅ Connection successful at ${endpoint}! Response: ${JSON.stringify(response.data, null, 2)}`);
          return;
        } catch (err) {
          console.log(`Failed ${endpoint}:`, err.response?.status);
          continue;
        }
      }
      
      setResult('❌ All test endpoints failed. Backend may not be fully started.');
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Backend Connection Test</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Configuration</h2>
        <p><strong>API Gateway URL:</strong> {import.meta.env.VITE_API_GATEWAY_URL}</p>
        <p><strong>Frontend URL:</strong> {window.location.origin}</p>
      </div>

      <div className="space-y-4 mb-6">
        <button
          onClick={testBackendConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded mr-4"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testWithFallback}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
        >
          Test Multiple Endpoints
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Test Result:</h3>
        <pre className="whitespace-pre-wrap text-sm">{result || 'Click "Test Connection" to verify backend connectivity'}</pre>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Expected Services:</strong></p>
        <ul className="list-disc list-inside mt-2">
          <li>API Gateway: Port 8080</li>
          <li>Auth Service: Port 8085</li>
          <li>Eureka Server: Port 8761</li>
          <li>Order Service: Port 8086</li>
          <li>Warehouse Service: Available</li>
          <li>Crop Listing Service: Port 8087</li>
        </ul>
      </div>
    </div>
  );
};

export default TestConnection;
