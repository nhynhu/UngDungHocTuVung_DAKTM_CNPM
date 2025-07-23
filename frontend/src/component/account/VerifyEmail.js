import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying');
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                await ApiService.verifyEmail({ token });
                setStatus('success');
                setTimeout(() => navigate('/login'), 2000);
            } catch (err) {
                setStatus('error');
            }
        };
        if (token) verify();
        else setStatus('error');
    }, [token, navigate]);

    return (
        <div className="signup-page">
            <div className="login-container">
                <div className="auth-card">
                    <h2 className="text-center mb-4">Email Verification</h2>
                    {status === 'verifying' && <div>Verifying...</div>}
                    {status === 'success' && (
                        <div className="alert alert-success">
                            Email verified! Redirecting to login...
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="alert alert-danger">
                            Verification failed or link expired.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;