import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.login(credentials)
      .then ( () => navigate( "/" ) )
      .catch( (err) => {
        if(err.message === "Unauthorized")
          setErrorMessage("Invalid username and/or password");
        else
          setErrorMessage(err.message);
        setShow(true);
      });
  };



  return (
    <Row>
      <Col md={6}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username' className='mb-3'>
              <Form.Label>email</Form.Label>
              <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
          </Form.Group>

          <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
          </Form.Group>

          <Button type='submit'>Login</Button>
          <Link className='btn btn-danger mx-2 my-2' to={'/'} >Cancel</Link>
      </Form>
    </Col>
  </Row>
  )
};

function LogoutButton(props) {
  return(
    <Button variant='outline-light' onClick={props.logout}>Logout</Button>
  )
}

export { LoginForm, LogoutButton };






// import { useState } from "react";
// import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import validator from "validator";

// /**
//  * The login page displayed on "/login"
//  * 
//  * @param props.loginCbk callback to perform the actual login
//  * @param props.errorAlertActive true when the error alert on the top is active and showing, false otherwise
//  */
// function LoginForm(props) {
//     const [email, setEmail] = useState("s123456@studenti.polito.it");
//     const [password, setPassword] = useState("password");

//     const [emailError, setEmailError] = useState("");
//     const [passwordValid, setPasswordValid] = useState(true);

//     const [waiting, setWaiting] = useState(false);

//     const handleSubmit = event => {
//         event.preventDefault();

//         // Validate form
//         const trimmedEmail = email.trim();
//         const emailError = validator.isEmpty(trimmedEmail) ? "Email must not be empty" : (
//             !validator.isEmail(trimmedEmail) ? "Not a valid email" : ""
//         );
//         const passwordValid = !validator.isEmpty(password);

//         // if (!emailError && passwordValid) {
//         //     setWaiting(true);
//         //     props.loginCbk(email, password, () => setWaiting(false));
//         // } else {
//         //     setEmailError(emailError);
//         //     setPasswordValid(passwordValid);
//         // }
//     };

//     return (
//         <Container fluid style={{ "marginTop": /**props.errorAlertActive**/ false ? "2rem" : "6rem" }}>
//             <Row className="justify-content-evenly">
//                 <Col md="3" style={{ "paddingLeft": "3rem" }}>
//                     <Link to="/"><i className="bi bi-arrow-left" />back</Link>
//                 </Col>
//                 <Col style={{ "maxWidth": "50rem", "minWidth": "30rem" }}>
//                     <Card>
//                         <Card.Header as="h2">Login</Card.Header>
//                         <Container style={{ "marginTop": "0.5rem", "padding": "1rem" }}>
//                             <Form noValidate onSubmit={handleSubmit}>
//                                 <Row className="mb-3">
//                                     <Form.Group as={Col}>
//                                         <Form.Label>Email</Form.Label>
//                                         <Form.Control isInvalid={!!emailError}
//                                             type="email"
//                                             placeholder="mail@provider.com"
//                                             value={email}
//                                             autoFocus
//                                             onChange={event => { setEmail(event.target.value); setEmailError(""); }} />
//                                         <Form.Control.Feedback type="invalid">
//                                             {emailError}
//                                         </Form.Control.Feedback>
//                                     </Form.Group>
//                                 </Row>
//                                 <Row className="mb-3">
//                                     <Form.Group as={Col}>
//                                         <Form.Label>Password</Form.Label>
//                                         <Form.Control isInvalid={!passwordValid}
//                                             type="password"
//                                             placeholder="Password"
//                                             value={password}
//                                             onChange={event => { setPassword(event.target.value); setPasswordValid(true); }} />
//                                         <Form.Control.Feedback type="invalid">
//                                             Password must not be empty
//                                         </Form.Control.Feedback>
//                                     </Form.Group>
//                                 </Row>
//                                 <Button type="submit" disabled={waiting}>
//                                     {
//                                         waiting ?
//                                             <>
//                                                 <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
//                                                 {" "}
//                                             </>
//                                             : false
//                                     }
//                                     Login
//                                 </Button>
//                             </Form>
//                         </Container>
//                     </Card>
//                 </Col>
//                 <Col md="3" />
//             </Row>
//         </Container>
//     );
// }

// export { LoginForm };
