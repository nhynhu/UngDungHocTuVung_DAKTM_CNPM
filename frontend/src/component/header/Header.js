import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SearchBox from '../search/SearchBox';
import AuthModal from '../common/AuthModal';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [currentFeature, setCurrentFeature] = useState('');

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // SỬA LỖI: Thêm logic auth protection cho navigation
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
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img
                            src="logo192.png"
                            alt="Logo"
                            style={{
                                width: 30,
                                height: 'auto',
                                transform: 'scale(2.3)',
                                transformOrigin: 'left center',
                                marginLeft: '35px',
                                marginTop: '10px'
                            }}
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav style={{ marginLeft: '35%' }}>
                            <SearchBox />
                        </Nav>
                        <Nav className="ms-auto">
                            {user ? (
                                <NavDropdown title={`Setting (${user.fullname})`} id="navbarScrollingDropdown">
                                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => handleProtectedNavigation('/topics', 'Learn')}>
                                        Learn
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => handleProtectedNavigation('/test', 'Test')}>
                                        Test
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>Log out</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <>
                                    <NavDropdown title="Setting" id="navbarScrollingDropdown">
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action5">Log out</NavDropdown.Item>
                                    </NavDropdown>
                                    <Button className='btn-login' onClick={handleLoginClick}>Log in</Button>
                                    <Button className='btn-signup' onClick={handleSignupClick}>Sign up</Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

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

export default Header;