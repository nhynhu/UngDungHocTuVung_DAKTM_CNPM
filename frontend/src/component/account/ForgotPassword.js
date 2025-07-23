import React, { useState } from 'react';
import ApiService from '../../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await ApiService.forgotPassword({ email });
            setSent(true);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to send reset email.');
        }
    };

    return (
        <div className="signup-page">
            <div className="login-container">
                <div className="auth-card">
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    {sent ? (
                        <div className="alert alert-success">
                            Please check your email for the password reset link.
                        </div>
                    ) : (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="submit" className="btn btn-auth" style={{ marginTop: 10 }}>
                                Send Reset Link
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;