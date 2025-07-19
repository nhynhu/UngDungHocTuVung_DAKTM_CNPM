import React from 'react';
import { Sidebar, Menu, MenuItem,sidebarClasses } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
const HomeMenu = () => {
    return (
        <div className="home-menu-container">
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
                            color: disabled ? '#f5d9ff' : active ? '#e402a4' : '#222', // màu đen, khi active thành hồng
                            backgroundColor: active ? '#ffe6f2' : undefined,
                            fontWeight: active ? 'bold' : 'normal', // chữ đậm khi active
                            fontSize: active ? '1.5rem' : '1.1rem', // chữ to hơn khi active
                            transition: 'all 0.2s',
                        }),
                    }}
                >
                    <MenuItem component={<NavLink to="/" className="nav-link" />}>Home</MenuItem>
                    <MenuItem component={<NavLink to="/topics" className="nav-link" />}>Learn</MenuItem>
                    <MenuItem component={<NavLink to="/tests" className="nav-link" />}>Test</MenuItem>
                </Menu>
            </Sidebar>
        </div>
    );
};

export default HomeMenu;
