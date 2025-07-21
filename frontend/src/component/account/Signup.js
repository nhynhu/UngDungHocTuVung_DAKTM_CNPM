import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🚀 Starting registration...', formData);

      const { confirmPassword, ...submitData } = formData;
      const result = await ApiService.register(submitData);

      console.log('✅ Registration successful:', result);
      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay.');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('❌ Registration error:', error);

      // Handle different error types
      if (error.message.includes('timeout')) {
        setError('Kết nối bị timeout. Vui lòng thử lại.');
      } else if (error.message.includes('fetch')) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối.');
      } else if (error.message.includes('409') || error.message.includes('already exists')) {
        setError('Email đã được sử dụng. Vui lòng chọn email khác.');
      } else {
        setError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <img
        src="/image/Screenshot 2025-07-09 182720.png"
        alt="VocabMafia Logo"
        className="auth-logo-corner"
      />

      <div className="login-container">
        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Đăng ký tài khoản</h2>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="fullname">Họ tên</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
                placeholder="Nhập họ tên của bạn"
              />
            </div>

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
                placeholder="Nhập email của bạn"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
                placeholder="Nhập lại mật khẩu"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-auth"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>

            <div className="auth-footer">
              <p>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => navigate('/login')}
                  disabled={loading}
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
