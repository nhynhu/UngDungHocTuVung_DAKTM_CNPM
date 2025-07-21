import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthProvider: Initializing...');
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                console.log('AuthProvider: User restored from localStorage', parsedUser);
            } catch (error) {
                console.error('AuthProvider: Error parsing user data', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else {
            console.log('AuthProvider: No stored credentials found');
        }
        setLoading(false);
    }, []);

    const login = (token, userData) => {
        console.log('AuthProvider: Login called', { token, userData });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        console.log('AuthProvider: Logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAuthenticated = () => {
        const authenticated = !!user && !!localStorage.getItem('token');
        console.log('AuthProvider: isAuthenticated check', { user, token: !!localStorage.getItem('token'), result: authenticated });
        return authenticated;
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};