import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin' // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Here you would integrate with your backend API
      console.log('Login attempt with:', formData);
      
      // For development, we'll still use a mock response
      // In production, this should be replaced with an actual API call
      let response;
      
      try {
        // Attempt to call the real API
        const apiResponse = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        
        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          throw new Error(errorData.message || 'Login failed');
        }
        
        response = await apiResponse.json();
      } catch (apiError) {
        console.error("API error:", apiError);
        // For development/testing purposes - always login successfully in development
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.warn("Development mode: Using mock authentication");
          response = {
            success: true,
            token: `admin-token-${Date.now()}`,  // Generate a unique token
            role: 'admin'
          };
        } else {
          throw apiError; // In production, don't ignore API errors
        }
      }
      
      // Store token and role in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', 'admin');
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
      
      setIsLoading(false);
      
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center w-full max-w-md px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-farmio-dark">Farmio</h1>
            <p className="mt-2 text-gray-600">Management Portal</p>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Login as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'admin'})}
                  className={`py-2.5 px-4 text-sm font-medium rounded-md border transition-all ${
                    formData.role === 'admin'
                      ? 'bg-farmio text-white border-farmio'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/moderator/login')}
                  className={`py-2.5 px-4 text-sm font-medium rounded-md border transition-all 
                    bg-white text-gray-700 border-gray-300 hover:bg-gray-50`}
                >
                  Moderator
                </button>
              </div>
            </div>
            
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-farmio"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-farmio"
                placeholder="••••••••"
                required
              />
            </div>
            
            {/* Forgot Password Link */}
            <div className="text-right">
              <a 
                href="#" 
                className="text-sm text-farmio hover:underline"
              >
                Forgot password?
              </a>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-white bg-farmio rounded-md hover:bg-farmio-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-farmio transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <p className="mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Farmio. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginForm;