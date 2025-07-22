import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../common/AuthModal';

const HomeMenu = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [currentFeature, setCurrentFeature] = useState('');

    // SỬA LỖI: Logic auth protection - không cần preventDefault cho onClick
    const handleProtectedNavigation = (path, featureName) => {
        if (!user) {
            setCurrentFeature(featureName);
            setShowAuthModal(true);
            return;
        }
        navigate(path);
    };

    const handleLoginFromModal = () => {
        setShowAuthModal(false);
        navigate('/login');
    };

    const handleCloseModal = () => {
        setShowAuthModal(false);
        setCurrentFeature('');
    };

    return (
        <>
            <div className="home-menu-container" style={{ minHeight: '100vh' }}>
                <Sidebar
                    rootStyles={{
                        [`.${sidebarClasses.container}`]: {
                            backgroundColor: '#ffdddd',
                            minHeight: '100vh',
                            width: '160px',
                        },
                    }}
                >
                    <Menu
                        style={{ marginTop: '48px' }}
                        menuItemStyles={{
                            button: ({ active, disabled }) => ({
                                color: disabled ? '#f5d9ff' : active ? '#e402a4' : '#222',
                                backgroundColor: active ? '#ffe6f2' : undefined,
                                fontWeight: active ? 'bold' : 'normal',
                                fontSize: active ? '1.5rem' : '1.1rem',
                                transition: 'all 0.2s',
                            }),
                        }}
                    >
                        {/* Home - Luôn cho phép truy cập */}
                        <MenuItem
                            icon={<img src="/image/iconhome.png" alt="Home" style={{ width: '32px' }} />}
                            component={<NavLink to="/" className="nav-link" />}
                        >
                            Home
                        </MenuItem>

                        {/* Learn - Cần auth protection */}
                        <MenuItem
                            icon={<img src="/image/learn.png" alt="Learn" style={{ width: '35px' }} />}
                            onClick={() => handleProtectedNavigation('/topics', 'Learn')}
                        >
                            Learn
                        </MenuItem>

                        {/* Test - Cần auth protection */}
                        <MenuItem
                            icon={<img src="/image/test.png" alt="Test" style={{ width: '32px' }} />}
                            onClick={() => handleProtectedNavigation('/test', 'Test')}
                        >
                            Test
                        </MenuItem>

                        {/* Profile - Chỉ hiện khi đã login */}
                        {user && (
                            <MenuItem
                                icon={<img src="/image/profile-icon.png" alt="Profile" style={{ width: '32px' }} />}
                                component={<NavLink to="/profile" className="nav-link" />}
                            >
                                Profile
                            </MenuItem>
                        )}
                    </Menu>

                    {/* Pink Panther mascot ở bottom */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        <img
                            src="/image/pinkpantherheart.png"
                            alt="Pink Panther"
                            style={{ width: '80px', opacity: 0.8 }}
                        />
                    </div>
                </Sidebar>
            </div>

            {/* Auth Modal */}
            <AuthModal
                show={showAuthModal}
                onHide={handleCloseModal}
                onLogin={handleLoginFromModal}
                featureName={currentFeature}
            />
        </>
    );
};

export default HomeMenu;
