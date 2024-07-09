import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { API } from '../API';
import { Timer } from '../Components/Timer';
import { Context } from '../App';

export const Game = () => {
    const [round, setRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(30); // Start the timer at 30 seconds
    const [randomNumbers, setRandomNumbers] = useState([]);
    const [imagePaths, setImagePaths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [phrases, setPhrases] = useState([]);
    const [score, setScore] = useState(0);
    const [dataGame, setDataGame] = useState([]);
    const [playing, setPlaying] = useState(true);

    const {user} = useContext(Context);

    const navigate = useNavigate();

    useEffect(() => {
        const generateUniqueRandomNumbers = () => {
            const numbers = new Set();
            while (numbers.size < 3) {
                const randomNumber = Math.floor(Math.random() * 10) + 1; // Genera un numero tra 1 e 10
                numbers.add(randomNumber);
            }
            return [...numbers];
        };
        const numbers = generateUniqueRandomNumbers();
        setRandomNumbers(numbers);
        // Genera i percorsi delle immagini basandosi sui numeri randomici
        const paths = numbers.map(number => `../../public/${number}.jpg`); // Assumendo che le immagini siano nella cartella public/images
        setImagePaths(paths);
    }, []);

    const handleNextRound = () => {
        setRound((prevRound) => prevRound + 1); // Increase round
        setPlaying(true);
        setTimeLeft(30); // Reset timer
    };

    const handleClickButton = (phrase) => {
        setTimeLeft(0); // Stop the timer
        setPlaying(false);
        if (phrase.correct) {
            setScore((prevScore) => prevScore + 5);
        }
        setDataGame((prevDataGame) => [
            ...prevDataGame,
            { ...phrase, imageId: randomNumbers[round - 1] },
        ]);
        round == 3 && setPlaying(false); // Increase round
    }

    const endGame = (userId, score, rounds) => {
            console.log('sam userId:', userId);
            console.log('sam score:', score);
            console.log('sam rounds:', rounds);
            API.saveGame(userId, score, rounds);
            navigate("/"); // Redirect to the home page
    }

    useEffect(() => {
        const fetchPhrases = async () => {
            setLoading(true);
            try {
                const fetchedPhrases = await API.getMemePhrases(randomNumbers[round - 1]);
                setPhrases(fetchedPhrases);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        if (randomNumbers?.length != 0) {
            fetchPhrases();
        }
    }, [round, randomNumbers]);

    return (
        <div className="externalContainer">
            <div className="roundContainer">
                <h1 className="roundNumber">Round n°{round}</h1>
                <Timer
                    setTimeLeft={setTimeLeft}
                    timeLeft={timeLeft} />
                <div className="roundContent">
                    <div className="imageContainer">
                        <img src={imagePaths[round - 1]} className="memeRound" alt="meme" />
                    </div>
                    <div className="phrases">
                        {phrases?.phrases?.map((phrase, index) => (
                            <div key={index}>
                                <Button
                                    disabled={!playing || timeLeft === 0}
                                    onClick={() => handleClickButton(phrase)}
                                    className="phraseButton" variant="outline-primary">{phrase?.text} {phrase?.correct ? 'sì' : 'no'}</Button>
                            </div>
                        ))}
                    </div>
                </div>
                {timeLeft === 0 && round < 3 && (
                    <div className="nextRoundButton">
                        <Button onClick={handleNextRound}>Next Round</Button>
                    </div>
                )}
                <div>
                    <h2>score: {score}</h2>
                    <h2>Playing: {playing ? 'true' : 'false'}</h2>
                    {round == 3 && !playing && <Button onClick={() => endGame(user?.id, score, dataGame)}>End Game!</Button>}
                </div>
            </div>
        </div>
    )
}