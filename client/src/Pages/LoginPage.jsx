import Button from 'react-bootstrap/Button';
import hp_meme from '../assets/hp_meme.jpg'
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../Components/LoginForm';

export const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="hpContainer">
            <h2 className="title">Effettua il login e non perderti il tuo storico di gioco!</h2>
            <LoginForm />
        </div>
    )
}