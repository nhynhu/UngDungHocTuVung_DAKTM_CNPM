import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap-icons/font/bootstrap-icons.css';
const Header = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand>
                  <img
                    src="logo192.png"
                    alt="Logo"
                    style={{ width: 40, height:'auto'}}
                  />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav style={{ marginLeft: '150px' }}>
                        <Form className="d-flex" style={{ alignItems: 'center', gap: '8px' }}>
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                style={{ height: '32px', borderRadius: '20px', fontSize: '1rem', width: '250px' }}
                            />
                            <Button style={{ backgroundColor: '#FFDDDD', borderColor: '#FFDDDD', color: '#fff', height: '32px', padding: '0 12px' }}>
                              <img src="/image/search-icon.png" alt="search" style={{ width: 20, height: 20 }} />
                            </Button>
                        </Form>
                    </Nav>
                    <Nav className="ms-auto">
                        <NavDropdown title="Setting" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="#action3">Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5">Log out</NavDropdown.Item>
                        </NavDropdown>
                        <Button className='btn-login'>Log in</Button>
                        <Button className='btn-signup'>Sign up</Button>
                        
                    </Nav>    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;