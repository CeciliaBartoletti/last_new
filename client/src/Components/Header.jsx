import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import { Context } from '../App';

function Header(props) {
    const {logout} = props;
    const navigate = useNavigate();
    const { loggedIn, user} = useContext(Context);
    console.log('sam user', user);
    
    const handleLoginLogout = () => {
        event.preventDefault();
        if (loggedIn) {
            logout();
        } else {
            navigate("/login");
        }
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand onClick={event => { event.preventDefault(); navigate("/") }} >What do you meme?</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    {loggedIn && <Nav.Link onClick={event => { event.preventDefault(); navigate("/profile") }} >Profile</Nav.Link>}
                        <Nav.Link onClick={() => handleLoginLogout()} >{loggedIn ? 'Logout' : 'Login'}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;