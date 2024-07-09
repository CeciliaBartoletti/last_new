import { useEffect } from "react";

export const Timer = (props) => {
    const { timeLeft, setTimeLeft } = props;

    useEffect(() => {
        let intervalId;
        if (timeLeft > 0) {
            intervalId = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1); // Decrease timeLeft by one every second
            }, 1000);
        }
        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    return (
        <div className="timer">
            time left: <span className={`${timeLeft < 10 ? 'danger' : ''}`}>{timeLeft} sec</span>
        </div>
    )
}