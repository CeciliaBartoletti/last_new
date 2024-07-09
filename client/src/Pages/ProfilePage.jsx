import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../App';
import { Container, Row, Col } from 'react-bootstrap';
import { API } from '../API';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { loggedIn, user } = useContext(Context);
    const [games, setGames] = useState([]);

    useEffect(() => {
        if (!loggedIn) {
            navigate('/login');
        }
    }, [navigate, loggedIn]);

    useEffect(() => {
        const fetchGames = async () => {
            // setLoading(true);
            try {
                const fetchedGames = await API.getGames(user?.id);
                console.log('sam fetchedGames', fetchedGames);
                setGames(fetchedGames);
            } catch (error) {
                console.log('sam error', error);
                // setError(error.message);
                // setLoading(false);
            }
        };
            fetchGames();
    }, []);

    console.log('sam games', games);





    return (
        <Container className="profileContainer">
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h2 className="title">Hello, {user?.name}!</h2>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <span>Here you can see the history of all your games played since you registered!</span>
                </Col>
            </Row>
        </Container>
    );
}