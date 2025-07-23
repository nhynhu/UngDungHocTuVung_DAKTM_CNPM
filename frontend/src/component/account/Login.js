import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Please enter your password');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('🚀 Starting login...', { email: formData.email });

      const result = await ApiService.login(formData);
      console.log('✅ Login successful:', { user: result.user?.email });

      login(result.user, result.token);
      // Lưu userId vào localStorage để trang profile dùng
      if (result.user?.id) {
        localStorage.setItem('userId', result.user.id);
      }
      // SỬA LỖI: Navigate sau khi state đã update
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);

    } catch (error) {
      console.error('❌ Login error:', error);

      // SỬA LỖI: Better error handling
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('timeout')) {
        setError('Connection timeout. Please try again.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img
        src="/image/Screenshot 2025-07-09 182720.png"
        alt="VocabMafia Logo"
        className="auth-logo-corner"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      />

      <div className="login-container">
        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Sign In</h2>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-auth"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-end mt-2">
              <button
                type="button"
                className="btn btn-link p-0"
                style={{ fontSize: '0.95rem' }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => navigate('/signup')}
                  disabled={loading}
                >
                  Sign up now
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
