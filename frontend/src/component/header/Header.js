import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SearchBox from '../search/SearchBox';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand>
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
                        <NavDropdown title="Setting" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="#action3">Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5">Log out</NavDropdown.Item>
                        </NavDropdown>
                        <Button className='btn-login' onClick={handleLoginClick}>Log in</Button>
                        <Button className='btn-signup' onClick={handleSignupClick}>Sign up</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;