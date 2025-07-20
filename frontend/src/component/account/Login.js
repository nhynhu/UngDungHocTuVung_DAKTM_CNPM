import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';

const Login = () => {
  return (
    <div className="Loginscreen">
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
        <div className="text-center">
          <Button type="submit" className="login-button">Log In</Button>
          <NavLink to='/signup' className='nav-link'>Register</NavLink>
        </div>
      </Form>
    </div>
  );
};

export default Login;
