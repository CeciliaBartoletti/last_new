import Button from 'react-bootstrap/Button';
import hp_meme from '../assets/hp_meme.jpg'
import { useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Container className="hpContainer">
            <Row className="align-items-center hpContainer">
                <Col xs={6}>
                    <Image src={hp_meme} fluid />
                </Col>
                <Col xs={6} >
                    <Row>
                        <h1 className="hpTitle">How to play?</h1>
                    </Row>
                    <Row >
                        <p className="text">
                            The game is very simple!
                            Within each round you will be presented with a meme: choose the phrase that best fits the image
                            and earn as many points as possible!
                        </p>
                        <p className="text">
                            If you are not registered, you can only play 1-round matches.
                            On the other side, as a registered user you will be able to play 3-round matches and have a history of your matches!
                        </p>
                    </Row>
                    <Row className="flex justify-content-center">
                        <Button size="lg" className="playButton" variant="primary" onClick={() => { event.preventDefault(); navigate("/game") }}>Play now!</Button>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}