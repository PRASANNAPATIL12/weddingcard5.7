import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';
import { Eye, EyeOff, User, Lock, Heart } from 'lucide-react';

const LoginPage = () => {
  const { themes, currentTheme } = useAppTheme();
  const theme = themes[currentTheme];
  const navigate = useNavigate();
  const { login } = useUserData();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const testConnection = async (backendUrl) => {
    try {
      const response = await fetch(`${backendUrl}/api/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  };

  const makeRequest = async (url, options, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, options);
        return response;
      } catch (error) {
        console.error(`Request attempt ${i + 1} failed:`, error);
        if (i === retries) {
          throw error;
        }
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Login attempt starting...');
      
      // Primary authentication via MongoDB backend API
      let backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      // Check if we're in production environment
      if (!backendUrl || window.location.origin.includes('emergentagent.com')) {
        // Production environment - use relative URL
        backendUrl = '';
      } else if (!backendUrl && window.location.origin.includes('localhost')) {
        backendUrl = 'http://localhost:8001';
      }
      
      console.log('Login attempt using backend URL:', backendUrl);
      
      const response = await makeRequest(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login successful with MongoDB backend:', result);
        
        // Store user in localStorage for frontend caching
        const users = JSON.parse(localStorage.getItem('wedding_users') || '{}');
        users[result.user_id] = {
          id: result.user_id,
          username: result.username,
          password: formData.password, // Store for offline access
          created_at: new Date().toISOString()
        };
        localStorage.setItem('wedding_users', JSON.stringify(users));
        
        // Use UserDataContext login function
        login({
          sessionId: result.session_id,
          userId: result.user_id,
          username: result.username
        });
        
        console.log('Navigating to user page...');
        navigate(`/${result.username}`); // Navigate to user's personal page
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        
        // Fallback to localStorage authentication if backend fails
        console.log('Trying localStorage fallback...');
        const users = JSON.parse(localStorage.getItem('wedding_users') || '{}');
        const foundUser = Object.values(users).find(user => 
          user.username === formData.username && user.password === formData.password
        );
        
        if (foundUser) {
          console.log('Login successful with localStorage fallback');
          const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          
          login({
            sessionId,
            userId: foundUser.id,
            username: foundUser.username
          });
          
          navigate(`/${foundUser.username}`);
        } else {
          setError('Incorrect username or password. Please check your credentials.');
        }
      }
    } catch (error) {
      console.error('Login error details:', error);
      
      // Fallback to localStorage authentication on network error
      try {
        console.log('Network error, trying localStorage fallback...');
        const users = JSON.parse(localStorage.getItem('wedding_users') || '{}');
        const foundUser = Object.values(users).find(user => 
          user.username === formData.username && user.password === formData.password
        );
        
        if (foundUser) {
          console.log('Login successful with localStorage fallback');
          const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          
          login({
            sessionId,
            userId: foundUser.id,
            username: foundUser.username
          });
          
          navigate(`/${foundUser.username}`);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } catch (fallbackError) {
        console.error('Fallback login also failed:', fallbackError);
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ 
        background: theme.gradientPrimary,
        fontFamily: theme.fontSecondary 
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: theme.accent }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: theme.accent }}
        />
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Heart 
              className="w-16 h-16 mx-auto animate-pulse"
              style={{ color: theme.accent }}
            />
          </div>
          <h1 
            className="text-4xl font-light mb-2"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Welcome Back
          </h1>
          <p 
            className="text-lg"
            style={{ color: theme.textLight }}
          >
            Sign in to customize your wedding card
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                Username
              </label>
              <div className="relative">
                <User 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: theme.textLight }}
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    focusRingColor: theme.accent,
                    borderColor: theme.accent + '30'
                  }}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: theme.textLight }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    focusRingColor: theme.accent,
                    borderColor: theme.accent + '30'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  style={{ color: theme.textLight }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: theme.gradientAccent,
                boxShadow: `0 10px 30px ${theme.accent}30`
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p style={{ color: theme.textLight }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold hover:underline transition-colors"
                style={{ color: theme.accent }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-sm hover:underline transition-colors"
            style={{ color: theme.textLight }}
          >
            ← Back to Wedding Card
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;