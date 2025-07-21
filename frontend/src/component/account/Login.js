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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(formData);
      login(response.token, response.user);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Logo ở góc trên trái */}
      <img
        src="/image/Screenshot 2025-07-09 182720.png"
        alt="VocabMafia Logo"
        className="auth-logo-corner"
      />

      {/* Form ở giữa */}
      <div className="login-container">
        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
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
              />
            </div>

            <button
              type="submit"
              className="btn-auth"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>

            <div className="auth-footer">
              <p>Don't have an account?
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="link-btn"
                >
                  Register
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
