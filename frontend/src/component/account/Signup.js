import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
const Signup = () => {
  return (
     <div className="Signupscreen">
      <div className="logo-container">
         <img src="image/Screenshot 2025-07-09 182720.png" alt="Logo" className="login-logo"></img>
      </div>
      <Form name="form">
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlPassword1">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formFullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text"/></Form.Group>
        <div className="text-center">
          <Button type="submit" className="signup-button">Register</Button>
          <NavLink to='/logins' className='nav-link'>Log In</NavLink>
        </div>
      </Form>
    </div>
  );
};

export default Signup;
